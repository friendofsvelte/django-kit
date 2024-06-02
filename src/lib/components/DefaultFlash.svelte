<script lang="ts">
    import {flip} from 'svelte/animate';
    import {fade} from 'svelte/transition';
    import {quintOut} from 'svelte/easing';
    import {notifier} from "$lib/notifier.svelte.js";
    import Toast from "$lib/components/DefaultToast.svelte";

    let {children} = $props();
</script>

{#if notifier.toasts.length}
    {#if children}
        {@render children()}
    {:else}
        <div class="toast-notifications">
            {#each notifier.toasts as toast (toast.id)}
                <div transition:fade animate:flip={{easing: quintOut, duration: 500}}>
                    <Toast {toast}/>
                </div>
            {/each}
        </div>
    {/if}
{/if}