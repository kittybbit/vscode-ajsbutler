import { Backdrop, CircularProgress } from "@mui/material"
import React, { useCallback, useState } from "react"

/**
 * const {setIsLoading, LoadingMask} = useLoadingMask();
 * @returns \{setIsLoading, LoadingMask}
 */
export const useLoadingMask = () => {

    console.log("render LoadingMask.");

    const [isLoading, setIsLoadingInternal] = useState(true);

    const setIsLoading = useCallback((isLoading: boolean) => {
        setIsLoadingInternal(() => isLoading);
    }, []);

    const LoadingMask = () => <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
    >
        <CircularProgress color="inherit" />
    </Backdrop>;

    return {
        setIsLoading,
        LoadingMask
    }
}