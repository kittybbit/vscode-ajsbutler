interface Window {
    EventBridge: {
        callbacks: { [type: string]: ((type: string, data: object) => void)[] };
        addCallback: (type: string, fn: (type: string, data: object) => void) => void;
        removeCallback: (type: string, fn: (type: string, data: object) => void) => void;
        dispatch: (event: MessageEvent) => void;
    };
    vscode: {
        postMessage: (transfer: unknown) => void
    };
}

declare const DEVELOPMENT: boolean;