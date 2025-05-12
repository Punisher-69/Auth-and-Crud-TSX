import { addToast } from "@heroui/react";
export const DisplayToast = (data: string, color: "success" | "warning") => {
  addToast({
    hideIcon: false,
    title: "Success",
    description: data,
    color: color,
    classNames: {
      closeButton: "opacity-100 absolute right-4 top-1/2 -translate-y-1/2",
    },
  });
};
