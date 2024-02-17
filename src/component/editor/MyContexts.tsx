import React, { ReactNode, SetStateAction, createContext, startTransition, useContext, useEffect, useState } from 'react';

/** app resouce */
export type MyAppResource = {
    isDarkMode: boolean | undefined,
    lang: string | undefined,
    os: string | undefined,
    tableType: 'virtual' | 'static',
}

type MyAppContext = MyAppResource & { updateMyAppResource: (newValue: Partial<MyAppResource>) => void }
const MyAppContext = createContext<MyAppContext>({
    isDarkMode: undefined,
    lang: undefined,
    os: undefined,
    tableType: 'virtual',
    updateMyAppResource: () => { },
});
export const useMyAppContext = () => useContext(MyAppContext);
export const MyAppContextProvider = ({ children }: { children: ReactNode }) => {

    console.log('render MyAppContextProvider.');

    const [myAppResource, setMyAppResourceInternal] = useState<MyAppResource>({
        isDarkMode: undefined,
        lang: undefined,
        os: undefined,
        tableType: 'virtual',
    });
    const setMyAppResource = (myAppResource: SetStateAction<MyAppResource>) => startTransition(() => setMyAppResourceInternal(myAppResource));

    const resourceCallbackFn = (type: string, data: Partial<MyAppResource>) => {
        updateMyAppResource(data);
    };
    useEffect(() => {
        window.EventBridge.addCallback('resource', resourceCallbackFn);
        window.vscode.postMessage({ type: 'resource', data: myAppResource });
        return () => {
            window.EventBridge.removeCallback('resource', resourceCallbackFn);
        }
    }, []);

    const updateMyAppResource = (newValue: Partial<MyAppResource>) => {
        setMyAppResource((prev) => { return { ...prev, ...newValue } });
    };

    return <>
        {
            myAppResource.isDarkMode !== undefined && <MyAppContext.Provider value={{ ...myAppResource, updateMyAppResource: updateMyAppResource }}>
                {children}
            </MyAppContext.Provider>
        }
    </>;
}
