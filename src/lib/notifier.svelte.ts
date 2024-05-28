import type {MessageOut, ToastNotification} from "$lib/types.js";

const AUTO_DISMISS_DURATION = 7200;
export let error_triggered = $state(false);
export const toasts = $state([] as ToastNotification[]);

export function add_toast(message: MessageOut, auto_dismiss_duration = AUTO_DISMISS_DURATION) {
    const toast: ToastNotification = {...message, auto_dismiss_duration, id: crypto.randomUUID(),};
    toasts.push(toast);
}


export function dismiss_toast(toastId: string) {
    delete toasts[toasts.findIndex((toast) => toast.id === toastId)];
}

export function dismiss_all_toasts() {
    toasts.splice(0, toasts.length);
}

export function trigger_error() {
    // error_triggered = true;
}