import { completion } from "./methods/completion";
import { initialize } from './methods/initialize';

export interface Message {
  jsonrpc: string;
}

export interface NotificationMessage extends Message {
  method: string;
  params?: unknown[] | object;
}


export interface RequestMessage extends NotificationMessage {
  id: number | string;
}

export type RequestMethod = (
  message: RequestMessage,
) => ReturnType<typeof initialize> | ReturnType<typeof completion>;

export type NotificationMethod = (message: NotificationMessage) => void;
