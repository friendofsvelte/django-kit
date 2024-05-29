<script lang="ts">
    import {flip} from 'svelte/animate';
    import {fade} from 'svelte/transition';
    import {quintOut} from 'svelte/easing';
    import {page} from '$app/stores';
    import {parse} from 'cookie';
    import {afterNavigate} from '$app/navigation';
    import type {FlashMessage, MessageOut} from "$lib/types.js";
    import {add_toast, error_triggered, toasts} from "$lib/notifier.svelte.js";
    import Toast from "$lib/components/Toast.svelte";

    let {
        error_toast = {
            message: 'Something went wrong during the request. Please report this to the developers.',
            alias: 'server_error',
            message_type: 'error'
        },
        children
    }
        = $props();

    function trigger_message(msg_source: MessageOut) {
        if (msg_source && msg_source?.message) {
            if (msg_source?.message) {
                // error_triggered = true;
                add_toast({...msg_source, message_type: msg_source.message_type || 'warning'});
                return true;
            }
        }
    }

    let form_data: any = $page.form;
    let page_data: any = $page.data;
    let error_data: any = $page.error;

    $inspect(toasts);
    $effect(() => {
        if (trigger_message(form_data)) form_data = {};
        if (trigger_message(page_data)) page_data = {};
        if (trigger_message(error_data)) error_data = {};
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

{#if toasts.length}
    {#if children}
        {@render children()}
    {:else}
        <div class="toast-notifications">
            {#each toasts as toast (toast.id)}
                <div transition:fade animate:flip={{easing: quintOut, duration: 500}}>
                    <Toast {toast}/>
                </div>
            {/each}
        </div>
    {/if}
{/if}