import React from 'react';
import { MyAppContextProvider } from './MyContexts';
import TableContents from './ajsTable/TableContents';

export const App = () => {

    console.log('render App.');

    return <MyAppContextProvider>
        <TableContents />
    </MyAppContextProvider>;
}