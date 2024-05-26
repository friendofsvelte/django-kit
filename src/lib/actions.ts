import {type Actions, fail, type RequestEvent} from '@sveltejs/kit';
// @ts-ignore
import type {MessageOut} from "./types";

import {SECRET_BASE_API} from "$env/static/private";

export type NamedActionInfo = {
    name: string,
    method: 'GET' | 'POST',
    allow_cookies?: boolean
}

export type PathActionInfo = {
    path: string,
    method: 'GET' | 'POST',
    assign_cookies?: boolean
}

function assign_cookies(event: RequestEvent, response: Response) {
    const cookies = response.headers.get('set-cookie');
    if (cookies) {
        cookies.split(',').forEach((cookie) => {
            const [key, ...rest] = cookie.trim().split('=');
            const value = rest.join('=').split(';')[0];
            let path = '/';
            let sameSite = 'Lax';
            rest.join('=').split(';').slice(1).forEach(attr => {
                const [attrKey, attrValue] = attr.trim().split('=');
                if (attrKey.toLowerCase() === 'path') {
                    path = attrValue;
                } else if (attrKey.toLowerCase() === 'samesite') {
                    sameSite = attrValue;
                }
            });
            event.cookies.set(key, value, {path, sameSite});
        });
    }
}

/*
This function is used to create action triggers for django's api endpoints' name;
path('do-something/', do_something, name='do_something_view_name'), `do_something_view_name` is the name of the endpoint.
export const actions = via_route_name("do_something_view_name");
 */
export const via_route_name = (
    proxy_paths: string | string[] | NamedActionInfo[],
    django_base_api: string = SECRET_BASE_API,
    allow_cookies: boolean = false) => {
    let actions: Actions = {};
    if (typeof proxy_paths === 'string') {
        proxy_paths = [proxy_paths];
    }
    proxy_paths.map((proxy_action) => {
        if (typeof proxy_action === 'string') {
            proxy_action = {name: proxy_action, method: 'POST', allow_cookies: false};
        }
        const action = {
            [proxy_action.name]: async (event: RequestEvent) => {
                try {
                    const form_data = await event.request.formData();

                    let url = `${django_base_api}/trvun/?url_name=${proxy_action.name}`;
                    let options: RequestInit = {method: proxy_action.method};

                    if (proxy_action.method === 'GET') {
                        url = `${url}&${new URLSearchParams(form_data as any).toString()}`;
                    } else {
                        options = {...options, body: form_data};
                    }
                    const response = await event.fetch(url, options);

                    if (proxy_action.allow_cookies || allow_cookies) {
                        assign_cookies(event, response);
                    }

                    const data = await response.json();

                    if (response.ok) {
                        return data;
                    }
                    return fail(response.status, data);
                } catch (e) {
                    console.log(e);
                }
                return fail(500, {
                    message: 'Something went wrong.',
                    message_type: 'error',
                    alias: 'internal_server_error'
                } as MessageOut);
            }
        };
        actions = {...actions, ...action};
    });
    return actions;
};

/*
This function is used to create action triggers for django's api endpoints' path.
path('do-something/', do_something, name='do_something_view'), `do-something/` is the path of the endpoint.
export const actions = via_route(["do-something/", "do-something-else/"], "parent-path/");
 */
export const via_route = (
    proxy_paths: string[] | PathActionInfo[], prefix = "",
    django_base_api: string = SECRET_BASE_API,
    allow_cookies: boolean = false) => {
    let actions: Actions = {};
    proxy_paths.map((proxy_action) => {
        if (typeof proxy_action === "string") {
            proxy_action = {path: proxy_action, method: "POST", assign_cookies: false};
        }
        if (prefix && !prefix.endsWith("/")) {
            prefix += "/";
        }
        proxy_action.path = prefix + proxy_action.path;
        const action = {
            [proxy_action.path]: async (event: RequestEvent) => {
                try {
                    const form_data = await event.request.formData();
                    let url = `${django_base_api}/${proxy_action.path}`;
                    let options: RequestInit = {method: proxy_action.method}
                    if (proxy_action.method === 'GET') {
                        url = `${url}?${new URLSearchParams(form_data as any).toString()}`;
                    } else {
                        options = {...options, body: form_data};
                    }
                    const response = await event.fetch(url, options);

                    if (proxy_action.allow_cookies || allow_cookies) {
                        assign_cookies(event, response);
                    }
                    const data = await response.json();
                    if (response.ok) {
                        return data;
                    }
                    return fail(response.status, data);
                } catch (e) {
                    console.log(e);
                }
                return fail(500, {
                    message: "Something went wrong.",
                    message_type: "error",
                    alias: "internal_server_error"
                } as MessageOut);
            }
        }
        actions = {...actions, ...action};
    });
    return actions;
}