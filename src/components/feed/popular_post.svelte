<script lang="typescript">
    import browser from "webextension-polyfill";
    export let left = 0;
    import { fade } from 'svelte/transition';
    export let selected = false;
    export let image = "";
    export let font_size = 14;
    export let padding_text = 5;
    let content_element;
 
</script>

<div
    class="spt-h-[357px] spt-w-[434px] spt-flex spt-items-center spt-justify-center spt-absolute {left ==
    0
        ? ''
        : 'spt-transition-all spt-duration-500'}"
    style="left: {left + 'px'};"
>
    <div
        class=" spt-absolute spt-transition-all spt-duration-300 spt-rounded-[15px] spt-shadow-md {selected
            ? 'spt-z-10 spt-w-[651px]  spt-h-full'
            : 'spt-w-full spt-h-[253px] spt-z-0  '}"
        style="background: conic-gradient(from 224.85deg at 75.71% 23.9%, #E7E7E7 -106.88deg, #EABDFF 31.88deg, #FFB0F2 153.75deg, #E7E7E7 253.13deg, #EABDFF 391.87deg);"
    >
        <div
            class=" spt-absolute spt-bg-black/30 spt-w-full spt-h-full spt-rounded-[15px] spt-backdrop-blur-[20px]"
        />
        <img
            alt="taasd"
            class=" spt-absolute spt-w-full spt-h-full spt-rounded-[15px] spt-object-cover spt-shadow-md"
            draggable="false"
            src={image}
        />
        {#if selected}
            <div
                transition:fade 
                class="spt-absolute spt-h-[130px] spt-flex spt-space-x-[25px] spt-left-3 spt-bottom-3 spt-bg-black/90 spt-w-fit spt-p-[25px] spt-pt-[20px] spt-pb-[25px] spt-rounded-[15px] spt-backdrop-blur-[20px]"
            >
                <div class="spt-flex spt-items-end spt-grow">
                    <img class="spt-rounded-[12px]" src="https://visage.surgeplay.com/face/80/X-Steve" height="54" width="54" />
                </div>
                <div
                    class="spt-flex spt-flex-col spt-w-[230px] spt-h-full spt-text-white"
                >
                    <p
                        class="spt-w-full spt-grow-0 spt-text-ellipsis spt-font-bold spt-text-[20px]"
                    >
                        Andreu333XD
                    </p>
                    <div
                        bind:clientHeight={content_element}
                        class="spt-w-full spt-h-full spt-grow"
                    >
                        <p
                            
                            class="spt-w-full spt-overflow-hidden spt-text-ellipsis" 
                            style="font-size:{font_size +"px"}; -webkit-line-clamp:{content_element
                                ? ~~(content_element / (font_size + padding_text))
                                : 1}; -webkit-box-orient: vertical;  display: -webkit-box; "
                        >
                            Мб челлендж забабахаем? Генерируйте свои скины в
                            Mijorney и публикуйте а-ля
                        </p>
                    </div>
                    
                </div>
                <div class="spt-flex  spt-items-end spt-grow">
                    <div class="spt-flex-col spt-space-y-[6px]">
                        <div class="vote_button_main spt-bg-[#9C004B]/[0.65] ">
                            <img src="{browser.runtime.getURL("src/assets/icons/upvote.svg")}" />
                            <p class="spt-text-white spt-text-[13px] spt-w-full  spt-text-center">999</p>
                        </div>
                        <div  class="vote_button_main spt-bg-[#ffffff]/25 ">
                            <img src="{browser.runtime.getURL("src/assets/icons/downvote.svg")}" />
                            <p class="spt-text-white spt-text-[13px] spt-w-full spt-text-center">7</p>
                        </div>
                    </div>
                </div>
            </div>
        {/if}
    </div>
</div>
