import { EmbedEventHandlers } from "./componentFactory";
import { ViewConfig } from "./types";

export interface EmbedProps extends ViewConfig, EmbedEventHandlers {
    onErrorSDK?: (error: Error, context?: Record<string, any>) => void;
}