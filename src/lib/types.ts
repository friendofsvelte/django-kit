import {type Cookies, redirect} from "@sveltejs/kit";

type MessageType = 'success' | 'error' | 'warning' | 'info';

type MessageOutCommon = {
    message_type: MessageType
    alias: string;
};

type ActionPathRequired = {
    action?: {
        path: string;
        label: string;
    };
}

type MessageSingle = MessageOutCommon & {
    message: string;
    messages?: never;
};

export type MessageOut = MessageSingle & ActionPathRequired;

export type RedirectStatus = 300 | 301 | 302 | 303 | 304 | 305 | 306 | 307 | 308;

export type FlashRedirect = (
    cookies: Cookies, message: MessageOut,
    status: RedirectStatus,
    location: string | URL
) => ReturnType<typeof redirect>;

export type FlashMessage = { path: string; } & MessageOut;

export type ToastNotification = {
    auto_dismiss_duration: number;
    id: string;
    message_type: MessageType;
} & MessageOut;
