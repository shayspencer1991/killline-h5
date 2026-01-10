export interface GameConfig {
  fps?: number
}

export interface GameState {
  score: number
  time: number
  isRunning: boolean
  isPaused: boolean
}

export type GameEventCallback = (engine: GameEngine) => void

export class GameEngine {
  private config: GameConfig
  private state: GameState
  private startTime: number = 0
  private pauseTime: number = 0
  private accumulatedPauseTime: number = 0

  private onStartCallback?: GameEventCallback
  private onTickCallback?: GameEventCallback
  private onStopCallback?: GameEventCallback
  private onPauseCallback?: GameEventCallback
  private onResumeCallback?: GameEventCallback

  constructor(config?: GameConfig) {
    this.config = {
      fps: config?.fps || 60
    }

    this.state = {
      score: 0,
      time: 0,
      isRunning: false,
      isPaused: false
    }
  }

  public start(): void {
    if (this.state.isRunning) return

    this.state.isRunning = true
    this.state.isPaused = false
    this.state.score = 0
    this.state.time = 0
    this.startTime = performance.now()
    this.accumulatedPauseTime = 0

    this.onStartCallback?.(this)
  }

  public tick(deltaTime: number): void {
    if (!this.state.isRunning || this.state.isPaused) return

    this.state.time = performance.now() - this.startTime - this.accumulatedPauseTime

    this.onTickCallback?.(this)
  }

  public stop(): void {
    if (!this.state.isRunning) return

    this.state.isRunning = false
    this.state.isPaused = false

    this.onStopCallback?.(this)
  }

  public pause(): void {
    if (!this.state.isRunning || this.state.isPaused) return

    this.state.isPaused = true
    this.pauseTime = performance.now()

    this.onPauseCallback?.(this)
  }

  public resume(): void {
    if (!this.state.isRunning || !this.state.isPaused) return

    this.state.isPaused = false
    this.accumulatedPauseTime += performance.now() - this.pauseTime

    this.onResumeCallback?.(this)
  }

  public reset(): void {
    this.state.score = 0
    this.state.time = 0
    this.state.isRunning = false
    this.state.isPaused = false
    this.startTime = 0
    this.pauseTime = 0
    this.accumulatedPauseTime = 0
  }

  public getState(): Readonly<GameState> {
    return { ...this.state }
  }

  public getScore(): number {
    return this.state.score
  }

  public setScore(score: number): void {
    this.state.score = score
  }

  public addScore(points: number): void {
    this.state.score += points
  }

  public getTime(): number {
    return this.state.time
  }

  public isRunning(): boolean {
    return this.state.isRunning
  }

  public isPaused(): boolean {
    return this.state.isPaused
  }

  public getFPS(): number {
    return this.config.fps || 60
  }

  public onStart(callback: GameEventCallback): void {
    this.onStartCallback = callback
  }

  public onTick(callback: GameEventCallback): void {
    this.onTickCallback = callback
  }

  public onStop(callback: GameEventCallback): void {
    this.onStopCallback = callback
  }

  public onPause(callback: GameEventCallback): void {
    this.onPauseCallback = callback
  }

  public onResume(callback: GameEventCallback): void {
    this.onResumeCallback = callback
  }
}
