import { useState } from 'react'
import {
  Bot,
  ChevronRight,
  FileText,
  FolderOpen,
  Lightbulb,
  ListTodo,
  Search,
  Terminal,
} from 'lucide-react'
import './MoveBlocks.css'

export type StreamSegment = { id: string; text: string }

export function StreamText({ segments }: { segments: StreamSegment[] }) {
  return (
    <span className="stream-text">
      {segments.map((seg) => (
        <span key={seg.id} className="stream-segment">
          {seg.text}
        </span>
      ))}
    </span>
  )
}

export function UserMessageBubble({ content, sticky = false }: { content: string; sticky?: boolean }) {
  return (
    <div className={`user-message ${sticky ? 'sticky' : ''}`}>
      <div className="message-label">You</div>
      <div className="message-content">{content}</div>
    </div>
  )
}

function getToolIcon(toolName: string) {
  switch (toolName) {
    case 'read_file':
      return <FileText size={14} />
    case 'search_codebase':
      return <Search size={14} />
    case 'execute_command':
      return <Terminal size={14} />
    case 'list_files':
      return <FolderOpen size={14} />
    case 'think':
      return <Lightbulb size={14} />
    case 'create_procedure':
      return <ListTodo size={14} />

    // Common agent tools in this app/prototype
    case 'web_search':
      return <Search size={14} />

    default:
      return <Terminal size={14} />
  }
}

export function ThinkingBlock({
  segments,
  isCollapsed,
  onToggle,
  isStreaming,
}: {
  segments: StreamSegment[]
  isCollapsed: boolean
  onToggle: () => void
  isStreaming: boolean
}) {
  return (
    <div className={`move thinking-block ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="move-header" onClick={onToggle}>
        <Lightbulb size={14} />
        <span>Thinking</span>
        <ChevronRight size={14} className="chevron" />
      </div>
      <div className="move-content">
        <StreamText segments={segments} />
        {isStreaming && <span className="inline-cursor" />}
      </div>
    </div>
  )
}

export type ToolCallStatus = 'forming' | 'running' | 'done'

export function ToolCallBlock({
  name,
  inputText,
  inputObject,
  resultText,
  status,
  isCollapsed,
  onToggle,
}: {
  name: string
  inputText?: string
  inputObject?: Record<string, unknown>
  resultText?: string
  status: ToolCallStatus
  isCollapsed: boolean
  onToggle: () => void
}) {
  const showResult = typeof resultText === 'string' && resultText.length > 0

  return (
    <div className={`move tool-block ${isCollapsed ? 'collapsed' : ''} status-${status}`}>
      <div className="move-header" onClick={onToggle}>
        {getToolIcon(name)}
        <span className="tool-name">{name}</span>
        <span className={`tool-status-pill ${status}`}>{status}</span>
        <ChevronRight size={14} className="chevron" />
      </div>
      <div className="move-content">
        <div className="tool-args">
          {inputText ? (
            <pre className="mono-pre">{inputText}</pre>
          ) : (
            <pre className="mono-pre">{JSON.stringify(inputObject ?? {}, null, 2)}</pre>
          )}
          {(status === 'forming' || status === 'running') && <div className="shimmer" />}
        </div>

        {showResult && (
          <div className="tool-result">
            <div className="tool-result-label">Result</div>
            <div className="tool-result-content">
              <pre className="mono-pre">{resultText}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function LoadingIndicator({ label = 'Processing…' }: { label?: string }) {
  return (
    <div className="loading-indicator">
      <div className="loading-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <span>{label}</span>
    </div>
  )
}

export function AgentTurnView({
  title = 'Agent',
  moves,
  finalSegments,
  isStreaming,
}: {
  title?: string
  moves: Array<
    | { type: 'thinking'; id: string; segments: StreamSegment[]; isStreaming: boolean }
    | {
        type: 'tool_call'
        id: string
        name: string
        inputText?: string
        inputObject?: Record<string, unknown>
        resultText?: string
        status: ToolCallStatus
      }
  >
  finalSegments: StreamSegment[]
  isStreaming: boolean
}) {
  const [collapsedMoves, setCollapsedMoves] = useState<Set<string>>(new Set())

  const toggleMove = (moveId: string) => {
    setCollapsedMoves((prev) => {
      const next = new Set(prev)
      if (next.has(moveId)) next.delete(moveId)
      else next.add(moveId)
      return next
    })
  }

  return (
    <div className="agent-turn">
      <div className="turn-header">
        <Bot size={16} />
        <span>{title}</span>
        <span className="move-count">
          {moves.length} move{moves.length !== 1 ? 's' : ''}
        </span>
      </div>

      {moves.map((move) => {
        if (move.type === 'thinking') {
          return (
            <ThinkingBlock
              key={move.id}
              segments={move.segments}
              isCollapsed={collapsedMoves.has(move.id)}
              onToggle={() => toggleMove(move.id)}
              isStreaming={move.isStreaming}
            />
          )
        }

        return (
          <ToolCallBlock
            key={move.id}
            name={move.name}
            inputText={move.inputText}
            inputObject={move.inputObject}
            resultText={move.resultText}
            status={move.status}
            isCollapsed={collapsedMoves.has(move.id)}
            onToggle={() => toggleMove(move.id)}
          />
        )
      })}

      {isStreaming && <LoadingIndicator />}

      {finalSegments.length > 0 && (
        <div className="final-answer">
          <StreamText segments={finalSegments} />
          {isStreaming && <span className="inline-cursor" />}
        </div>
      )}
    </div>
  )
}
