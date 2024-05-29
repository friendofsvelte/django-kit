<script>
    import Flash from "$lib/components/Flash.svelte";
    import {quintOut} from "svelte/easing";
    import "$lib/styles/toast.css";
    import {add_toast} from "$lib/notifier.svelte";

    let {children} = $props();
    console.log(children)
</script>

<Flash/>
{@render children()}

<button on:click={()=>{
    add_toast({
        message: 'Hello World',
        message_type: 'success',
    })
}}>Add Toast
</button>