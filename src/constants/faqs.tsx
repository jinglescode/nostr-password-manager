export const FAQS = [
  {
    question: "How are my data stored?",
    answer:
      "Your passwords are stored on NOSTR relays, and they are encrypted twice; once by your passcode, and once by your NOSTR secret key. Your data are synced and stored encrypted on your devices. They will only be decrypted when you enter your passcode.",
  },
  {
    question: "Will I lose my data if I lose my secret key?",
    answer:
      "No, you data are securely encrypted. Though your data are stored on NOSTR relays, your data can only be decrypted by both your scret key and passcode.",
  },
  {
    question: "Can I access my data if I forgot my passcode?",
    answer:
      "No. As a zero-knowledge encryption product, there is no way to retrieve or reset your passcode. Both your passcode and your NOSTR secret are needed to decrypt your data.",
  },
  {
    question: "Where can I find the source code?",
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
      "You need to enter the same passcode you have used previously (or on other devices) to encrypt your vaults. You may have to disconnect and reconnect your account. You may change your passcode after you have successfully decrypted your vaults.",
  },
  {
    question: "Can I use in multiple devices?",
    answer:
      "Of course! You can use it on as many devices as you want. This means that you can install this extension on multiple machines, and your data will be synced across all devices.",
  },
];
