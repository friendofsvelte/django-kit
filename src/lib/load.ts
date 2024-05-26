import {type Actions, error, type RequestEvent,} from '@sveltejs/kit';
import {SECRET_BASE_API} from "$env/static/private";

const load_via_route_name = async (
    proxy_paths: string | string[],
    django_base_api: string = SECRET_BASE_API,
    allow_textual_failure: boolean = false
) => {
    if (typeof proxy_paths === 'string') {
        proxy_paths = [proxy_paths];
    }

    return async (event: RequestEvent) => {
        proxy_paths.map(async (proxy_action) => {
            let response: Response;
            try {
                response = await event.fetch(
                    `${django_base_api}/trvun/?url_name=${proxy_action}&${event.url.searchParams.toString()}`,
                    {method: "GET"}
                );
                if (response.ok) return await response.json();
            } catch (e) {
                console.log(e);
                error(500, 'Server is not responding, please try again later.');
            }
            if (allow_textual_failure) {
                error(response.status, await response.text());
            }
        });
    };

};
