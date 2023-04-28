import { writable } from 'svelte/store';

export const getbuffer = writable((buffer_name)=>{});
export const setbuffer = writable((buffer_name,value)=>{});
export const http_spworlds = writable((url)=>{});

export const isdragging = writable(false);

