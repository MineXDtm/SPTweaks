import browser, { cookies } from "webextension-polyfill";
const originalFetch = window.fetch;

window.fetch = function () {
    return originalFetch.apply(this, arguments)
        .then(response => {
            return response.json()
                .then(json => {
                    console.log(json);
                    return Promise.resolve(response);
                });
        });
};

