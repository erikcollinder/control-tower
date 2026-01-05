import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import './DropdownMenu.css'

export interface DropdownMenuItem {
  id: string
  label: string
  icon?: LucideIcon
  danger?: boolean
  onClick: () => void
}

interface DropdownMenuProps {
  trigger: ReactNode
  items: DropdownMenuItem[]
  align?: 'left' | 'right'
}

export function DropdownMenu({ trigger, items, align = 'left' }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const handleItemClick = (item: DropdownMenuItem) => {
    item.onClick()
    setIsOpen(false)
  }

  return (
    <div className="dropdown-container" ref={containerRef}>
      <div className="dropdown-trigger" onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      {isOpen && (
        <div className={`dropdown-menu ${align}`} ref={menuRef}>
          {items.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                className={`dropdown-item ${item.danger ? 'danger' : ''}`}
                onClick={() => handleItemClick(item)}
              >
                {Icon && <Icon size={14} />}
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

