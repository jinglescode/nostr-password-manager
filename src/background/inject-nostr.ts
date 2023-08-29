export default function injectNostr() {
  window.nostr = {
    _requests: {},
    _pubkey: null,

    async getPublicKey() {
      if (this._pubkey) return this._pubkey
      this._pubkey = await this._call("getPublicKey", {})
      return this._pubkey
    },

    async signEvent(event) {
      return this._call("signEvent", { event })
    },

    async getRelays() {
      return this._call("getRelays", {})
    },

    // nip04: {
    //   async encrypt(peer, plaintext) {
    //     return this._call("nip04.encrypt", { peer, plaintext })
    //   },

    //   async decrypt(peer, ciphertext) {
    //     return this._call("nip04.decrypt", { peer, ciphertext })
    //   }
    // },

    async _call(type, params) {
      let id = Math.random().toString().slice(-4)

      console.log(
        "%c[vault2:%c" +
          id +
          "%c]%c calling %c" +
          type +
          "%c with %c" +
          JSON.stringify(params || {}),
        "background-color:#f1b912;font-weight:bold;color:white",
        "background-color:#f1b912;font-weight:bold;color:#a92727",
        "background-color:#f1b912;color:white;font-weight:bold",
        "color:auto",
        "font-weight:bold;color:#08589d;font-family:monospace",
        "color:auto",
        "font-weight:bold;color:#90b12d;font-family:monospace"
      )

      return new Promise((resolve, reject) => {
        this._requests[id] = { resolve, reject }
        window.postMessage(
          {
            id,
            ext: "vault",
            type,
            params
          },
          "*"
        )
      })
    }
  }
}
