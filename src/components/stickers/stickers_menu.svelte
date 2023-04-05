<svelte:options accessors />

<script lang="ts">
    import { onMount } from "svelte";
    import { events } from "webextension-polyfill";
    import Sticker from "./sticker.svelte";
    export let sticker_list;
    var search = "";
    export let stickers_data;
    export let renderhandler = (sticker: Sticker, stickerid: string) => {};
    let root : HTMLElement;
    export let  position = [0,0];
    var expand_position = [0,0];
    function ScreenFit(){

        const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        var to_expand_position = [0,0]
        if(  position[0]  + 656 > viewportWidth){
            to_expand_position[0] = -656;
        }
        if( position[1] + 500 > viewportHeight){
            to_expand_position[0] = -656;
        }
        expand_position= to_expand_position;
        // return (
        //     rect.right < 0 ||
        //     rect.bottom < 0 ||
        //     rect.left > viewportWidth ||
        //     rect.top > viewportHeight || rect.left  + 656 > viewportWidth ||  rect.top + 500 > viewportHeight
        // );
    }
    onMount(  ()=>{
        ScreenFit();
        window.addEventListener('resize', ScreenFit);
    });
</script>

<div
    bind:this={root}
    class="tw-z-20 tw-fixed tw-rounded-[15px] tw-p-5  tw-flex tw-justify-center  tw-text-white tw-bg-[#1e1e24] " style=" width:656px; height:500px;   left: {position[0] + expand_position[0]}px; top: {position[1]+ expand_position[1] }px;"
>
    <div class="tw-rounded-[15px] tw-bg-[#131317] tw-flex tw-items-center tw-justify-center tw-flex-col tw-w-[579px] tw-h-[269px]">
        <input type="text" placeholder="Поиск" bind:value={search} class=" tw-w-[537px] tw-h-[41px] tw-rounded-[15px] tw-bg-black tw-mb-[13px] tw-p-[11px] tw-pr-[18px] tw-pl-[18px] placeholder:tw-text-white placeholder:tw-text-opacity-30 " />

    
        <div
            id="emotelist"
            class=" tw-whitespace-nowrap tw-flex tw-justify-center tw-rounded-[15px] tw-bg-[#222227] tw-w-[539px] tw-h-[150px] " 
        > 
            <div class="tw-scroll-smooth tw-overflow-x-auto tw-overflow-y-clip tw-w-[525px] tw-h-[165px]">

          
                <div class="tw-rounded-[15px] tw-flex   tw-items-center tw-h-[150px]">
                    
                    {#each sticker_list as id}
                        {#if search.length == 0 ||search.length > 0 && stickers_data[id].title.toLowerCase().includes(search.toLowerCase())}
                            
                        
                            <div
                                class=" tw-rounded-[15px] tw-relative tw-flex tw-items-center tw-justify-center tw-min-w-[128px] tw-h-[128px] tw-cursor-pointer tw-border-transparent tw-align-bottom  tw-ml-[15px]  " style="background: linear-gradient(rgba(0, 0, 0, 25%), rgba(0, 0, 0, 25%)),linear-gradient(#575757, #575757); "
                            >
                                <div class="tw-rounded-[15px] tw-flex tw-justify-center tw-items-center tw-cursor-text tw-absolute tw-z-10 tw-p-1 tw-pl-3 tw-pr-3 -tw-bottom-1 -tw-right-1" style="background-color: #575757;">
                                    <p class=" tw-text-[16px]">{stickers_data[id].symbol}</p>
                                </div>
                                <div class="tw-rounded-[15px]  tw-bg-black tw-bg-opacity-25">
                                    <Sticker
                                        {renderhandler}
                                        height={122}
                                        width={122}
                                        {id}
                                        title={stickers_data[id].title}
                                    />
                                </div>
                            
                            </div>
                        {/if}
                    {/each}
                </div>
            </div>
        </div>
    </div>
    <!-- <p class=" tw-m-[30px] tw-mb-0 ">Фон</p>
    <div
        id="bglist"
        class=" tw-whitespace-nowrap tw-m-[15px] tw-mt-0 tw-flow-root tw-h-[75px] tw-scroll-smooth  "
    /> -->
</div>
