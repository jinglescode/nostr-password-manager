feat:
- `nostr:XYZ` at address bar to redirect to user's preferred explorer
- a new tab in extension to manage all nostr keys and permissions


specs:
- approval for urls, by period
- approved sign kinds


current key: 
{
  pk: string,
}

list of keys:
{
  [pk]: {
    name: "give a name to this key",
    sk: "",
    apps: {
      [url]: {
        validity: number; // forever, a day, a week, a month, just once
        permissions: {
          'read pubkey': boolean;
          'sign events': boolean;
        }
      }
    }
  }
}