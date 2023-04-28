<svelte:options accessors={true} />

<script>
    import { writable } from "svelte/store";
    import { tweened } from "svelte/motion";
    import { cubicOut } from "svelte/easing";
    import { onMount } from "svelte";
    import Post from "../components/feed/post.svelte";
    import { identity } from "svelte/internal";
    export var page_title = writable("Лента");
    export var save_properties = {};
    document.title = "СП Лента";
    var content;
    var target;
 
    var min_to_slide =100;
    var max_to_slide = 500;
    var slide_smooth = 250;

    var scroll_y = tweened(0);

    onMount(() => {
        target = new Post({ target: content });
    });

    let mousePressed = false;
    let startY = 0;
    let endY = 0;
    let direction = "";
    let distance = 0;
    var prev = undefined;
    function handleMouseDown(event) {
        scroll_y = tweened(0);
        mousePressed = true;
        startY = event.clientY;
        document.body.addEventListener("mouseup", handleMouseUp);
        document.body.classList.add("isdragging");
    }
    var last_distance = -1;
    var last_direction = "";

    async function handleMouseMove(event) {
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
                // if (direction == "down") {
                //     await scroll_y.set(0, { duration: 100 });
                // } else {
                //     await scroll_y.set(
                //         content.scrollHeight - content.offsetHeight,
                //         { duration: 100 }
                //     );
                // }
                if (prev) {
                    prev.$destroy();
                    prev = undefined;
                }
                prev = target;
                prev.test = false;
                if (direction == "down") {
                    target = new Post({
                        target: content,
                        anchor: prev.main,
                        props: { test: true },
                    });
                    scroll_y = tweened(
                        content.scrollHeight - content.offsetHeight
                    );
                } else {
                    target = new Post({
                        target: content,
                        props: { test: true },
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

    function handleMouseUp(event) {
        document.body.removeEventListener("mouseup", handleMouseUp);
        document.body.classList.remove("isdragging");
        const maxScrollTop = content.scrollHeight - content.offsetHeight;
        target.test = false;
        target.main.scrollIntoView({ behavior: "smooth", block: "center" });
        if (direction == "up") {
            if (distance < min_to_slide) {
                scroll_y.set(0, { duration: 500 }).then(() => {
                    if (prev) {
                        target.$destroy();
                        target = prev;
                        prev = undefined;
                    }
                });
            } else {
                scroll_y.set(maxScrollTop, { duration: 500 }).then(() => {
                    if (prev) {
                        prev.$destroy();
                        prev = undefined;
                    }
                });
            }
        } else {
            if (distance < min_to_slide) {
                scroll_y.set(maxScrollTop, { duration: 500 }).then(() => {
                    if (prev) {
                        target.$destroy();
                        target = prev;
                        prev = undefined;
                    }
                });
            } else {
                scroll_y.set(0, { duration: 500 }).then(() => {
                    if (prev) {
                        prev.$destroy();
                        prev = undefined;
                    }
                });
            }
        }

        mousePressed = false;
        direction = "";
        last_direction = "";
        distance = 0;
    }

    $: if (content) content.scrollTop = $scroll_y;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="spt-w-[1208px] spt-flex spt-flex-col">
    <div
        class="spt-w-full spt-grow spt-flex spt-flex-row spt-rounded-[15px] spt-overflow-hidden"
    >
        <div
            on:mousedown={handleMouseDown}
            on:mousemove={handleMouseMove}
            bind:this={content}
            class="spt-flex-grow spt-relative spt-overflow-hidden spt-w-full"
        />
        <div class="spt-w-[359px] spt-bg-[#E6E6E6]" />
    </div>
</div>
