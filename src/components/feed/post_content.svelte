<svelte:options accessors={true} />

<script>
    export var main;
    export var next = false;
    var content = "абема";
    var minecraftuuid = "X-Steve";
    var nickname = "test";
    var image = "";
    var post_date = "";
    export var post;

    export var candrag = true;
    if (post && post.account != undefined) {
        content = post.text;
        minecraftuuid = post.account.user.minecraftUUID;

        if (post.image)
            image =
                "https://storage.yandexcloud.net/spworlds/images/posts/" +
                post.image +
                ".webp";
        nickname = post.account.user.username;
        post_date = post.createdAt;
    }
    var json = undefined;
    try {
        json = JSON.parse(content);
    } catch (e) {}
    var textlength = 0;
    if (json != undefined) {
        json.content.forEach((node) => {
            if (node.type === "paragraph" && node.content != undefined) {
                node.content.forEach((textNode) => {
                    textlength += textNode.text.length;
                });
            }
        });
    } else {
        textlength += content.length;
    } 
    var descriptionlength = 0;
    var can_show_more_info = false;
    var more_info = false;

    $: can_show_more_info = descriptionlength > 25;
</script>

<div
    bind:this={main}
    class="spt-w-full spt-h-full spt-overflow-hidden spt-relative spt-flex spt-justify-center spt-items-center"
>
    <div
        class="spt-absolute spt-select-none spt-grow-0 spt-shrink-0 spt-w-full spt-h-full"
        style="background: conic-gradient(from 224.85deg at 75.71% 23.9%, #E7E7E7 -106.88deg, #EABDFF 31.88deg, #FFB0F2 153.75deg, #E7E7E7 253.13deg, #EABDFF 391.87deg);"
    />
    {#if image}
        <img
            src={image}
            draggable="false"
            class="spt-w-full spt-cursor-pointer spt-h-full spt-absolute spt-top-0 spt-transition-all spt-object-cover spt-mb-[23px]"
        />
    {/if}
    <div
        class="spt-absolute spt-select-none spt-grow-0 spt-shrink-0 spt-w-full spt-h-full spt-backdrop-blur-[45px] {image ==
        ''
            ? 'spt-bg-black/[0.15]'
            : 'spt-bg-black/[0.45]'}"
    />
    {#if image}
        <img
            src={image}
            draggable="false"
            class="spt-w-full spt-cursor-pointer spt-h-full spt-absolute spt-top-0 spt-transition-all spt-object-contain spt-mb-[23px]"
        />
    {:else}
        <div
            class="spt-absolute spt-left-5 spt-top-52 spt-flex spt-justify-center spt-flex-col spt-w-[976px] spt-h-fit spt-transition-opacity spt-duration-300 {next
                ? 'spt-opacity-25'
                : 'spt-opacity-100'}"
        >
            {#if json != undefined}
                {#each json.content as node}
                        <p class="spt-pointer-events-none spt-select-none spt-text-black spt-text-[96px] spt-font-black spt-opacity-[0.02]" > 
                            {#if node.content != undefined}
                                {#each node.content as textNode}
                                    {textNode.text}
                                {/each}
                            {/if}
                        </p>
                {/each}
            {:else}
                <p
                    class="spt-pointer-events-none spt-select-none spt-text-black spt-text-[96px] spt-font-black spt-opacity-[0.02]  ">
                    {content}
                </p>
            {/if}
        </div>
        <div
            on:mouseenter={() => {
                candrag = false;
                console.log("Test")
            }}
            on:mouseleave={() => {
                candrag = true;
            }}
            class="spt-absolute spt-flex spt-justify-center spt-flex-col spt-w-fit spt-max-w-[440px] spt-overflow-auto spt-h-fit spt-max-h-[390px] spt-transition-opacity spt-duration-300 {next
                ? 'spt-opacity-25'
                : 'spt-opacity-100'}"
        >
            {#if json != undefined}
                {#each json.content as node}
                    {#if node.type === "paragraph"}
                        <p
                            class="spt-pointer-events-none spt-select-none spt-text-black {textlength >
                            30
                                ? 'spt-text-[16px] spt-font-semibold'
                                : 'spt-text-[20px] spt-font-bold'} "
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
                    class="spt-pointer-events-none spt-select-none spt-text-black {textlength >
                    30
                        ? 'spt-text-[16px] spt-font-semibold'
                        : 'spt-text-[20px] spt-font-bold'} spt-font-semibold"
                >
                    {content}
                </p>
            {/if}
        </div>
        
    {/if}

    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
        class="spt- spt-select-none spt-w-full spt-h-full spt-flex spt-flex-row spt-space-x-[10px] spt-pr-[15px] spt-pl-[15px] spt-pb-[15px] spt-pt-[15px]"
    >
        <div
            class="spt-flex-grow spt-flex spt-flex-row spt-space-x-[10px] spt-h-fit"
        >
            <div
                on:mouseenter={() => {
                    candrag = false;
                }}
                on:mouseleave={() => {
                    candrag = true;
                }}
                class="spt-max-w-[460px] spt-flex spt-flex-row spt-w-fit spt-h-fit spt-rounded-[15px] spt-bg-black/[0.65] spt-backdrop-blur-[15px] spt-space-x-[15px] spt-pt-[15px] spt-pb-[15px] spt-pr-[25px] spt-pl-[25px]"
            >
                <div
                    class="spt-flex-grow spt-h-full spt-overflow-hidden spt-flex-col spt-space-y-[15px]"
                >
                    <div
                        class=" spt-w-fit spt-h-fit spt-space-x-[15px] spt-flex spt-items-center"
                    >
                        <img
                            draggable="false"
                            class="spt-rounded-[12px] spt-select-none"
                            src="https://visage.surgeplay.com/face/80/{minecraftuuid}.png"
                            height="30"
                            width="30"
                        />
                        <p class="spt-text-[14px] spt-font-bold">{nickname}</p>
                    </div>
                    <div
                        class="{more_info
                            ? 'spt-max-h-[90%]'
                            : 'spt-max-h-[25px]'}   spt-overflow-hidden"
                    >
                        <div bind:clientHeight={descriptionlength}>
                            {#if json != undefined}
                                {#each json.content as node}
                                    {#if node.type === "paragraph"}
                                        <p
                                            class="spt-text-[16px] spt-font-semibold"
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
                                <p class="spt-text-[16px] spt-font-semibold">
                                    {content}
                                </p>
                            {/if}
                        </div>
                    </div>
                    <p
                        class="spt-text-[#BDBDBD] spt-text-[13px] spt-overflow-hidden spt-h-[25px] spt-font-bold"
                    >
                        {post_date}
                    </p>
                </div>
                {#if can_show_more_info}
                    <div
                        on:click={() => {
                            if (can_show_more_info) more_info = !more_info;
                        }}
                        class="spt-grow spt-flex spt-flex-row spt-items-end spt-cursor-pointer"
                    >
                        <svg
                            class="spt-grow-0 spt-shrink-0 spt-transition-transform {more_info
                                ? '-spt-rotate-90'
                                : ''}"
                            width="17"
                            height="17"
                            viewBox="0 0 17 18"
                            fill="none"
                        >
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M5 2.52158C5 1.61599 6.10754 1.17677 6.7282 1.83621L12.355 7.81464C12.7174 8.19969 12.7174 8.80031 12.355 9.18536L6.7282 15.1638C6.10754 15.8232 5 15.384 5 14.4784V2.52158Z"
                                fill="white"
                            />
                        </svg>
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div>
