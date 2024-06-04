import {SECRET_BASE_API} from "$env/static/private";
import type {HandleFetch} from "@sveltejs/kit";
import {assign_headers, get_headers} from "$lib/server/utils.js";


/*
This function is used to send fetch requests to the django api endpoints; you can use it in `hooks.server.ts` as:
```ts
export const handleFetch = django_fetch_handle;
```
 */
export const django_fetch_handle: HandleFetch = async ({request, fetch, event}) => {
    const is_api_req = request.url.includes(`$api/`);

    if (is_api_req) {
        const headers = get_headers(event, true);
        assign_headers(request, headers);

        const req_url = `${SECRET_BASE_API}/${request.url.split('$api/')[1]}`;

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