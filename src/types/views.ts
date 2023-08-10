export type AppNotification = {
  type: "success" | "error" | "confirm";
  title: string;
  message?: string;
  onConfirm?: Function;
};
