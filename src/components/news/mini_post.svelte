<script>
    import VoteButtons from "../actions/vote_buttons.svelte";
    export var image = "";
    export var text = "";
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
            class="spt-absolute spt-grow-0 spt-shrink-0 spt-w-[110%] spt-max-w-[110%] spt-h-[110%] spt-blur-[10px] spt-bg-black/25"
        />
        {#if image != "" && text == ""}
            <img
                src={image}
                draggable="false"
                class="spt-w-full spt-h-full spt-rounded-[15px] spt-absolute spt-object-cover"
            />
            <div
                class="spt-absolute spt-grow-0 spt-shrink-0 spt-w-[110%] spt-max-w-[110%] spt-h-[110%] spt-blur-[10px] spt-bg-black/40 spt-opacity-100 spt-transition-all hover:spt-opacity-0"
            />
        {:else if image != ""}
            <img
                src={image}
                draggable="false"
                class="spt-w-full spt-h-full spt-absolute spt-top-0 spt-object-cover spt-mb-[23px]"
            />

            <div
                class=" spt-absolute spt-flex spt-items-center spt-space-x-5 spt-bottom-8 spt-rounded-[15px] spt-backdrop-blur-sm spt-w-[425px] spt-h-[105px] spt-bg-black/80 spt-pr-[25px] spt-pl-[25px] spt-pb-[15px] spt-pt-[15px]"
            >
                <VoteButtons />
                <div class=" spt-h-full spt-overflow-hidden">
                    <p
                        class=" spt-h-full spt-text-[16px] spt-w-full spt-overflow-hidden spt-font-medium"
                    >
                        {text}
                    </p>
                </div>
            </div>
        {:else}
            <p
                class="spt-text-[16px] spt-absolute spt-w-[290px] spt-h-[281px] spt-font-medium spt-flex spt-items-center"
            >
                {text}
            </p>
        {/if}

        <div
            class="spt-absolute spt-rounded-[12px] spt-left-[17px] spt-top-[15px] spt-pr-[9px] spt-pl-[9px] spt-pb-[7px] spt-pt-[7px] spt-bg-black/30"
        >
            <img
                draggable="false"
                class="spt-rounded-[12px] spt-select-none"
                src="https://visage.surgeplay.com/face/80/X-Steve.png"
                height="54"
                width="54"
            />
        </div>
    </div>
</div>
