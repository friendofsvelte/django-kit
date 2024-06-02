import flash_redirect, {put_flash} from "$lib/server/flash.js";
import type {Actions} from "@sveltejs/kit";

export const load = async ({locals, cookies}) => {

};

export const actions: Actions = {
    default: async ({request, url, locals, fetch}) => {
        return {
            message_type: 'warning',
            message: 'This is a flash message from the server side.',
            alias: 'flash_message',
        }
    }
}