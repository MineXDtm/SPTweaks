<svelte:options accessors />

<script lang="typescript">
   import { get_current_component } from "svelte/internal";
    import browser from "webextension-polyfill";
    export var outline_size = 0;
    export var src = "";
    export var height = 118 ;
    export var title = "loading";
    export var stickerid = "";
    export var width = 118;

    import { onMount } from "svelte";
    var outline_box;

    var gradient =
        "   conic-gradient(from 170.95deg at 50% 50%, #402C59 -53.44deg, #2D2B51 53.77deg, #45425B 125.86deg, #67547A 240.95deg, #402C59 306.56deg, #2D2B51 413.77deg)";
    onMount(() => {
        renderhandler(thisComponent,stickerid);
      
    });
    var sticker_box = undefined;
    var render = undefined;

    const thisComponent = get_current_component();
    export var renderhandler = (sticker,stickerid:string )=>{}
    
    
</script>

<div
    bind:this={sticker_box}
    style="height: {height + 'px'}; width: {width + 'px'};"
    class="sticker tw-flex tw-justify-center tw-items-center tw-relative"
>
    {#if outline_size > 0 }
        <div
            bind:this={outline_box}
            class=" tw-flex tw-justify-center tw-items-center tw-absolute tw-m-auto tw-h-full tw-w-full"
        >
            <div
                class="outline_sticker"
                style=" -webkit-mask-image: url({src}); width: {width +
                    outline_size +
                    'px'}; height:{height + outline_size + 'px'}; 
        left:{-outline_size + 'px'}; top: {-outline_size +
                    'px'}; background-image:{gradient}; "
            />
            <div
                class="outline_sticker"
                style="-webkit-mask-image: url({src}); width: {width +
                    outline_size +
                    'px'}; height:{height + outline_size + 'px'}; 
        left:{0 + 'px'}; top: {-outline_size +
                    'px'}; background-image:{gradient}; "
            />
            <div
                class="outline_sticker"
                style="-webkit-mask-image: url({src}); width: {width +
                    outline_size +
                    'px'}; height:{height + outline_size + 'px'}; 
        left:{0 + 'px'}; top: {0 + 'px'}; background-image:{gradient}; "
            />
            <div
                class="outline_sticker"
                style="-webkit-mask-image: url({src}); width: {width +
                    outline_size +
                    'px'}; height:{height + outline_size + 'px'}; 
        left:{-outline_size + 'px'}; top: {0 +
                    'px'}; background-image:{gradient}; "
            />
        </div>
    {/if}
    <img
        src={src.length > 0
            ? src
            : browser.runtime.getURL("src/assets/load_sticker.svg")}
        bind:this={render}
        {title}
        alt="_"
        draggable="false"
        class="border_sticker  tw-rounded-[15px] tw-h-full tw-w-full tw-z-[1] tw-select-none tw-relative {src.length >
        0
            ? ''
            : 'tw-bg-gray-700'}  tw-rounded-[15px] tw-object-contain"
    />
</div>
