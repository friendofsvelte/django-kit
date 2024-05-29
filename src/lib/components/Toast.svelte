<script lang="ts">
    import {dismiss_toast} from "$lib/notifier.svelte.js";
    import type {ToastNotification} from "$lib/types.js";

    const statusIcons = {
        success: '✅',
        error: '🚨',
        warning: '⚠️',
        info: 'ℹ️'
    };
    export let toast: ToastNotification & { message_type: keyof typeof statusIcons };

    setTimeout(() => {
        dismiss_toast(toast.id);
    }, toast.auto_dismiss_duration);
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
