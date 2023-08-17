interface Window {
  nostr: {
    _requests: {};
    _pubkey: null | string;
    getPublicKey: () => Promise<string>;
    signEvent: (event: UnsignedEvent<number>) => Promise<string>;
    getRelays: () => Promise<Relay[]>;
    _call: (type: string, params: {}) => Promise<any>;
  }
}
