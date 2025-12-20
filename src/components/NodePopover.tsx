import { useEffect, useRef } from 'react'
import { Minus, Plus } from 'lucide-react'
import './NodePopover.css'

interface StepperProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  unit?: string
}

function Stepper({ label, value, onChange, min = 0, max = 100, step = 1, unit }: StepperProps) {
  const decrement = () => onChange(Math.max(min, value - step))
  const increment = () => onChange(Math.min(max, value + step))

  return (
    <div className="stepper">
      <span className="stepper-label">{label}</span>
      <div className="stepper-controls">
        <button className="stepper-btn" onClick={decrement} disabled={value <= min}>
          <Minus size={12} />
        </button>
        <span className="stepper-value">
          {value}{unit && <span className="stepper-unit">{unit}</span>}
        </span>
        <button className="stepper-btn" onClick={increment} disabled={value >= max}>
          <Plus size={12} />
        </button>
      </div>
    </div>
  )
}

interface RangeStepperProps {
  label: string
  minValue: number
  maxValue: number
  onMinChange: (value: number) => void
  onMaxChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  unit?: string
}

function RangeStepper({ 
  label, 
  minValue, 
  maxValue, 
  onMinChange, 
  onMaxChange, 
  min = 0, 
  max = 10000, 
  step = 100,
  unit 
}: RangeStepperProps) {
  return (
    <div className="range-stepper">
      <span className="stepper-label">{label}</span>
      <div className="range-stepper-row">
        <div className="range-input">
          <span className="range-input-label">Min</span>
          <div className="stepper-controls compact">
            <button className="stepper-btn" onClick={() => onMinChange(Math.max(min, minValue - step))} disabled={minValue <= min}>
              <Minus size={10} />
            </button>
            <span className="stepper-value small">
              {minValue}{unit && <span className="stepper-unit">{unit}</span>}
            </span>
            <button className="stepper-btn" onClick={() => onMinChange(Math.min(maxValue, minValue + step))} disabled={minValue >= maxValue}>
              <Plus size={10} />
            </button>
          </div>
        </div>
        <div className="range-input">
          <span className="range-input-label">Max</span>
          <div className="stepper-controls compact">
            <button className="stepper-btn" onClick={() => onMaxChange(Math.max(minValue, maxValue - step))} disabled={maxValue <= minValue}>
              <Minus size={10} />
            </button>
            <span className="stepper-value small">
              {maxValue}{unit && <span className="stepper-unit">{unit}</span>}
            </span>
            <button className="stepper-btn" onClick={() => onMaxChange(Math.min(max, maxValue + step))} disabled={maxValue >= max}>
              <Plus size={10} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface NodePopoverProps {
  children: React.ReactNode
  onClose: () => void
}

export function NodePopover({ children, onClose }: NodePopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as HTMLElement)) {
        onClose()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  return (
    <div className="node-popover" ref={popoverRef} onClick={(e) => e.stopPropagation()}>
      {children}
    </div>
  )
}

interface InboxPopoverProps {
  casesPerMinute: number
  holdDurationMin: number
  holdDurationMax: number
  onCasesPerMinuteChange: (value: number) => void
  onHoldDurationMinChange: (value: number) => void
  onHoldDurationMaxChange: (value: number) => void
  onGenerateCase?: () => void
  onClose: () => void
}

export function InboxPopover({
  casesPerMinute,
  holdDurationMin,
  holdDurationMax,
  onCasesPerMinuteChange,
  onHoldDurationMinChange,
  onHoldDurationMaxChange,
  onGenerateCase,
  onClose,
}: InboxPopoverProps) {
  return (
    <NodePopover onClose={onClose}>
      <div className="popover-header">Inbox Settings</div>
      <div className="popover-content">
        <Stepper
          label="New cases per minute"
          value={casesPerMinute}
          onChange={onCasesPerMinuteChange}
          min={0}
          max={200}
          step={20}
          unit="/min"
        />
        <div className="popover-divider" />
        <RangeStepper
          label="Hold duration (ms)"
          minValue={holdDurationMin}
          maxValue={holdDurationMax}
          onMinChange={onHoldDurationMinChange}
          onMaxChange={onHoldDurationMaxChange}
          min={0}
          max={10000}
          step={100}
          unit="ms"
        />
        {onGenerateCase && (
          <>
            <div className="popover-divider" />
            <button className="generate-case-btn" onClick={onGenerateCase}>
              Generate New Case
            </button>
          </>
        )}
      </div>
    </NodePopover>
  )
}

interface OutboxPopoverProps {
  retentionSeconds: number
  onRetentionSecondsChange: (value: number) => void
  onClose: () => void
}

export function OutboxPopover({
  retentionSeconds,
  onRetentionSecondsChange,
  onClose,
}: OutboxPopoverProps) {
  return (
    <NodePopover onClose={onClose}>
      <div className="popover-header">Outbox Settings</div>
      <div className="popover-content">
        <Stepper
          label="Retention before deletion"
          value={retentionSeconds}
          onChange={onRetentionSecondsChange}
          min={1}
          max={60}
          step={1}
          unit="s"
        />
      </div>
    </NodePopover>
  )
}

interface EventStreamPopoverProps {
  eventsPerMinute: number
  onEventsPerMinuteChange: (value: number) => void
  onClose: () => void
}

export function EventStreamPopover({
  eventsPerMinute,
  onEventsPerMinuteChange,
  onClose,
}: EventStreamPopoverProps) {
  return (
    <NodePopover onClose={onClose}>
      <div className="popover-header">Event Stream Settings</div>
      <div className="popover-content">
        <Stepper
          label="Events per minute"
          value={eventsPerMinute}
          onChange={onEventsPerMinuteChange}
          min={0}
          max={1000}
          step={20}
          unit="/min"
        />
      </div>
    </NodePopover>
  )
}

type ConnectorType = 'salesforce' | 'sap' | 'sharepoint' | 'sftp' | 'email'

interface ConnectorPopoverProps {
  connectorType: ConnectorType
  config: Record<string, string>
  casesPerMinute: number
  onConfigChange: (config: Record<string, string>) => void
  onCasesPerMinuteChange: (value: number) => void
  onClose: () => void
}

interface TextInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

function TextInput({ label, value, onChange, placeholder }: TextInputProps) {
  return (
    <div className="text-input">
      <span className="text-input-label">{label}</span>
      <input
        type="text"
        className="text-input-field"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
}

interface SelectInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}

function SelectInput({ label, value, onChange, options }: SelectInputProps) {
  return (
    <div className="select-input">
      <span className="select-input-label">{label}</span>
      <select
        className="select-input-field"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClick={(e) => e.stopPropagation()}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

function SalesforceConfig({ config, onConfigChange }: { config: Record<string, string>; onConfigChange: (config: Record<string, string>) => void }) {
  return (
    <>
      <TextInput
        label="Instance URL"
        value={config.instanceUrl ?? ''}
        onChange={(v) => onConfigChange({ ...config, instanceUrl: v })}
        placeholder="https://mycompany.salesforce.com"
      />
      <SelectInput
        label="Object Type"
        value={config.objectType ?? 'Case'}
        onChange={(v) => onConfigChange({ ...config, objectType: v })}
        options={[
          { value: 'Lead', label: 'Lead' },
          { value: 'Opportunity', label: 'Opportunity' },
          { value: 'Case', label: 'Case' },
          { value: 'Account', label: 'Account' },
        ]}
      />
    </>
  )
}

function SapConfig({ config, onConfigChange }: { config: Record<string, string>; onConfigChange: (config: Record<string, string>) => void }) {
  return (
    <>
      <TextInput
        label="System ID"
        value={config.systemId ?? ''}
        onChange={(v) => onConfigChange({ ...config, systemId: v })}
        placeholder="PRD"
      />
      <TextInput
        label="Client"
        value={config.client ?? ''}
        onChange={(v) => onConfigChange({ ...config, client: v })}
        placeholder="100"
      />
      <TextInput
        label="RFC Destination"
        value={config.rfcDestination ?? ''}
        onChange={(v) => onConfigChange({ ...config, rfcDestination: v })}
        placeholder="SAP_RFC_DEST"
      />
    </>
  )
}

function SharePointConfig({ config, onConfigChange }: { config: Record<string, string>; onConfigChange: (config: Record<string, string>) => void }) {
  return (
    <>
      <TextInput
        label="Site URL"
        value={config.siteUrl ?? ''}
        onChange={(v) => onConfigChange({ ...config, siteUrl: v })}
        placeholder="https://company.sharepoint.com/sites/mysite"
      />
      <TextInput
        label="List Name"
        value={config.listName ?? ''}
        onChange={(v) => onConfigChange({ ...config, listName: v })}
        placeholder="Documents"
      />
      <TextInput
        label="Document Library"
        value={config.documentLibrary ?? ''}
        onChange={(v) => onConfigChange({ ...config, documentLibrary: v })}
        placeholder="Shared Documents"
      />
    </>
  )
}

function SftpConfig({ config, onConfigChange }: { config: Record<string, string>; onConfigChange: (config: Record<string, string>) => void }) {
  return (
    <>
      <TextInput
        label="Host"
        value={config.host ?? ''}
        onChange={(v) => onConfigChange({ ...config, host: v })}
        placeholder="sftp.example.com"
      />
      <TextInput
        label="Port"
        value={config.port ?? '22'}
        onChange={(v) => onConfigChange({ ...config, port: v })}
        placeholder="22"
      />
      <TextInput
        label="Path"
        value={config.path ?? ''}
        onChange={(v) => onConfigChange({ ...config, path: v })}
        placeholder="/inbox"
      />
      <TextInput
        label="Username"
        value={config.username ?? ''}
        onChange={(v) => onConfigChange({ ...config, username: v })}
        placeholder="user"
      />
    </>
  )
}

function EmailConfig({ config, onConfigChange }: { config: Record<string, string>; onConfigChange: (config: Record<string, string>) => void }) {
  return (
    <>
      <TextInput
        label="IMAP Server"
        value={config.imapServer ?? ''}
        onChange={(v) => onConfigChange({ ...config, imapServer: v })}
        placeholder="imap.gmail.com"
      />
      <TextInput
        label="Folder"
        value={config.folder ?? 'INBOX'}
        onChange={(v) => onConfigChange({ ...config, folder: v })}
        placeholder="INBOX"
      />
      <SelectInput
        label="Polling Interval"
        value={config.pollingInterval ?? '60'}
        onChange={(v) => onConfigChange({ ...config, pollingInterval: v })}
        options={[
          { value: '30', label: '30 seconds' },
          { value: '60', label: '1 minute' },
          { value: '300', label: '5 minutes' },
          { value: '900', label: '15 minutes' },
        ]}
      />
    </>
  )
}

export function ConnectorPopover({
  connectorType,
  config,
  casesPerMinute,
  onConfigChange,
  onCasesPerMinuteChange,
  onClose,
}: ConnectorPopoverProps) {
  const typeLabels: Record<ConnectorType, string> = {
    salesforce: 'Salesforce',
    sap: 'SAP',
    sharepoint: 'SharePoint',
    sftp: 'SFTP',
    email: 'Email',
  }

  return (
    <NodePopover onClose={onClose}>
      <div className="popover-header">{typeLabels[connectorType]} Settings</div>
      <div className="popover-content">
        {connectorType === 'salesforce' && <SalesforceConfig config={config} onConfigChange={onConfigChange} />}
        {connectorType === 'sap' && <SapConfig config={config} onConfigChange={onConfigChange} />}
        {connectorType === 'sharepoint' && <SharePointConfig config={config} onConfigChange={onConfigChange} />}
        {connectorType === 'sftp' && <SftpConfig config={config} onConfigChange={onConfigChange} />}
        {connectorType === 'email' && <EmailConfig config={config} onConfigChange={onConfigChange} />}
        <div className="popover-divider" />
        <Stepper
          label="Test cases per minute"
          value={casesPerMinute}
          onChange={onCasesPerMinuteChange}
          min={0}
          max={200}
          step={10}
          unit="/min"
        />
      </div>
    </NodePopover>
  )
}


