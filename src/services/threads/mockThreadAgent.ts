import type { AgentStreamEvent } from '../agent/types'

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(16).slice(2)}-${Date.now()}`
}

/**
 * Mock agent turn stream for Threads.
 *
 * This is intentionally UI-first: it yields small deltas so the UI can render
 * “forming/loading/streaming” states without calling external APIs.
 */
export async function* runMockThreadTurn(userText: string): AsyncGenerator<AgentStreamEvent> {
  const thinkingId = uid('thinking')
  const toolId = uid('tool')

  yield { type: 'turn_start' }

  // Thinking
  yield { type: 'thinking_start', data: { id: thinkingId } }

  const thought =
    `Plan:\n` +
    `- Understand the request\n` +
    `- Search context\n` +
    `- Run tools\n` +
    `- Summarize\n\n` +
    `User asked: “${userText}”\n`

  for (const chunk of splitForStreaming(thought, 18)) {
    await sleep(55)
    yield { type: 'thinking_delta', data: { id: thinkingId, delta: chunk } }
  }

  yield { type: 'thinking_end', data: { id: thinkingId, thought } }

  // Tool call (forming args)
  yield { type: 'tool_start', data: { id: toolId, name: 'web_search' } }

  const argsJson = JSON.stringify(
    {
      queries: [
        `best practices ${userText}`,
        `examples of ${userText}`,
        `edge cases for ${userText}`,
      ],
    },
    null,
    2
  )

  for (const chunk of splitForStreaming(argsJson, 22)) {
    await sleep(45)
    yield { type: 'tool_delta', data: { id: toolId, delta: chunk } }
  }

  const toolInput = {
    queries: [
      `best practices ${userText}`,
      `examples of ${userText}`,
      `edge cases for ${userText}`,
    ],
  }

  yield { type: 'tool_end', data: { id: toolId, name: 'web_search', input: toolInput } }

  // Tool execution result
  await sleep(420)
  const toolResult =
    JSON.stringify(
      {
        results: [
          {
            title: 'Example result A',
            snippet: 'High-level guidance and implementation notes…',
          },
          {
            title: 'Example result B',
            snippet: 'Tradeoffs, pitfalls, and alternatives…',
          },
        ],
      },
      null,
      2
    ) + '\n'

  yield { type: 'tool_result', data: { id: toolId, name: 'web_search', result: toolResult } }

  // Final message
  const finalText =
    `Here’s what I’d do next:\n\n` +
    `1) Start with a clean data model for moves and tool calls.\n` +
    `2) Stream deltas into UI segments for a great “live” feel.\n` +
    `3) Keep tool calls compact by default, expandable on demand.\n\n` +
    `When you’re ready, we can swap this mock stream for Anthropic.\n`

  for (const chunk of splitForStreaming(finalText, 10)) {
    await sleep(38)
    yield { type: 'text_delta', data: { delta: chunk } }
  }

  yield { type: 'turn_end', data: { finalText, moveCount: 2 } }
}

function splitForStreaming(text: string, maxChunk: number) {
  const chunks: string[] = []
  let i = 0
  while (i < text.length) {
    chunks.push(text.slice(i, i + maxChunk))
    i += maxChunk
  }
  return chunks
}
