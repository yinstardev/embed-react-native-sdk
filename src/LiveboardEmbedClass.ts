import { TSEmbed } from './tsEmbed';
import { componentFactory } from './componentFactory';
import { LiveboardViewConfig } from './types';
import WebView from 'react-native-webview';
import { EmbedProps, ErrorCallback } from './util';
import React from 'react';

class LiveboardEmbedClass<T extends LiveboardViewConfig = LiveboardViewConfig> extends TSEmbed<T> {
    constructor(webViewRef: React.RefObject<WebView>, onErrorSDK?: ErrorCallback, config?: T) {
        super(webViewRef, onErrorSDK, config);
    }
}

export interface LiveboardEmbedProps extends LiveboardViewConfig, EmbedProps {}

const LiveboardEmbedComponent = componentFactory<
    typeof LiveboardEmbedClass,
    LiveboardViewConfig,
    LiveboardEmbedProps
>(LiveboardEmbedClass);

export const LiveboardEmbed = React.memo(LiveboardEmbedComponent) as React.NamedExoticComponent<LiveboardEmbedProps & React.RefAttributes<LiveboardEmbedClass<LiveboardViewConfig>>>; 