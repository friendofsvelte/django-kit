<script lang="ts">
    import {page} from '$app/stores';
    import {parse} from 'cookie';
    import {afterNavigate} from '$app/navigation';
    import type {FlashMessage, MessageOut} from "$lib/types.js";
    import {add_toast} from "$lib/notifier.svelte.js";
    import {untrack} from "svelte";

    function trigger_message(msg_source: MessageOut) {
        if (msg_source && msg_source?.message) {
            const toast = {...msg_source, message_type: msg_source?.message_type || 'warning'};
            untrack(() => add_toast(toast));
        }
    }

    $effect(() => {
        trigger_message($page.form);
        trigger_message($page.data);
        trigger_message($page.error);
    });

    function assign_flash_message() {
        try {
            const raw_flash_message = parse(document.cookie)[`flash_message`];
            if (raw_flash_message) {
                const flash_message = JSON.parse(atob(raw_flash_message) || '{}') as FlashMessage;
                if (flash_message.path !== $page.url.pathname) return;
                trigger_message(flash_message);
                document.cookie = `flash_message=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            }
        } catch (e) {
            console.error(e);
        }
    }


    afterNavigate(() => {
        assign_flash_message();
    });
</script>