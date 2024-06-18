import type {Cookies, RequestEvent} from "@sveltejs/kit";
import {parseString, splitCookiesString} from 'set-cookie-parser';
import type {AuthHeader} from "$lib/types.js";

export const assign_cookies = (event: { cookies: Cookies } | RequestEvent, response: Response) => {
    const cookiesHeader = response.headers.get('set-cookie');
    if (!cookiesHeader) return;
    for (const str of splitCookiesString(cookiesHeader)) {
        const {name, value, ...options} = parseString(str);
        // @ts-ignore
        event.cookies.set(name, value, {...options});
    }
};

export const get_headers = (event: RequestEvent, allow_ctp = false) => {
    const SESSION_ID = event.cookies.get('sessionid') as string;
    const CSRF_TOKEN = event.cookies.get('csrftoken') as string;
    let content_type_obj = {};
    if (allow_ctp) content_type_obj = {'Content-Type': 'application/json'};
    return {
        ...content_type_obj,
        'Cookie': `sessionid=${SESSION_ID};csrftoken=${CSRF_TOKEN}`,
        'X-CSRFToken': CSRF_TOKEN,
        'X-Forwarded-For': event.request.headers.get('X-Forwarded-For') || event.getClientAddress() || 'unknown',
        'Referer': event.url.pathname,
        'X-Referer-URL': event.url.href,
        'Route-ID': event.route.id || '',
        'Origin': event.url.origin || '',
        'User-Agent': event.request.headers.get('User-Agent') || ''
    } as AuthHeader;
}

export const assign_headers = (request: Request, headers: AuthHeader) => {
    Object.keys(headers).forEach((key) => {
        if (!request.headers.has(key)) {
            request.headers.set(key, headers[key as keyof AuthHeader]);
        }
    });
}