import { CheckSquare, LayoutGrid, Box, Settings, Users, Folder, Menu, MessageSquare } from 'lucide-react'
import './Sidebar.css'

interface NavItem {
  id: string
  icon: typeof CheckSquare
  label: string
  onClick?: () => void
}

const folders = Array(11).fill({ icon: Folder, label: 'Folder' })

interface SidebarProps {
  onSettingsClick?: () => void
  activeId?: string
  onNavigate?: (id: string) => void
}

export function Sidebar({ onSettingsClick, activeId = 'spaces', onNavigate }: SidebarProps) {
  const navItems: NavItem[] = [
    { id: 'tasks', icon: CheckSquare, label: 'Tasks', onClick: () => onNavigate?.('tasks') },
    { id: 'dashboard', icon: LayoutGrid, label: 'Dashboard', onClick: () => onNavigate?.('dashboard') },
    { id: 'threads', icon: MessageSquare, label: 'Threads', onClick: () => onNavigate?.('threads') },
    { id: 'spaces', icon: Box, label: 'Spaces', onClick: () => onNavigate?.('spaces') },
    { id: 'settings', icon: Settings, label: 'Settings', onClick: onSettingsClick },
    { id: 'team', icon: Users, label: 'Team', onClick: () => onNavigate?.('team') },
  ]

  return (
    <aside className="sidebar">
      <button className="sidebar-toggle">
        <Menu size={20} />
      </button>
      
      <nav className="sidebar-nav">
        {navItems.map((item, index) => (
          <button 
            key={index} 
            className={`nav-item ${item.id === activeId ? 'active' : ''}`}
            title={item.label}
            onClick={item.onClick}
          >
            <item.icon size={20} />
          </button>
        ))}
      </nav>

      <div className="sidebar-folders">
        {folders.map((item, index) => (
          <button key={index} className="folder-item" title={item.label}>
            <item.icon size={16} />
          </button>
        ))}
      </div>
    </aside>
  )
}

