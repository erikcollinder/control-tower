import type { ComponentType } from 'react'
import { ChevronDown, MessageCircle, Trash2 } from 'lucide-react'
import { NodePill } from './NodePill'
import { DropdownMenu, type DropdownMenuItem } from './DropdownMenu'
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
  contextMenuItems?: DropdownMenuItem[]

  showChatToggle?: boolean
  isChatOpen?: boolean
  onToggleChat?: () => void
  
  selectedNodes?: SelectedNodeInfo[]
  openPanel?: OpenPanelInfo | null
  onClearSelection?: (nodeId?: string) => void
  onClearOpenPanel?: () => void
}

export { Trash2 }

export function Header({
  sectionLabel,
  SectionIcon,
  contextLabel,
  ContextIcon,
  showContextChevron = false,
  contextMenuItems,
  showChatToggle = true,
  isChatOpen = false,
  onToggleChat,
  selectedNodes = [],
  openPanel,
  onClearSelection,
  onClearOpenPanel,
}: HeaderProps) {
  const hasContextMenu = contextMenuItems && contextMenuItems.length > 0

  const contextButton = (
    <button className="breadcrumb-item space-selector">
      {ContextIcon && (
        <div className="space-avatar">
          <ContextIcon size={12} />
        </div>
      )}
      <span>{contextLabel}</span>
      {(showContextChevron || hasContextMenu) && <ChevronDown size={14} />}
    </button>
  )

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
            {hasContextMenu ? (
              <DropdownMenu trigger={contextButton} items={contextMenuItems} align="left" />
            ) : (
              contextButton
            )}
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
