declare module 'knotapi-js' {
  export interface KnotConfig {
    sessionId: string
    clientId: string
    environment?: 'development' | 'production'
    entryPoint?: string
    useCategories?: boolean
    useSearch?: boolean
    merchantIds?: number[]
    onSuccess?: (data: any) => void
    onError?: (error: any) => void
    onExit?: () => void
  }

  export class Knot {
    static open(config: KnotConfig): void
    static close(): void
  }
}

