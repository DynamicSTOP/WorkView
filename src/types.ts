export interface Message {
    [MessageParams.TYPE]: number
}

export type MessageEarningsList = Message & { [MessageParams.LIST]: RawObject[] };

export interface MessageDBReady {
    [MessageParams.TYPE]: MessageTypes.DBReady
}

export type Messages = MessageEarningsList | MessageDBReady;

export enum MessageTypes {
    EarningsListUpdate,
    DBReady
}

export enum MessageParams {
    TYPE,
    LIST
}

export interface RawObject {
    "Amount": number
    "Contract": string
    "Contract Type": "Hourly" | "Fixed"
    "Date": number
    "Minutes": number
    "Hourly Rate": number

    [param: string]: unknown
}

export type Handler = (message: Messages) => void

export type RequestData = (from: number, to: number) => void
export type ParseRawData = (rawData: unknown) => void

export type AddCallback = (messageType: MessageTypes, handler: Handler) => void
export type RemoveCallback = (messageType: MessageTypes, handler: Handler) => void
