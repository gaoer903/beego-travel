interface ConfirmOptions {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
}

interface ConfirmState {
  open: boolean;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
}

let currentResolve: ((value: boolean) => void) | null = null;

const useConfirmState = () => {
  return useState<ConfirmState>("confirm-dialog", () => ({
    open: false,
    title: "",
    description: "",
    confirmText: "确认",
    cancelText: "取消",
  }));
};

const useConfirm = () => {
  const state = useConfirmState();
  //  打开确认对话框，并返回一个 Promise，在用户选择后 resolve 结果
  return (options: ConfirmOptions) => {
    state.value.open = true;
    state.value.title = options.title;
    state.value.description = options.description || "";
    state.value.confirmText = options.confirmText || "确认";
    state.value.cancelText = options.cancelText || "取消";

    return new Promise<boolean>((resolve) => {
      currentResolve = resolve;
    });
  };
};

const resolveConfirm = (value: boolean) => {
  currentResolve?.(value);
  currentResolve = null;

  const state = useConfirmState();

  state.value.open = false;
};

export { useConfirmState, useConfirm, resolveConfirm };
