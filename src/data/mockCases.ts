import { CaseData } from '../components/nodes/CaseNode'

export interface MockCase extends CaseData {
  id: string
}

export const mockCases: MockCase[] = [
  // 2 cases in Inbox
  {
    id: 'case-1',
    label: 'Broken AC Unit in Building A',
    caseId: '#AC7829',
    status: 'open',
    priority: 'urgent',
    assignee: 'Unassigned',
    createdAt: '20/12/2025',
    dueDate: '21/12/2025',
    tags: ['HVAC', 'Emergency'],
    attachedFiles: ['ac_unit_photo.jpg', 'floor_plan.pdf'],
    notepad: 'Tenant reports AC unit making loud grinding noise. Temperature reading shows 28°C in office space. Needs immediate attention.',
    currentStage: 'inbox',
    stageEnteredAt: '2025-12-20T09:15:00Z',
  },
  {
    id: 'case-2',
    label: 'Water Leak in Parking Garage',
    caseId: '#WL4532',
    status: 'open',
    priority: 'high',
    assignee: 'Unassigned',
    createdAt: '20/12/2025',
    tags: ['Plumbing', 'Parking'],
    attachedFiles: ['leak_video.mp4'],
    notepad: 'Security noticed water pooling in P2 level. Source appears to be ceiling pipe. Affecting parking spots 45-52.',
    currentStage: 'inbox',
    stageEnteredAt: '2025-12-20T10:30:00Z',
  },
  
  // 2 cases in Procedure stage (assuming a procedure node exists with id 'procedure-1')
  {
    id: 'case-3',
    label: 'Elevator Maintenance Request',
    caseId: '#EL9201',
    status: 'in_progress',
    priority: 'medium',
    assignee: 'Sarah Johnson',
    createdAt: '19/12/2025',
    dueDate: '23/12/2025',
    tags: ['Elevator', 'Maintenance'],
    attachedFiles: ['maintenance_schedule.pdf', 'inspection_report.pdf'],
    notepad: 'Annual elevator inspection scheduled. Need to coordinate with building tenants for downtime. Sarah is reviewing contractor quotes.',
    currentStage: 'procedure-1:2',
    stageEnteredAt: '2025-12-19T14:20:00Z',
  },
  {
    id: 'case-4',
    label: 'Replace Broken Window - Suite 405',
    caseId: '#WN3387',
    status: 'in_progress',
    priority: 'medium',
    assignee: 'Alex Chen',
    createdAt: '18/12/2025',
    dueDate: '22/12/2025',
    tags: ['Windows', 'Repair'],
    attachedFiles: ['window_damage.jpg', 'quote_glasspro.pdf'],
    notepad: 'Large crack in window, possibly due to temperature stress. Tenant has requested urgent replacement. Alex is waiting for parts delivery.',
    currentStage: 'procedure-1:5',
    stageEnteredAt: '2025-12-18T11:45:00Z',
  },
  
  // 2 cases in Outbox
  {
    id: 'case-5',
    label: 'Light Bulb Replacement - Hallway 3F',
    caseId: '#LB2094',
    status: 'resolved',
    priority: 'low',
    assignee: 'Michael Torres',
    createdAt: '17/12/2025',
    tags: ['Lighting', 'Routine'],
    attachedFiles: [],
    notepad: 'Replaced 6 LED bulbs in 3rd floor hallway. Work completed ahead of schedule.',
    currentStage: 'outbox',
    stageEnteredAt: '2025-12-20T08:00:00Z',
  },
  {
    id: 'case-6',
    label: 'Fire Extinguisher Inspection',
    caseId: '#FE1155',
    status: 'closed',
    priority: 'medium',
    assignee: 'Jessica Park',
    createdAt: '15/12/2025',
    tags: ['Safety', 'Compliance'],
    attachedFiles: ['inspection_certificate.pdf', 'compliance_report.pdf'],
    notepad: 'Annual fire extinguisher inspection completed. All 24 units passed. Certificates filed with city.',
    currentStage: 'outbox',
    stageEnteredAt: '2025-12-20T09:45:00Z',
  },
]

// Helper function to get cases by stage
export function getCasesByStage(stageId: string): MockCase[] {
  return mockCases.filter(c => c.currentStage === stageId)
}

// Helper function to calculate average time in stage (in hours)
export function getAverageTimeInStage(stageId: string): number {
  const cases = getCasesByStage(stageId)
  if (cases.length === 0) return 0
  
  const now = new Date()
  const totalHours = cases.reduce((sum, c) => {
    if (!c.stageEnteredAt) return sum
    const enteredAt = new Date(c.stageEnteredAt)
    const hoursInStage = (now.getTime() - enteredAt.getTime()) / (1000 * 60 * 60)
    return sum + hoursInStage
  }, 0)
  
  return totalHours / cases.length
}

// Helper function to format time duration
export function formatDuration(hours: number): string {
  if (hours < 1) {
    const minutes = Math.round(hours * 60)
    return `${minutes}m`
  }
  if (hours < 24) {
    return `${Math.round(hours)}h`
  }
  const days = Math.floor(hours / 24)
  const remainingHours = Math.round(hours % 24)
  if (remainingHours === 0) {
    return `${days}d`
  }
  return `${days}d ${remainingHours}h`
}

// Helper function to get time since entered stage
export function getTimeInStage(stageEnteredAt?: string): string {
  if (!stageEnteredAt) return 'Unknown'
  
  const now = new Date()
  const enteredAt = new Date(stageEnteredAt)
  const hours = (now.getTime() - enteredAt.getTime()) / (1000 * 60 * 60)
  
  return formatDuration(hours)
}

