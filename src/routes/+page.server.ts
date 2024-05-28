import flash_redirect from "$lib/flash_message.js";

export const load = async ({locals, cookies}) => {
    return {
        "message": "Test",
        "message_type": "warning",
        "alias": "test"
    }
};