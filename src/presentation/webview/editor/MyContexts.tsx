import React, {
  ReactNode,
  SetStateAction,
  createContext,
  startTransition,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  parseViewerResourceState,
  RESOURCE,
  type ViewerResourceStateDto,
} from "../viewerHostMessages";
import { createViewerResourceRequest } from "../viewerRequestMessages";

export type MyAppResource = Partial<
  Omit<ViewerResourceStateDto, "scrollType">
> &
  Pick<ViewerResourceStateDto, "scrollType">;

type MyAppContext = MyAppResource & {
  updateMyAppResource: (newValue: Partial<MyAppResource>) => void;
};
const myAppContext = createContext<MyAppContext>({
  isDarkMode: undefined,
  lang: undefined,
  os: undefined,
  scrollType: "table",
  updateMyAppResource: () => {},
});
export const useMyAppContext = () => useContext(myAppContext);
export const MyAppContextProvider = ({ children }: { children: ReactNode }) => {
  console.log("render MyAppContextProvider.");

  const [myAppResource, setMyAppResourceInternal] = useState<MyAppResource>({
    isDarkMode: undefined,
    lang: undefined,
    os: undefined,
    scrollType: "table",
  });
  const setMyAppResource = (myAppResource: SetStateAction<MyAppResource>) =>
    startTransition(() => setMyAppResourceInternal(myAppResource));

  const resourceCallbackFn: ViewerEventCallback = (_type, data) => {
    const resource = parseViewerResourceState(data);
    if (resource) updateMyAppResource(resource);
  };
  useEffect(() => {
    window.EventBridge.addCallback(RESOURCE, resourceCallbackFn);
    window.vscode.postMessage(
      createViewerResourceRequest(myAppResource.scrollType),
    );
    return () => {
      window.EventBridge.removeCallback(RESOURCE, resourceCallbackFn);
    };
  }, []);

  const updateMyAppResource = (newValue: Partial<MyAppResource>) => {
    setMyAppResource((prev) => {
      return { ...prev, ...newValue };
    });
  };

  return (
    <>
      {myAppResource.isDarkMode !== undefined && (
        <myAppContext.Provider
          value={{ ...myAppResource, updateMyAppResource: updateMyAppResource }}
        >
          {children}
        </myAppContext.Provider>
      )}
    </>
  );
};
