import {createContext} from 'react'

import type {AddCallback, ParseRawData, RemoveCallback, RequestData} from "../types";

export interface DataContextParams {
    ready: boolean,
    requestData: RequestData,
    parseRawData: ParseRawData,

    addListener: AddCallback,
    removeListener: RemoveCallback,
}

export const DataContext = createContext<DataContextParams>({
    ready: false,
    requestData(): void {
        throw new Error('undefined listener');
    },
    parseRawData(): void {
        throw new Error('undefined listener');
    },
    addListener(): void {
        throw new Error('undefined method');
    },
    removeListener(): void {
        throw new Error('undefined method');
    }
})