<script lang="ts">
    import {dismiss_toast} from "$lib/notifier.svelte.js";
    import type {Toast} from "$lib/types.js";

    export let toast: Toast;
</script>

<div class="toast-notification {toast.message_type}">
    <div class="toast-notification__head">
        <span class="toast-notification__icon"></span>
        <h3 class="toast-notification__message">{toast.message}</h3>
        <button class="toast-notification__close" on:click={() => dismiss_toast(toast.id)}>
            {'✕'}
        </button>
    </div>
    {#if toast.action}
        <a href="{toast.action.path}"
           class="action">{toast.action.label}</a>
    {/if}
</div>
