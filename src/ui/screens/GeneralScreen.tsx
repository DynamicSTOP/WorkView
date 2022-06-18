import React, {useCallback, useContext, useEffect} from 'react'

import type {DataContextParams} from "../../context/DataContext";
import {DataContext} from "../../context/DataContext";
import type {Handler, RequestData} from "../../types";
import {MessageTypes} from "../../types";

const TIME_4_WEEKS = 4 * 7 * 24 * 60 * 60 * 1000;
export const GeneralScreen = () => {
    const {requestData, addListener, removeListener, ready} = useContext<DataContextParams>(DataContext);

    const loadData = useCallback<RequestData>((from: number, to: number) => {
        requestData(from, to);
    }, [requestData]);

    useEffect(() => {
        if (ready) {
            console.log('loading data');
            const NOW = Date.now();
            loadData(NOW - TIME_4_WEEKS, NOW);
        }
    }, [ready, loadData]);

    const updateTable = useCallback<Handler>((message) => {
        console.log('ui message', message);
    }, []);

    useEffect(() => {
        addListener(MessageTypes.EarningsListUpdate, updateTable);
        return () => {
            removeListener(MessageTypes.EarningsListUpdate, updateTable);
        };
    }, [addListener, removeListener, loadData, updateTable])

    return (<div>General Screen</div>);
}