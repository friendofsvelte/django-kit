import {type Actions, fail, type RequestEvent} from '@sveltejs/kit';
// @ts-ignore
import type {MessageOut} from "./types";

import {SECRET_BASE_API} from "$env/static/private";

export type NamedActionInfo = {
    name: string,
    method: 'GET' | 'POST'
}

export type PathActionInfo = {
    path: string,
    method: 'GET' | 'POST'
}

/*
This function is used to create action triggers for django's api endpoints' name;
path('do-something/', do_something, name='do_something_view'), `do_something_view` is the name of the endpoint.
export const actions = via_route_name("do_something_view");
 */
export const via_route_name = (
    proxy_paths: string | string[] | NamedActionInfo[],
    django_base_api: string = SECRET_BASE_API) => {
    let actions: Actions = {};
    if (typeof proxy_paths === 'string') {
        proxy_paths = [proxy_paths];
    }
    proxy_paths.map((proxy_action) => {
        if (typeof proxy_action === 'string') {
            proxy_action = {name: proxy_action, method: 'POST'};
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
    django_base_api: string = SECRET_BASE_API) => {
    let actions: Actions = {};
    proxy_paths.map((proxy_action) => {
        if (typeof proxy_action === "string") {
            proxy_action = {path: proxy_action, method: "POST"};
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