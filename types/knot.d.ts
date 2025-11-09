declare module 'knotapi-js' {
  export interface CommonConfig {
    sessionId: string
    clientId: string
    environment: 'production' | 'sandbox' | 'development'
    product: 'card_switcher' | 'transaction_link'
    onSuccess?: (product: string, merchant: string) => void
    onError?: (product: string, errorCode: string, message: string, payload: any) => void
    onExit?: (product: string) => void
    merchantIds?: number[]
    useCategories?: boolean
    useSearch?: boolean
    entryPoint?: string
    mode?: 'headless' | 'ui'
  }

  export default class KnotapiJS {
    constructor()
    open(config: CommonConfig): void
  }
}

