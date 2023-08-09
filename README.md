# Vault, a secure and free password manager

Vault saves all your passwords (more types coming soon) securely by encrpyting your data twice; once with your secret key and once with your master passcode.

Your data are not stored on any centralized server, but rather on a set of relay servers. This means that it is very resilient to attacks and that you are the only one who can access your passwords.

Security experts recommend that you use a different, randomly generated password for every account that you create, and Vault makes this easy. Vault can generate passwords and store them for you, this means that you only need to remember one password, your master passcode.

Vault is free and open source, and will always be.

## Roadmap:

- window.nostr to enable signing events
- log in and sign events with nsecbunker
- one click to fill up forms on site
- different types of item
- generate password with rules
- import from existing password managers
- relay has limits. and different relay has different limit. need to ensure user dont break limits
- for storing secure notes, only store IDs, and each secure note is it own event
- offline support
