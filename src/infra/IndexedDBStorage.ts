import type {
    AddCallback,
    Handler,
    Message,
    Messages,
    ParseRawData,
    RawObject,
    RemoveCallback,
    RequestData
} from "../types";
import {MessageParams, MessageTypes} from "../types";
import {aoaToObjects, CSVToArray} from "./ParseCSVString";

const EARNING_STORE = 'earnings';
const DATE_INDEX = 'Date';
const CLIENTS_STORE = 'clients';
const CONTRACTS_STORE = 'stores';

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
            if (!request.result.objectStoreNames.contains(EARNING_STORE)) {
                const earningsStore = request.result.createObjectStore(EARNING_STORE, {keyPath: ['Date', 'Contract']});
                earningsStore.createIndex(DATE_INDEX, DATE_INDEX, {unique: false});
            }
            if (!request.result.objectStoreNames.contains(CLIENTS_STORE)) {
                request.result.createObjectStore(CLIENTS_STORE, {keyPath: 'Client', autoIncrement: true});
            }
            if (!request.result.objectStoreNames.contains(CONTRACTS_STORE)) {
                request.result.createObjectStore(CONTRACTS_STORE, {keyPath: 'Contract', autoIncrement: true});
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
        if (this.db) {
            const {db} = this;
            const transaction = db.transaction(EARNING_STORE, 'readonly');
            const earningsStore: IDBObjectStore = transaction.objectStore(EARNING_STORE);
            console.log(from, to);
            const request = earningsStore.index(DATE_INDEX).getAll(IDBKeyRange.bound(from, to));
            request.addEventListener('success', () => {
                this.notify({
                    [MessageParams.TYPE]: MessageTypes.EarningsListUpdate,
                    [MessageParams.LIST]: request.result
                })
            });
            request.addEventListener('error', () => {
                console.log(request.error);
            });
        }
    }

    public parseRawData: ParseRawData = (rawData) => {
        if (typeof rawData === 'string' && this.db) {
            const {db} = this;
            const aoa = CSVToArray(rawData);
            const data = aoaToObjects(aoa);

            const transaction = db.transaction(EARNING_STORE, 'readonly');
            const earningsStore: IDBObjectStore = transaction.objectStore(EARNING_STORE);
            const request = earningsStore.getAll();

            request.addEventListener('success', () => {
                console.log(request.result);
                console.log('parsing raw data', data);

                const addTransaction = db.transaction(EARNING_STORE, 'readwrite');
                const ESWrite = addTransaction.objectStore(EARNING_STORE);

                data.forEach(earning => {
                    console.log(earning.Date, earning.Contract);
                    ESWrite.add(earning);
                });
                addTransaction.addEventListener('complete', () => {
                    console.log('write complete');
                });
            });
        }
    }

    private readonly notify = (message: Messages): void => {
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