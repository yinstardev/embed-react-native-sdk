import { TSEmbed } from './tsEmbed';
import { componentFactory } from './componentFactory';
import { ViewConfig, LiveboardViewConfig } from './types';
import WebView from 'react-native-webview';
import { EmbedProps } from './util';

class LiveboardEmbedClass<T extends LiveboardViewConfig = LiveboardViewConfig> extends TSEmbed<T> {
    constructor(webViewRef: React.RefObject<WebView>, config?: T) {
        super(webViewRef, config);
    }
}

export interface LiveboardEmbedProps extends LiveboardViewConfig, EmbedProps {}
export const LiveboardEmbed: React.ForwardRefExoticComponent<
    LiveboardEmbedProps & React.RefAttributes<LiveboardEmbedClass<LiveboardViewConfig>>
> = componentFactory<
    typeof LiveboardEmbedClass,
    LiveboardViewConfig,
    LiveboardEmbedProps
>(LiveboardEmbedClass);