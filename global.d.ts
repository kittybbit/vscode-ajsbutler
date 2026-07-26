import type {
    ViewerHostMessageData,
    ViewerHostMessageType,
    ViewerPostMessagePort,
} from "./src/presentation/webview/viewerHostMessages";

export { };

declare global {
    type ViewerEventCallback = (
        type: ViewerHostMessageType,
        data: ViewerHostMessageData,
    ) => void;

    interface Window {
        vscode: ViewerPostMessagePort;
        EventBridge: {
            callbacks: Partial<Record<ViewerHostMessageType, ViewerEventCallback[]>>;
            addCallback: (
                type: ViewerHostMessageType,
                fn: ViewerEventCallback,
            ) => void;
            removeCallback: (
                type: ViewerHostMessageType,
                fn: ViewerEventCallback,
            ) => void;
            dispatch: (event: MessageEvent) => void;
        };
    };
    const DEVELOPMENT: boolean;
    const CONNECTION_STRING: string;
}
