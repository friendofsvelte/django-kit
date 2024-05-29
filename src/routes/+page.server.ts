import flash_redirect, {put_flash} from "$lib/flash_message.js";

export const load = async ({locals, cookies}) => {
    put_flash(cookies, {
        message_type: 'warning',
        message: 'This is a flash message from the server side.',
        alias: 'flash_message',
        path: '/'
    });
};