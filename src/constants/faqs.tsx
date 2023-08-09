export const FAQS = [
  {
    question: "How are my data stored?",
    answer:
      "Your passwords are stored on NOSTR relays, and they are encrypted twice; once by your master passcode, and once by your NOSTR secret key. Your encrypted data are synced and stored on your device, and they are stored encrypted. They will only be decrypted when you enter your master passcode.",
  },
  {
    question: "Will I lose my data if I lose my secret key?",
    answer:
      "No. Though your data are stored on NOSTR relays, your data can only be decrypted by your master passcode.",
  },
  {
    question: "Can I access my data if I forgot my master passcode?",
    answer:
      "No. As a zero-knowledge encryption product, there is no way to retrieve or reset your passcode. Both your passcode and your NOSTR secret to needed to decrypt your data.",
  },
  {
    question: "Where can I see the source code?",
    answer: (
      <>
        This project is open source, and you can browse the code on{" "}
        <a
          className="text-brand-2 hover:text-primary"
          href="https://github.com/jinglescode/nostr-password-manager"
          target="_blank"
        >
          GitHub
        </a>
        .
      </>
    ),
  },
  {
    question: "Error decrypting vaults",
    answer:
      "You need to enter the same passcode you have used previously (or other devices) to encrypt your vaults. You have to disconnect and reconnect your account. You may change your passcode after successfully encrypted your vaults.",
  },
];
