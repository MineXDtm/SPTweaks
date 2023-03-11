<svelte:options accessors />

<script lang="ts">
    import { events } from "webextension-polyfill";
    import Sticker from "./sticker.svelte";

    function e(test) {
        console.log(test);
    }
    export let sticker_list;
    export let renderhandler = (sticker: Sticker, stickerid: string) => {};
    export let root = undefined;
</script>

<div
    bind:this={root}
    class=" tw-rounded-2xl  tw-text-white tw-bg-[#1e1e24] tw-w-[656px] "
>
    <p class=" tw-pr-[5px] tw-text-white tw-pt-[25px] tw-pl-[25px]">TEST</p>
    <div
        id="emotelist"
        class=" tw-whitespace-nowrap tw-m-[15px] tw-mt-0 tw-flow-root tw-h-[205px] tw-scroll-smooth tw-overflow-x-scroll tw-pt-[25px]"
    >
        {#each sticker_list as id}
            <div
                class=" tw-p-[15px] tw-inline-flex tw-w-[150px] tw-h-[150px] tw-cursor-pointer tw-border-transparent tw-align-bottom  tw-ml-[15px]  tw-bg-black tw-bg-opacity-5  "
            >
                <Sticker
                    {renderhandler}
                    height={118}
                    width={118}
                    stickerid={id}
                />
            </div>
        {/each}
    </div>
    <p class=" tw-m-[30px] tw-mb-0 ">Фон</p>
    <div
        id="bglist"
        class=" tw-whitespace-nowrap tw-m-[15px] tw-mt-0 tw-flow-root tw-h-[75px] tw-scroll-smooth  "
    />
</div>
