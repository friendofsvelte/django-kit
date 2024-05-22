
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
export type BlockedMessage = MessageOut & {
    blocked_till: number;
    alias: 'blocked_till';
};