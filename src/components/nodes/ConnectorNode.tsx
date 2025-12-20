import { useRef, useEffect, useState } from 'react'
import { Handle, Position, useReactFlow } from '@xyflow/react'
import { Plug2, Settings, ChevronDown, Cloud, Database, FolderOpen, Server, Mail } from 'lucide-react'
import { ConnectorPopover } from '../NodePopover'
import './nodes.css'

export type ConnectorType = 'salesforce' | 'sap' | 'sharepoint' | 'sftp' | 'email'

export interface ConnectorNodeData {
  label: string
  connectorType: ConnectorType
  testingMode: boolean
  casesPerMinute: number
  config: Record<string, string>
  onSpawnEvent?: () => void
}

interface ConnectorNodeProps {
  id: string
  data: ConnectorNodeData
}

interface StreamParticle {
  id: string
  x: number
  y: number
  speed: number
  size: number
}

const PARTICLE_COLOR = '#4f46e5'
const MAX_PARTICLES = 30
const CANVAS_HEIGHT = 60

const CONNECTOR_TYPES: { value: ConnectorType; label: string; icon: typeof Cloud }[] = [
  { value: 'salesforce', label: 'Salesforce', icon: Cloud },
  { value: 'sap', label: 'SAP', icon: Database },
  { value: 'sharepoint', label: 'SharePoint', icon: FolderOpen },
  { value: 'sftp', label: 'SFTP', icon: Server },
  { value: 'email', label: 'Email', icon: Mail },
]

export function ConnectorNode({ id, data }: ConnectorNodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<StreamParticle[]>([])
  const lastSpawnTimeRef = useRef(0)
  const animationIdRef = useRef<number | null>(null)
  const [showPopover, setShowPopover] = useState(false)
  const [showTypeDropdown, setShowTypeDropdown] = useState(false)
  const { setNodes } = useReactFlow()

  const connectorType = data.connectorType ?? 'salesforce'
  const testingMode = data.testingMode ?? false
  const casesPerMinute = data.casesPerMinute ?? 60
  const config = data.config ?? {}

  const spawnRateRef = useRef(casesPerMinute / 60)

  // Keep spawn rate ref in sync with props
  useEffect(() => {
    spawnRateRef.current = casesPerMinute / 60
  }, [casesPerMinute])

  // Spawn events into the main workflow when in testing mode
  useEffect(() => {
    if (!data.onSpawnEvent || !testingMode || casesPerMinute <= 0) return

    const intervalMs = (60 / casesPerMinute) * 1000
    const interval = setInterval(() => {
      data.onSpawnEvent?.()
    }, intervalMs)

    return () => clearInterval(interval)
  }, [casesPerMinute, testingMode, data.onSpawnEvent])

  const updateData = (updates: Partial<ConnectorNodeData>) => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, ...updates } }
          : node
      )
    )
  }

  const currentType = CONNECTOR_TYPES.find(t => t.value === connectorType) ?? CONNECTOR_TYPES[0]
  const TypeIcon = currentType.icon

  // Particle animation for testing mode
  useEffect(() => {
    if (!testingMode) {
      // Clear particles when not in testing mode
      particlesRef.current = []
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
        animationIdRef.current = null
      }
      return
    }

    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = CANVAS_HEIGHT * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${CANVAS_HEIGHT}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resizeCanvas()

    const canvasWidth = container.getBoundingClientRect().width
    const canvasHeight = CANVAS_HEIGHT

    const spawnParticle = (): StreamParticle => {
      const verticalSpread = 15
      const centerY = canvasHeight / 2

      return {
        id: Math.random().toString(36).substr(2, 9),
        x: -5,
        y: centerY + (Math.random() * 2 - 1) * verticalSpread,
        speed: 0.5 + Math.random() * 1,
        size: 2 + Math.random() * 1,
      }
    }

    const animate = (time: number) => {
      const currentSpawnRate = spawnRateRef.current > 0 ? spawnRateRef.current : 0.1
      const spawnInterval = 1000 / currentSpawnRate
      if (time - lastSpawnTimeRef.current > spawnInterval && particlesRef.current.length < MAX_PARTICLES) {
        particlesRef.current.push(spawnParticle())
        lastSpawnTimeRef.current = time
      }

      particlesRef.current.forEach(p => {
        p.x += p.speed * 2
      })

      particlesRef.current = particlesRef.current.filter(p => p.x < canvasWidth + 20)

      ctx.clearRect(0, 0, canvasWidth, canvasHeight)

      particlesRef.current.forEach(p => {
        ctx.fillStyle = PARTICLE_COLOR
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      })

      animationIdRef.current = requestAnimationFrame(animate)
    }

    animationIdRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, [testingMode])

  return (
    <div className="connector-card">
      <div className="connector-header-bar">
        <div className="connector-title-group">
          <div className="connector-icon-wrapper">
            <Plug2 size={16} />
          </div>
          <div className="connector-type-selector">
            <button 
              className="connector-type-button"
              onClick={(e) => {
                e.stopPropagation()
                setShowTypeDropdown(!showTypeDropdown)
              }}
            >
              <TypeIcon size={14} />
              <span>{currentType.label}</span>
              <ChevronDown size={12} className={`dropdown-chevron ${showTypeDropdown ? 'open' : ''}`} />
            </button>
            {showTypeDropdown && (
              <div className="connector-type-dropdown">
                {CONNECTOR_TYPES.map((type) => {
                  const Icon = type.icon
                  return (
                    <button
                      key={type.value}
                      className={`connector-type-option ${connectorType === type.value ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        updateData({ connectorType: type.value, config: {} })
                        setShowTypeDropdown(false)
                      }}
                    >
                      <Icon size={14} />
                      <span>{type.label}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
        <div className="connector-actions">
          <button
            className="node-settings-btn"
            onClick={(e) => {
              e.stopPropagation()
              setShowPopover(!showPopover)
            }}
          >
            <Settings size={14} />
          </button>
        </div>
      </div>

      <div className="connector-content" ref={containerRef}>
        {testingMode ? (
          <canvas
            ref={canvasRef}
            className="connector-canvas"
          />
        ) : (
          <div className="connector-status-display">
            <TypeIcon size={32} className="connector-type-icon" />
            <span className="connector-status-text">
              {config.instanceUrl || config.host || config.siteUrl || config.imapServer || 'Not configured'}
            </span>
          </div>
        )}
      </div>

      <div className="connector-footer">
        <div className="connector-status-indicator">
          <span className={`status-dot ${testingMode ? 'testing' : 'connected'}`} />
          <span className="connector-status-label">
            {testingMode ? 'Testing' : 'Connected'}
          </span>
        </div>
        <label className="testing-mode-toggle">
          <span className="toggle-label">Test Mode</span>
          <div className="toggle-switch">
            <input
              type="checkbox"
              checked={testingMode}
              onChange={(e) => {
                e.stopPropagation()
                updateData({ testingMode: e.target.checked })
              }}
            />
            <span className="toggle-slider" />
          </div>
        </label>
      </div>

      <Handle type="target" position={Position.Top} className="connector-handle" />
      <Handle type="source" position={Position.Bottom} className="connector-handle" />

      {showPopover && (
        <ConnectorPopover
          connectorType={connectorType}
          config={config}
          casesPerMinute={casesPerMinute}
          onConfigChange={(newConfig) => updateData({ config: newConfig })}
          onCasesPerMinuteChange={(v) => updateData({ casesPerMinute: v })}
          onClose={() => setShowPopover(false)}
        />
      )}
    </div>
  )
}


