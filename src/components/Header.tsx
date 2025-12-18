import type { ComponentType } from 'react'
import { ChevronDown, MessageCircle } from 'lucide-react'
import './Header.css'

type HeaderIcon = ComponentType<{ size?: number | string }>

interface HeaderProps {
  sectionLabel: string
  SectionIcon?: HeaderIcon
  contextLabel?: string
  ContextIcon?: HeaderIcon
  showContextChevron?: boolean

  showChatToggle?: boolean
  isChatOpen?: boolean
  onToggleChat?: () => void
}

export function Header({
  sectionLabel,
  SectionIcon,
  contextLabel,
  ContextIcon,
  showContextChevron = false,
  showChatToggle = true,
  isChatOpen = false,
  onToggleChat,
}: HeaderProps) {
  return (
    <header className="header">
      <div className="breadcrumb">
        <button className="breadcrumb-item">
          {SectionIcon && <SectionIcon size={20} />}
          <span>{sectionLabel}</span>
        </button>
        {contextLabel && (
          <>
            <span className="breadcrumb-separator">/</span>
            <button className="breadcrumb-item space-selector">
              {ContextIcon && (
                <div className="space-avatar">
                  <ContextIcon size={12} />
                </div>
              )}
              <span>{contextLabel}</span>
              {showContextChevron && <ChevronDown size={14} />}
            </button>
          </>
        )}
      </div>

      <div className="header-actions">
        {showChatToggle && (
          <button
            className={`chat-toggle ${isChatOpen ? 'active' : ''}`}
            onClick={onToggleChat}
            title={isChatOpen ? 'Close chat' : 'Open chat'}
          >
            <MessageCircle size={18} />
          </button>
        )}
      </div>
    </header>
  )
}
