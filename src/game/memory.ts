export type MemoryFlag = 
  | 'risk_avoider'
  | 'relationship_sacrificed'
  | 'boundary_pusher'
  | 'meaning_seeker'
  | 'survival_focused'

export interface GameMemory {
  runCount: number
  flags: MemoryFlag[]
  lastIdentity: string
  lastRisk: number
  lastSurvival: number
  lastMeaning: number
}

const MEMORY_KEY = 'killLineMemory'

export function getMemory(): GameMemory {
  const stored = localStorage.getItem(MEMORY_KEY)
  if (!stored) {
    return {
      runCount: 0,
      flags: [],
      lastIdentity: '',
      lastRisk: 0,
      lastSurvival: 0,
      lastMeaning: 0
    }
  }
  return JSON.parse(stored)
}

export function saveMemory(memory: GameMemory): void {
  localStorage.setItem(MEMORY_KEY, JSON.stringify(memory))
}

export function analyzeRun(
  risk: number,
  survival: number,
  meaning: number,
  choices: Array<{ survivalDelta: number, meaningDelta: number }>
): MemoryFlag[] {
  const flags: MemoryFlag[] = []
  
  const survivalChoices = choices.filter(c => c.survivalDelta > 0).length
  const meaningChoices = choices.filter(c => c.meaningDelta > 0).length
  const relationshipSacrifices = choices.filter(c => c.meaningDelta < -1).length
  
  if (risk <= 4) {
    flags.push('risk_avoider')
  }
  
  if (risk >= 8) {
    flags.push('boundary_pusher')
  }
  
  if (relationshipSacrifices >= 2) {
    flags.push('relationship_sacrificed')
  }
  
  if (meaningChoices > survivalChoices) {
    flags.push('meaning_seeker')
  }
  
  if (survivalChoices > meaningChoices) {
    flags.push('survival_focused')
  }
  
  return flags
}

export function hasFlag(flag: MemoryFlag): boolean {
  const memory = getMemory()
  return memory.flags.includes(flag)
}

export function getRunCount(): number {
  return getMemory().runCount
}

export function getMemoryText(nodeId: number): string | null {
  const memory = getMemory()
  
  if (memory.runCount === 0) return null
  
  if (memory.runCount === 1) {
    return '你已经经历过类似的场景。'
  }
  
  if (memory.runCount >= 2 && hasFlag('risk_avoider') && nodeId === 6) {
    return '系统已经有过记录。'
  }
  
  return null
}
