import { Webview } from "vscode";

export { };

declare global {
    interface Window {
        vscode: Webview<unknown>;
        EventBridge: {
            callbacks: { [type: string]: ((type: string, data: object) => void)[] };
            addCallback: (type: string, fn: (type: string, data: object) => void) => void;
            removeCallback: (type: string, fn: (type: string, data: object) => void) => void;
            dispatch: (event: MessageEvent) => void;
        };
    };
    const DEVELOPMENT: boolean;
    const CONNECTION_STRING: string;
}

