import {read} from "fs";
import type {ReactNode} from 'react';
import React, {useCallback, useEffect, useMemo, useState} from 'react'

import type {DataContextParams} from "../context/DataContext";
import {DataContext} from "../context/DataContext";
import {IndexedDBStorage} from "../infra/IndexedDBStorage";
import type {AddCallback, Handler, ParseRawData, RemoveCallback, RequestData} from "../types";
import {MessageTypes} from "../types";

export const DataWrapper = (props: { children: ReactNode }) => {
    const [storage] = useState<IndexedDBStorage>(new IndexedDBStorage());
    const [ready, setReady] = useState(false);
    const addListener = useCallback<AddCallback>((messageType, handler) => {
        storage.addListener(messageType, handler);
    }, [storage]);
    const removeListener = useCallback<RemoveCallback>((messageType, handler) => {
        storage.removeListener(messageType, handler);
    }, [storage]);

    const requestData = useCallback<RequestData>((from: number, to: number) => {
        storage.getData(from, to);
    }, [storage]);

    const parseRawData = useCallback<ParseRawData>((data) => {
        storage.parseRawData(data);
    }, [storage]);

    const readyCallback = useCallback<Handler>(() => {
        setReady(true)
    }, [setReady]);

    useEffect(() => {
        storage.addListener(MessageTypes.DBReady, readyCallback);
        return () => {
            storage.removeListener(MessageTypes.DBReady, readyCallback);
        }
    }, [storage, readyCallback]);

    // ??????
    const value = useMemo<DataContextParams>(() => ({
        ready,
        addListener,
        removeListener,
        requestData,
        parseRawData
    }), [addListener, removeListener, requestData, parseRawData, ready])
    return (
        <DataContext.Provider value={value}>
            {props.children}
        </DataContext.Provider>
    )
}