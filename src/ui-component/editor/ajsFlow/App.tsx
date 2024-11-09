import React from 'react';
import { MyAppContextProvider } from '../MyContexts';
import FlowContents from './FlowContents';

export const App = () => {

    console.log('render App.');

    return <MyAppContextProvider>
        <FlowContents />
    </MyAppContextProvider>;
}