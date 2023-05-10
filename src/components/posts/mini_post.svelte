<script>
 
    import { isdragging } from '/src/stores/main.js';
    import {  next_page } from "/src/stores/categories.js";
    import VoteButtons from "../actions/vote_buttons.svelte";

    var image = "";
    var text = "";
    var minecraftuuid = "X-Steve";
    var nickname = "X-Steve";
    var upvotes = 1;
    var downvotes = 1;
    export var post;

    if(post){
        text = post.text;
        minecraftuuid = post.account.user.minecraftUUID;
        
        if (post.image)
            image =
                "https://storage.yandexcloud.net/spworlds/images/posts/" +
                post.image +
                ".webp";
        nickname = post.account.user.username;
 
        upvotes = post.upvotes;
        downvotes = post.downvotes;
    }
    var json = undefined;
    try {
        json = JSON.parse(text);
    } catch (e) {}


    var hover_text_bar = false;
    var can_interact = false;
    var can_interact = false;
    isdragging.subscribe(value => {
        if(can_interact)can_interact = !value;
        else{
            setTimeout(
                ()=>{can_interact = !$isdragging; },100
            )
        }
        
    });
</script>

<div class=" spt-shrink-0  spt-w-[580px] spt-h-[400px]"  >
    <div
        class="spt-relative spt-w-full spt-h-full spt-overflow-hidden spt-flex spt-justify-center spt-items-center spt-rounded-[15px]"
    >
        <div
            class="spt-absolute spt-grow-0 spt-shrink-0 spt-w-full spt-h-full"
            style="background: conic-gradient(from 224.85deg at 75.71% 23.9%, #967CE0 -106.88deg, #B8B8B8 31.88deg, #C68FF3 153.75deg, #967CE0 253.13deg, #B8B8B8 391.87deg);"
        />
        <div
           
            class="spt-absolute spt-grow-0 spt-shrink-0 spt-w-full spt-h-full spt-backdrop-blur-[45px] spt-bg-black/[0.45]"
        />
 

        {#if image != ""}
            <img
                src={image}
                draggable="false"
                class="spt-w-full spt-cursor-pointer spt-h-full spt-absolute spt-top-0 spt-transition-all spt-object-cover    spt-mb-[23px]"
            />

          
        {:else}
            <div class=" spt-absolute spt-w-[290px] spt-h-[281px] spt-flex spt-flex-col spt-items-center spt-justify-center">
                <div class="spt-h-fit  spt-max-h-full spt-overflow-auto">
                    {#if json != undefined}
                        {#each json.content as node}
                            {#if node.type === "paragraph"}
                                <p
                                    class="spt-text-[16px] spt-w-full spt-select-none spt-cursor-pointer  spt-font-medium spt-break-words  "
                                >
                                    {#if node.content != undefined}
                                        {#each node.content as textNode}
                                            {textNode.text}
                                        {/each}
                                    {/if}
                                </p>
                            {/if}
                        {/each}
                    {:else}
                        <p
                            class="spt-text-[16px] spt-w-full spt-select-none spt-cursor-pointer  spt-font-medium spt-break-words"
                        >
                            {text}
                        </p>
                    {/if}
                </div> 
            </div>
           

      
        {/if}
        <div    on:click={()=>{if(!can_interact)return; next_page("eee"); }} class="spt-absolute spt-w-full spt-h-full spt-cursor-pointer" />
        <div class="spt-absolute spt-transition-all spt-duration-300 {hover_text_bar? '!spt-h-[90%]' : 'spt-h-[93px] '} spt-bottom-[19px] spt-left-[17px] spt-flex spt-items-end spt-flex-row spt-space-x-[10px]"  >

            

            <VoteButtons {upvotes} {downvotes} />
            {#if image != "" && text.length > 0}
                <div
                    on:mouseenter={()=>{if($isdragging)return; hover_text_bar=true}}
                    on:mouseleave={()=>{hover_text_bar=false}}
                   
                    class="spt-flex spt-rounded-[15px] spt-w-[346px] spt-backdrop-blur-sm spt-h-full  spt-bg-black/80 spt-pr-[25px] spt-pl-[25px] spt-pb-[15px] spt-pt-[15px]" 
                >
                    <div class="spt-grow spt-h-full spt-overflow-hidden spt-flex spt-justify-center spt-flex-col">
                        <div class="spt-h-fit  spt-max-h-full">
                            {#if json != undefined}
                                {#each json.content as node}
                                    {#if node.type === "paragraph"}
                                        <p
                                            class="spt-shrink-0  spt-text-[16px] spt-select-none spt-cursor-pointer spt-w-full   spt-overflow-hidden spt-font-medium "
                                        >
                                            {#if node.content != undefined}
                                                {#each node.content as textNode}
                                                    {textNode.text}
                                                {/each}
                                            {/if}
                                        </p>
                                    {/if}
                                {/each}
                            {:else}
                                <p
                                    class=" spt-text-[16px] spt-select-none spt-cursor-pointer spt-w-full  spt-font-medium "
                                >
                                    {text}
                                </p>
                            {/if}
                        </div>
                    </div>
                </div>
            {/if}
        </div>
    
        <div
            class="spt-absolute spt-flex spt-flex-row spt-space-x-[11px] spt-items-center spt-rounded-[12px] spt-left-[17px] spt-top-[15px] spt-pr-[12px] spt-pl-[12px] spt-pb-[7px] spt-pt-[7px] spt-bg-black/40"
        >
            <img
                draggable="false"
                class="spt-rounded-[12px] spt-select-none"
                src="https://visage.surgeplay.com/face/80/{minecraftuuid}.png"
                height="54"
                width="54"
            />
            <p class="spt-text-[16px] spt-font-bold">{nickname}</p>
        </div>
    </div>
</div>
