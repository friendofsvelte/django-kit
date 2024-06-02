import {type Cookies, redirect} from "@sveltejs/kit";

type MessageType = 'success' | 'error' | 'warning' | 'info';

type ActionPathRequired = {
    action?: {
        path: string;
        label: string;
    };
}

export type BaseMessage = {
    message_type: MessageType
    message: string;
} & ActionPathRequired;

export type Message = {
    alias: string;
} & BaseMessage;

export type MessageFlux = ({
    message_type?: MessageType
    alias?: string;
    message?: string;
} & ActionPathRequired) | null;

export type RedirectStatus = 300 | 301 | 302 | 303 | 304 | 305 | 306 | 307 | 308;

export type FlashRedirect = (
    cookies: Cookies,
    message: Message,
    status: RedirectStatus,
    location: string | URL
) => ReturnType<typeof redirect>;

export type FlashMessage = { path: string; } & Message;
export type BaseToast = { auto_dismiss_duration: number; } & BaseMessage;
export type Toast = { id: string; } & BaseToast;
