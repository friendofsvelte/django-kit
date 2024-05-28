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

<div class="z-30 toast-notification relative animate-shake"
     class:success={toast.message_type === "success"}
     class:error={toast.message_type === "error"}
     class:warning={toast.message_type === "warning"}
     class:info={toast.message_type === "info"}>
    <div class="toast-notification__head">
        {statusIcons[toast.message_type]}
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
