import { TSEmbed } from './tsEmbed';
import { componentFactory } from './componentFactory';
import { LiveboardViewConfig } from './types';
import WebView from 'react-native-webview';
import { EmbedProps } from './util';
import React from 'react';

class LiveboardEmbedClass<T extends LiveboardViewConfig = LiveboardViewConfig> extends TSEmbed<T> {
    constructor(webViewRef: React.RefObject<WebView>, config?: T) {
        super(webViewRef, config);
    }
}

export interface LiveboardEmbedProps extends LiveboardViewConfig, EmbedProps {}

export const LiveboardEmbed: React.FC<LiveboardEmbedProps> = componentFactory<
    typeof LiveboardEmbedClass,
    LiveboardViewConfig,
    LiveboardEmbedProps
>(LiveboardEmbedClass);