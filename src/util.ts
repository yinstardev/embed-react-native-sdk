import { EmbedEventHandlers } from "./componentFactory";
import { ViewConfig } from "./types";

export type ErrorCallback = (error: Error) => void;

export interface EmbedProps extends ViewConfig, EmbedEventHandlers {
    onErrorSDK?: ErrorCallback; 
}

//TODO : Emit the error message from the Vercel Shell
export const enum ERROR_MESSAGE {
    INIT_ERROR = "Coudln't initialize the component",
    EMBED_ERROR = "Coudln't embed the component",
    AUTH_ERROR = "Authentication failed",
    EVENT_ERROR = "Coudln't attach event handler",
    COMPONENT_UNMOUNTED_ERROR = "Error while unmounting the component",
    CONFIG_ERROR = "Error while updating the config",
}

export const notifyErrorSDK = (error: Error, onErrorSDK?: ErrorCallback, errorMessage?: ERROR_MESSAGE) => {
    onErrorSDK?.(error);
    console.error(error, errorMessage);
    return;
}