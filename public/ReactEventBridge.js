/* eslint-disable no-undef */

vscode = acquireVsCodeApi();

EventBridge = {
    callbacks: {}, // {[type: string]: ({type: string, data: unknown} => void)[]}
    dispatch: (event) => {
        const type = event.data.type;
        const functions = window.EventBridge.callbacks[type];
        if (functions) {
            functions.forEach(fn => {
                fn(event.data.type, event.data.data);
            });
        }
    },
    addCallback: (type, fn) => {
        let functions = window.EventBridge.callbacks[type];
        if (!functions) {
            functions = [];
            EventBridge.callbacks[type] = functions;
        }
        functions.push(fn);
    },
    removeCallback: (type, fn) => {
        let functions = window.EventBridge.callbacks[type];
        functions = functions.filter(item => item !== fn);
        EventBridge.callbacks[type] = functions;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('message', event => {
        EventBridge.dispatch(event);
    });
});
