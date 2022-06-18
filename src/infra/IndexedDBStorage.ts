import type {AddCallback, Handler, Message, ParseRawData, RemoveCallback, RequestData} from "../types";
import {MessageParams, MessageTypes} from "../types";

export class IndexedDBStorage {
    private readonly listeners: Record<string, Handler[]>

    private readonly listenersLimit: number

    private db?: IDBDatabase

    constructor(listenersLimit = 15) {
        this.listenersLimit = listenersLimit;
        this.listeners = {}
        this.openDB()
    }

    private readonly openDB = () => {
        const request = indexedDB.open('earnings', 1);
        request.onsuccess = () => {
            this.dbOpened(request);
        };
        request.onupgradeneeded = () => {
            if (!request.result.objectStoreNames.contains('earnings')) {
                request.result.createObjectStore('earnings', {keyPath: 'date'});
            }
            if (!request.result.objectStoreNames.contains('clients')) {
                request.result.createObjectStore('clients', {keyPath: 'client', autoIncrement: true});
            }
            if (!request.result.objectStoreNames.contains('contracts')) {
                request.result.createObjectStore('contracts', {keyPath: 'contracts', autoIncrement: true});
            }
            this.notify({[MessageParams.TYPE]: MessageTypes.DBReady});
        }
    }

    private readonly dbOpened = (request: IDBOpenDBRequest) => {
        this.db = request.result;
        if (this.db.objectStoreNames.contains('earnings')) {
            this.notify({[MessageParams.TYPE]: MessageTypes.DBReady});
        }
    }

    public getData: RequestData = (from, to) => {
        console.log('loading data from db', from, to, this.listenersLimit)
    }

    public parseRawData: ParseRawData = (rawData) => {
        console.log('parsing raw data', rawData, this.listenersLimit)
    }

    private readonly notify = (message: Message): void => {
        if (typeof this.listeners[message[MessageParams.TYPE]] !== 'undefined') {
            this.listeners[message[MessageParams.TYPE]].forEach(listener => {
                try {
                    listener(message);
                } catch (error: unknown) {
                    console.error('listener error', message, listener);
                }
            })
        }
    }

    addListener: AddCallback = (messageType, handler) => {
        if (typeof this.listeners[messageType] === 'undefined') {
            this.listeners[messageType] = [];
        }
        this.listeners[messageType].push(handler);
        if (this.listeners[messageType].length > this.listenersLimit) {
            console.debug('more then 15 listeners for', messageType);
        }
    }

    removeListener: RemoveCallback = (messageType, handler) => {
        if (typeof this.listeners[messageType] === 'undefined') {
            return;
        }
        this.listeners[messageType] = this.listeners[messageType].filter(h => h !== handler);
    }
}