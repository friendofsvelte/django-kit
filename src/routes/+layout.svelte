<script>
    import {add_toast, dismiss_toast_after} from "$lib/notifier.svelte";
    import DefaultFlash from "$lib/components/DefaultFlash.svelte";
    import "$lib/styles/toast.css";
    import PutFlash from "$lib/components/PutFlash.svelte";

    let {children} = $props();
</script>

<PutFlash/>
<DefaultFlash/>

{@render children()}

<button onclick={()=>{dismiss_toast_after(add_toast({message: 'Hello World', message_type: 'success',}))}}>
    Add Toast
</button>