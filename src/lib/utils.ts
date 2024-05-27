import type {RequestEvent} from "@sveltejs/kit";

export const assign_cookies =
    (event: RequestEvent, response: Response) => {
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
                // @ts-ignore
                event.cookies.set(key, value, {path, sameSite});
            });
        }
    }
