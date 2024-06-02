import {SECRET_BASE_API} from "$env/static/private";
import type {HandleFetch} from "@sveltejs/kit";

type AuthHeader = {
    'Content-Type': 'application/json';
    Cookie: string;
    'X-CSRFToken': string;
    'X-Forwarded-For': string;
    Referer: string;
    'X-Referer-URL': string;
    'Route-ID': string;
    Origin: string;
    'User-Agent': string;
}

/*
This function is used to send fetch requests to the django api endpoints; you can use it in `hooks.server.ts` as:
```ts
export const handleFetch = django_fetch_handle;
```
 */
export const django_fetch_handle: HandleFetch = async ({request, fetch, event}) => {
    const is_api_req = request.url.includes(`$api/`);

    if (is_api_req) {
        const SESSION_ID = event.cookies.get('sessionid') as string;
        const CSRF_TOKEN = event.cookies.get('csrftoken') as string;
        const headers = {
            'Content-Type': 'application/json',
            'Cookie': `sessionid=${SESSION_ID};csrftoken=${CSRF_TOKEN}`,
            'X-CSRFToken': CSRF_TOKEN,
            'X-Forwarded-For': event.request.headers.get('X-Forwarded-For') || event.getClientAddress() || 'unknown',
            'Referer': event.url.pathname,
            'X-Referer-URL': event.url.href,
            'Route-ID': event.route.id || '',
            'Origin': event.url.origin || '',
            'User-Agent': event.request.headers.get('User-Agent') || ''
        } as AuthHeader;

        let req_url: string;

        req_url = request.url.split('$api/')[1];
        req_url = `${SECRET_BASE_API}/${req_url}`;

        Object.keys(headers).forEach((key) => {
            if (!request.headers.has(key)) {
                request.headers.set(key, headers[key as keyof AuthHeader]);
            }
        });

        const options = {
            method: request.method,
            headers: request.headers,
            cache: request.cache,
            credentials: request.credentials,
            mode: request.mode,
            referrer: request.referrer,
            referrerPolicy: request.referrerPolicy,
            integrity: request.integrity,
            keepalive: request.keepalive,
            signal: request.signal,
            redirect: request.redirect
        } as RequestInit;

        if (request.method === 'POST' || request.method === 'PUT') {
            options['body'] = await request.text();
        }
        return fetch(req_url, options);
    }
    return fetch(request);
};