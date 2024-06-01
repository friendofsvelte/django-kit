import type {RequestEvent} from "@sveltejs/kit";
import {parseString, splitCookiesString} from 'set-cookie-parser';

export const assign_cookies = (event: RequestEvent, response: Response) => {
    const cookiesHeader = response.headers.get('set-cookie');
    if (!cookiesHeader) return;
    for (const str of splitCookiesString(cookiesHeader)) {
        const {name, value, ...options} = parseString(str);
        event.cookies.set(name, value, {...options});
    }
};