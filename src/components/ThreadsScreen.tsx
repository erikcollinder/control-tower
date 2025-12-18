import { useId, useState } from 'react'
import { Send } from 'lucide-react'
import './ThreadsScreen.css'

interface ThreadsScreenProps {
  title?: string
}

export function ThreadsScreen({ title = 'Threads' }: ThreadsScreenProps) {
  const textareaId = useId()
  const [text, setText] = useState('')

  const canSend = text.trim().length > 0
  const sendModifier =
    typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl'

  const submit = () => {
    if (!canSend) return

    // v1 stub: clear composer; real threads logic comes later
    setText('')
  }

  return (
    <div className="threads-screen">
      <div className="threads-shell">
        <div className="threads-header">
          <div className="threads-title">{title}</div>
          <div className="threads-subtitle">Start a new thread</div>
        </div>

        <div className="threads-composer">
          <label className="threads-label" htmlFor={textareaId}>
            Message
          </label>

          <textarea
            id={textareaId}
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
  )
}
