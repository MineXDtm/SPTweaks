<svelte:options accessors={true} />

<script>
    import { writable } from "svelte/store";
    import { tweened } from "svelte/motion";
    import { cubicOut } from "svelte/easing";
    import { getbuffer, setbuffer, http_spworlds } from "/src/stores/main.js";

    import { onMount } from "svelte";
    import Post from "../components/feed/post_content.svelte";
    import { identity } from "svelte/internal";
    import Comment from "../components/feed/comment.svelte";
    export var page_title = writable("Лента");
    export var save_properties = {};
    document.title = "СП Лента";

    var posts = [];

    var currect_index = 0;
    var content;
    var target;

    var min_to_slide = 200;
    var max_to_slide = 400;
    var slide_smooth = 50;
    var anchor_smooth = 250;

    var scroll_y = tweened(0);

    onMount(async () => {
        posts = await $getbuffer("popular_posts");

        currect = new Post({
            target: content,
            props: {
                post: posts[0],
            },
        });
    });

    let mousePressed = false;
    let startY = 0;
    let endY = 0;
    let direction = "";
    let distance = 0;
    var prev = undefined;
    var currect = undefined;
    var last_distance = -1;
    var last_direction = "";
    var cooldown_up = false;
    var cooldown_direction = false;
    var first_down = false;

    function handleMouseDown(event) {
        if (cooldown_up || cooldown_direction || (currect && !currect.candrag))
            return;
        scroll_y = tweened(0);
        mousePressed = true;
        first_down = true;
        startY = event.clientY;
        document.body.addEventListener("mouseup", handleMouseUp);
        document.body.addEventListener("mouseleave", handleMouseUp);
    }
    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function handleMouseMove(event) {
        if (cooldown_up || cooldown_direction) return;
        if (mousePressed) {
            endY = event.clientY;
            if (endY < startY) {
                direction = "up";
                distance = startY - endY;
            } else if (endY > startY) {
                direction = "down";
                distance = endY - startY;
            } else {
                direction = "";
                distance = 0;
            }
            if (distance > max_to_slide) {
                return;
            }

            if (direction != "" && last_direction != direction) {
                document.body.classList.add("isdragging");
                if (first_down == false) {
                    cooldown_direction = true;
                    scroll_y = tweened($scroll_y);
                    if (direction == "down") {
                        scroll_y.set(0, { duration: 70 });
                    } else {
                        scroll_y.set(
                            content.scrollHeight - content.offsetHeight,
                            { duration: 70 }
                        );
                    }
                    await sleep(70);
                    cooldown_direction = false;
                    if (!mousePressed || cooldown_up) return;
                }
                first_down = false;
                if (target) {
                    target.$destroy();
                    target = undefined;
                }

                if (direction == "down") {
                    const currect_post = posts[currect_index - 1];

                    target = new Post({
                        target: content,
                        anchor: currect.main,
                        props: {
                            next: true,
                            post: currect_post,
                        },
                    });
                    scroll_y = tweened(
                        content.scrollHeight - content.offsetHeight
                    );
                } else {
                    const currect_post = posts[currect_index + 1];

                    target = new Post({
                        target: content,
                        props: {
                            next: true,
                            post: currect_post,
                        },
                    });

                    scroll_y = tweened(0);
                }
            }

            const maxScrollTop = content.scrollHeight - content.offsetHeight;
            var next = (maxScrollTop / max_to_slide) * distance;

            last_direction = direction;
            last_distance = distance;

            if (direction == "up") {
                scroll_y.set(next, { duration: slide_smooth });
            } else {
                scroll_y.set(maxScrollTop - next, { duration: slide_smooth });
            }
        }
    }

    async function handleMouseUp() {
        if (cooldown_up || !mousePressed) return;
        mousePressed = false;
        cooldown_direction = false;
        document.body.removeEventListener("mouseup", handleMouseUp);
        document.body.classList.remove("isdragging");
        if (first_down) return;
        cooldown_up = true;
        const maxScrollTop = content.scrollHeight - content.offsetHeight;
        target.next = false;
        target.main.scrollIntoView({ behavior: "smooth", block: "center" });

        if (direction == "up") {
            if (distance < min_to_slide) {
                await scroll_y.set(0, { duration: anchor_smooth }).then(() => {
                    if (target) target.$destroy();
                });
            } else {
                await scroll_y
                    .set(maxScrollTop, { duration: anchor_smooth })
                    .then(() => {
                        if (prev) prev.$destroy();

                        currect_index += 1;
                        if (currect) currect.$destroy();
                        currect = target;
                    });
            }
        } else {
            if (distance < min_to_slide) {
                await scroll_y
                    .set(maxScrollTop, { duration: anchor_smooth })
                    .then(() => {
                        if (target) target.$destroy();
                    });
            } else {
                await scroll_y.set(0, { duration: anchor_smooth }).then(() => {
                    currect_index -= 1;

                    if (prev) prev.$destroy();
                    if (currect) currect.$destroy();
                    currect = target;
                });
            }
        }
        prev = undefined;

        target = undefined;
        direction = "";
        last_direction = "";
        distance = 0;
        cooldown_up = false;
    }

    $: if (content) content.scrollTop = $scroll_y;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="spt-w-[1208px] spt-flex spt-flex-col">
    <div
        class="spt-relative spt-w-full spt-grow spt-flex spt-flex-row spt-rounded-[15px] spt-overflow-hidden"
    >
        <div
            on:mousedown={handleMouseDown}
            on:mousemove={handleMouseMove}
            bind:this={content}
            class="spt-flex-grow spt-relative spt-overflow-hidden spt-w-full"
        />

        <div
            class="spt-w-[460px] spt-h-full spt-bg-[#E6E6E6] spt-border-black spt-border-[1px] spt-rounded-r-[15px] spt-relative"
        >
            <div
                class="spt-bg-black/[0.65] spt-opacity-40 spt-absolute spt-rounded-[15px] spt-h-fit spt-space-x-[15px] spt-pr-[10px] spt-pl-[10px] spt-pt-[15px] spt-pb-[15px] spt-flex spt-items-center -spt-left-10 spt-top-5"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="9"
                    height="15"
                    viewBox="0 0 9 15"
                    fill="none"
                >
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M8.5 13.4784C8.5 14.384 7.39246 14.8232 6.7718 14.1638L1.14505 8.18536C0.782649 7.80031 0.78265 7.19968 1.14505 6.81463L6.7718 0.836213C7.39246 0.176765 8.5 0.615992 8.5 1.52158L8.5 13.4784Z"
                        fill="white"
                    />
                </svg>
            </div>
            <div
                class="spt-h-full spt-w-full spt-flex spt-flex-col spt-space-y-[15px] spt-pr-[10px] spt-pl-[10px] spt-pb-[10px] spt-pt-[10px]"
            >
                <div
                    class="spt-grow spt-overflow-auto spt-relative  spt-space-y-[10px] spt-flex "
                >
                     <div class="spt-absolute spt-h-full spt-space-y-[10px] spt-flex spt-flex-col spt-items-end ">
                        <Comment />
                        <Comment />
                        <Comment />
                        <Comment />
                        <Comment />
                        <Comment />
                        <Comment />
                        <Comment />
                     </div>
                </div>
                <div class="spt-grow-0 spt-shrink-0 spt-h-[130px]">
                    <div
                        
                        class="spt-w-full spt-h-full spt-flex spt-bg-[#EEEEEE] spt-rounded-[5px] spt-overflow-hidden spt-space-y-[15px] spt-pr-[10px] spt-pl-[10px] spt-pb-[10px] spt-pt-[10px] spt-text-black spt-font-semibold"
                    >
                        <div contenteditable class="spt-grow">

                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- <div class="spt-w-[359px] spt-bg-[#E6E6E6]" /> -->
    </div>
</div>
