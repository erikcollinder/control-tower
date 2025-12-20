import type { ComponentType } from 'react'
import { ChevronDown, MessageCircle } from 'lucide-react'
import { NodePill } from './NodePill'
import type { SelectedNodeInfo } from './Canvas'
import type { OpenPanelInfo } from './ChatPanel'
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
  
  selectedNodes?: SelectedNodeInfo[]
  openPanel?: OpenPanelInfo | null
  onClearSelection?: (nodeId?: string) => void
  onClearOpenPanel?: () => void
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
  selectedNodes = [],
  openPanel,
  onClearSelection,
  onClearOpenPanel,
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
        {!isChatOpen && (selectedNodes.length > 0 || openPanel) && (
          <div className="header-context-pills">
            {selectedNodes.map(node => (
              <NodePill
                key={node.id}
                label={node.label}
                nodeType={node.type}
                className="selection-pill"
                onRemove={() => onClearSelection?.(node.id)}
              />
            ))}
            {openPanel && (
              <NodePill
                label={openPanel.label}
                nodeType={openPanel.type}
                className="panel-pill"
                onRemove={onClearOpenPanel}
              />
            )}
          </div>
        )}
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
