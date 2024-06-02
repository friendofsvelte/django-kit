<script lang="ts">
    import {dismiss_toast} from "$lib/notifier.svelte.js";
    import type {Toast} from "$lib/types.js";

    export let toast: Toast;
</script>

<div class="toast {toast.message_type}">
    <div class="tn__head">
        <span class="tn_icon"></span>
        <h3 class="tn_msg">{toast.message}</h3>
        <button class="tn_exit" on:click={() => dismiss_toast(toast.id)}>{'✕'}</button>
    </div>
    {#if toast.action}
        <a href="{toast.action.path}" class="action">{toast.action.label}</a>
    {/if}
</div>
