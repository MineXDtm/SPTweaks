<svelte:options accessors />

<script lang="typescript">
    import browser from "webextension-polyfill";
    import PopularPost from "./popular_post.svelte";
    import { element } from "svelte/internal";
    export var posts = [];
    var width = 434;
    var margin = 15;
    var max_size = width * 5 + margin * 5;
    var limit = max_size - width * 2;
    var all_x = [0, 0, 0, 0, 0];
    var sideslided = "left";
    var selected = 2;

    for (let index = 0; index < all_x.length; index++) {
        const element = all_x[index];
        all_x[index] += (width + margin) * index;
    }
    all_x = [...all_x];
    var isSliding = false;
    function choosen(choosen_index) {
        if (isSliding || choosen_index == selected) return;

        if (all_x[choosen_index] > max_size / 2) {
            sideslided = "right";
            selected += 1;
            if (selected > 4) {
                selected = 0;
            }
            for (let index = 0; index < all_x.length; index++) {
                if (all_x[index] == 0) {
                    all_x[index] = (width + margin) * 4;
                } else {
                    all_x[index] -= width + margin;
                }
            }
        } else {
            sideslided = "left";
            selected -= 1;
            if (selected < 0) {
                selected = 4;
            }
            for (let index = 0; index < all_x.length; index++) {
                if (all_x[index] > limit) {
                    all_x[index] -= (width + margin) * 4;
                } else {
                    all_x[index] += width + margin;
                }
            }
        }

        all_x = [...all_x];
        isSliding = true;
        setTimeout(() => {
            isSliding = false;
        }, 600);
    }
</script>

<div class="spt-w-full">
    <p
        class="spt-text-[32px] spt-font-bold spt-text-white spt-m-2 spt-mb-[18px]"
    >
        Самые Популярные
    </p>
    <div
        class="spt-h-[444px] spt-w-full spt-max-w-full spt-flex spt-grow-0 spt-justify-center spt-items-center spt-overflow-hidden"
    >
        <div
            class="spt-h-full spt-resize spt-inline-flex spt-relative"
            style="width:{max_size + 'px'}; min-width:{max_size + 'px'}; "
        >
            {#if posts.length > 0}
                <PopularPost
                    left={all_x[0]}
                    {limit}
                    {sideslided}
                    onclick={() => {
                        choosen(0);
                    }}
                    selected={selected == 0}
                    image={posts[3].image != undefined? 'https://storage.yandexcloud.net/spworlds/images/posts/'+posts[3].image +'.webp':''}
                    text={posts[3].text}
                    upvotes={posts[3].upvotes}
                    downvotes={posts[3].downvotes}
                    minecraftuuid={posts[3].minecraftUUID}
                />
                <PopularPost
                    left={all_x[1]}
                    {limit}
                    {sideslided}
                    onclick={() => {
                        choosen(1);
                    }}
                    selected={selected == 1}
                    image={posts[4].image != undefined? 'https://storage.yandexcloud.net/spworlds/images/posts/'+posts[4].image +'.webp':''}
                    text={posts[4].text}
                    upvotes={posts[4].upvotes}
                    downvotes={posts[4].downvotes}
                    minecraftuuid={posts[4].minecraftUUID}
                />
                <PopularPost
                    left={all_x[2]}
                    {limit}
                    {sideslided}
                    onclick={() => {
                        choosen(2);
                    }}
                    selected={selected == 2}
                    image={posts[0].image != undefined? 'https://storage.yandexcloud.net/spworlds/images/posts/'+posts[0].image +'.webp':''}
                    text={posts[0].text}
                    upvotes={posts[0].upvotes}
                    downvotes={posts[0].downvotes}
                    minecraftuuid={posts[0].minecraftUUID}
                />
                <PopularPost
                    left={all_x[3]}
                    {limit}
                    {sideslided}
                    onclick={() => {
                        choosen(3);
                    }}
                    selected={selected == 3}
                    image={posts[1].image != undefined? 'https://storage.yandexcloud.net/spworlds/images/posts/'+posts[1].image +'.webp':''}
                    text={posts[1].text}
                    upvotes={posts[1].upvotes}
                    downvotes={posts[1].downvotes}
                    minecraftuuid={posts[1].minecraftUUID}
                />
                <PopularPost
                    left={all_x[4]}
                    {limit}
                    {sideslided}
                    onclick={() => {
                        choosen(4);
                    }}
                    selected={selected == 4}
                    image={posts[2].image != undefined? 'https://storage.yandexcloud.net/spworlds/images/posts/'+posts[2].image +'.webp':''}
                    text={posts[2].text}
                    upvotes={posts[2].upvotes}
                    downvotes={posts[2].downvotes}
                    minecraftuuid={posts[2].minecraftUUID}
                />
            {/if}
        </div>
    </div>
</div>
