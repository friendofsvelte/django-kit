import {type Actions, fail, redirect, type RequestEvent} from '@sveltejs/kit';
// @ts-ignore
import type {Message} from "./types";

import {SECRET_BASE_API} from "$env/static/private";
import {assign_cookies} from "$lib/utils.js";
import {put_flash} from "$lib/flash_message.js";

export type NamedActionInfo = {
    name: string,
    method: 'GET' | 'POST',
    allow_cookies?: boolean
}

export type PathActionInfo = {
    path: string,
    method: 'GET' | 'POST',
    allow_cookies?: boolean
}

type Options = { django_base_api?: string, allow_cookies?: boolean }
type PrefixOptions = { prefix?: string } & Options

const default_options = {
    django_base_api: SECRET_BASE_API,
    allow_cookies: false
} as Options;


/*
This function is used to create action triggers for django's api endpoints' name;
path('do-something/', do_something, name='do_something_view_name'), `do_something_view_name` is the name of the endpoint.
export const actions = via_route_name("do_something_view_name");
 */
export const via_route_name =
    (proxy_paths: string | string[] | NamedActionInfo[], opt_: Options = {}) => {
        opt_ = {...default_options, ...opt_};
        let actions: Actions = {};
        if (typeof proxy_paths === 'string') {
            proxy_paths = [proxy_paths];
        }
        proxy_paths.map((proxy_action) => {
            if (typeof proxy_action === 'string') {
                proxy_action = {name: proxy_action, method: 'POST', allow_cookies: false};
            }
            const action: Actions = {
                [proxy_action.name]: async (event: RequestEvent) => {

                    const form_data = await event.request.formData();
                    let url = `${opt_.django_base_api}/trvun/?url_name=${proxy_action.name}`;
                    let options: RequestInit = {method: proxy_action.method};

                    if (proxy_action.method === 'GET')
                        url = `${url}&${new URLSearchParams(form_data as any).toString()}`;
                    else options = {...options, body: form_data};

                    let response: Response;
                    let data = {};
                    try {
                        response = await event.fetch(url, options);
                        if (proxy_action.allow_cookies || opt_.allow_cookies) {
                            assign_cookies(event, response);
                        }
                        data = await response.json();
                    } catch (e) {
                        console.log("ERR:", e);
                        return fail(500, {
                            message: 'Something went wrong.',
                            message_type: 'error',
                            alias: 'internal_server_error'
                        } as Message);
                    }
                    if ("redirect" in data && typeof data.redirect === "string" && data.redirect.startsWith("/")) {
                        if ("message" in data && typeof data.message === "string") {
                            put_flash(event.cookies, {
                                ...data as Message,
                                path: data.redirect
                            });
                        }
                        redirect(303, data.redirect);
                    }

                    if (response.ok) {
                        return data;
                    }
                    return fail(response.status, data);
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
export const via_route =
    (proxy_paths: string[] | PathActionInfo[], opt_: PrefixOptions = {}) => {
        opt_ = {...default_options, ...opt_};

        let actions: Actions = {};
        proxy_paths.map((proxy_action) => {
            if (typeof proxy_action === "string") {
                proxy_action = {path: proxy_action, method: "POST", allow_cookies: false};
            }
            if (opt_.prefix && !opt_.prefix.endsWith("/")) {
                opt_.prefix += "/";
            }
            proxy_action.path = opt_.prefix + proxy_action.path;
            const action = {
                [proxy_action.path]: async (event: RequestEvent) => {
                    try {
                        const form_data = await event.request.formData();
                        let url = `${opt_.django_base_api}/${proxy_action.path}`;
                        let options: RequestInit = {method: proxy_action.method}
                        if (proxy_action.method === 'GET') {
                            url = `${url}?${new URLSearchParams(form_data as any).toString()}`;
                        } else {
                            options = {...options, body: form_data};
                        }
                        const response = await event.fetch(url, options);

                        if (proxy_action.allow_cookies || opt_.allow_cookies) {
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
                    } as Message);
                }
            }
            actions = {...actions, ...action};
        });
        return actions;
    }