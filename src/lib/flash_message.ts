import {type Cookies, redirect} from "@sveltejs/kit";
import type {FlashMessage, FlashRedirect} from "$lib/types.js";


export const put_flash = (cookies: Cookies, messages: FlashMessage) => {
    // set max age 1 second
    const flash_message_string = btoa(JSON.stringify(messages));
    const cookies_opts = {
        secure: false, httpOnly: false, path: '/', maxAge: 12
    };
    cookies.set('flash_message', flash_message_string, cookies_opts);
};

export const flash_redirect: FlashRedirect = (
    cookies, message,
    status, location
) => {
    put_flash(cookies, {...message, path: location.toString()});
    return redirect(status, location);
};

export default flash_redirect;