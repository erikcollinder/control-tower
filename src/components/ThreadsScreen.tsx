import { useRef, useState } from 'react'
import { Send } from 'lucide-react'
import './ThreadsScreen.css'

type Rect = { top: number; left: number; width: number; height: number }

interface ThreadsScreenProps {
  title?: string
  onStartThread?: (text: string, fromRect?: Rect) => void
}

export function ThreadsScreen({ title = 'Threads', onStartThread }: ThreadsScreenProps) {
  const [text, setText] = useState('')
  const composerRef = useRef<HTMLDivElement>(null)

  const canSend = text.trim().length > 0
  const sendModifier =
    typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl'

  const submit = () => {
    if (!canSend) return

    const rect = composerRef.current?.getBoundingClientRect()
    const fromRect = rect
      ? { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
      : undefined

    onStartThread?.(text.trim(), fromRect)

    setText('')
  }

  return (
    <div className="threads-screen">
      <div className="threads-shell">
        <div className="threads-header">
          <div className="threads-title">{title}</div>
          <div className="threads-subtitle">Start a new thread</div>
        </div>

        <div className="threads-composer" ref={composerRef}>
          <div className="threads-composer-container">
            <textarea
              className="threads-textarea"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ask, search, or make anything…"
              rows={6}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                  e.preventDefault()
                  submit()
                }
              }}
            />

            <div className="threads-actions">
              <div className="threads-hint">Press {sendModifier} + Enter to send</div>
              <button
                type="button"
                className="threads-send"
                onClick={submit}
                disabled={!canSend}
              >
                <Send size={16} />
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
