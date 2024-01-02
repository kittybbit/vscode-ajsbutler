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

type PrivateType = string | number | boolean | symbol | null | undefined;

declare const DEVELOPMENT: boolean;