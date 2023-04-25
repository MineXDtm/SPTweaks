<script>
    import VoteButtons from "../actions/vote_buttons.svelte";

    export var image = "";
    export var text = "";
    export var minecraftuuid = "X-Steve";

    var json = undefined;
    try {
        json = JSON.parse(text);
    } catch (e) {}

    export var upvotes = 1;
    export var downvotes = 1;
</script>

<div class="spt-w-[525px] spt-h-[400px] spt-shrink-0">
    <div
        class="spt-relative spt-w-full spt-h-full spt-overflow-hidden spt-flex spt-justify-center spt-items-center spt-rounded-[15px]"
    >
        <div
            class="spt-absolute spt-grow-0 spt-shrink-0 spt-w-[110%] spt-max-w-[110%] spt-h-[110%] spt-blur-[10px]"
            style="background: conic-gradient(from 224.85deg at 75.71% 23.9%, #967CE0 -106.88deg, #B8B8B8 31.88deg, #C68FF3 153.75deg, #967CE0 253.13deg, #B8B8B8 391.87deg);"
        />
        <div
            class="spt-absolute spt-cursor-pointer spt-grow-0 spt-shrink-0 spt-w-[110%] spt-max-w-[110%] spt-h-[110%] spt-blur-[10px] spt-bg-black/25"
        />
        {#if image != "" && text == ""}
            <img
                src={image}
                draggable="false"
                class="spt-w-full spt-cursor-pointer spt-h-full spt-rounded-[15px] spt-absolute spt-object-cover"
            />

            <div class="spt-absolute spt-bottom-[19px] spt-left-[17px]">
                <VoteButtons {upvotes} {downvotes}/>
            </div>
        {:else if image != ""}
            <img
                src={image}
                draggable="false"
                class="spt-w-full spt-cursor-pointer spt-h-full spt-absolute spt-top-0 spt-object-cover spt-mb-[23px]"
            />

            <div
                class=" spt-absolute spt-flex spt-space-x-5 spt-bottom-[19px] spt-left-[17px] spt-rounded-[15px] spt-backdrop-blur-sm spt-w-[425px] spt-h-[105px] hover:spt-h-[90%] spt-transition-all spt-duration-300 spt-bg-black/80 spt-pr-[25px] spt-pl-[25px] spt-pb-[15px] spt-pt-[15px]"
            >
                <div class="spt-flex spt-items-end spt-h-full">
                    <div
                        class="spt-flex spt-flex-row spt-space-x-[10px]  spt-h-[72px] spt-items-center"
                    >
                        <!-- <p>45</p> -->
                        <VoteButtons {upvotes} {downvotes} />
                    </div>
                </div>
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
           

            <div class="spt-absolute spt-bottom-[19px] spt-left-[17px]">
                <VoteButtons {upvotes} {downvotes} />
            </div>
        {/if}

        <div
            class="spt-absolute spt-rounded-[12px] spt-left-[17px] spt-top-[15px] spt-pr-[9px] spt-pl-[9px] spt-pb-[7px] spt-pt-[7px] spt-bg-black/30"
        >
            <img
                draggable="false"
                class="spt-rounded-[12px] spt-select-none"
                src="https://visage.surgeplay.com/face/80/{minecraftuuid}.png"
                height="54"
                width="54"
            />
        </div>
    </div>
</div>
