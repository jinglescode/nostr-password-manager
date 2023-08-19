export type NostrKeys = {
  [pk: string]: NostrKey
}

export type NostrKey = {
  name: string
  sk: string
  apps: {
    [url: string]: {
      validity: number
      permissions: {
        read: boolean
        write: boolean
      }
    }
  }
}
