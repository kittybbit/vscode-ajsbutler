import React from 'react';
import { MyAppContextProvider } from '../MyContexts';
import TableContents from './TableContents';

export const AjsTableViewerApp = () => {

    console.log('render AjsTableViewerApp.');

    return <MyAppContextProvider>
        <TableContents />
    </MyAppContextProvider>;
}