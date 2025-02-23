import React, { forwardRef } from 'react';
import { WebView } from 'react-native-webview';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { TSEmbed } from './tsEmbed';
import { 
    EmbedEvent,
    ViewConfig,
    MessageCallback,
} from './types';
import { EmbedProps } from './util';

export type EmbedEventHandlers = { [key in keyof typeof EmbedEvent as `on${Capitalize<key>}`]?: MessageCallback };


export interface ViewConfigAndListeners<T extends ViewConfig> {
  viewConfig: T;
  listeners: { [key in EmbedEvent]?: MessageCallback };
}

const getViewPropsAndListeners = <T extends EmbedProps, U extends ViewConfig>(
    props: T
): ViewConfigAndListeners<U> => {
    return Object.keys(props).reduce(
        (accu, key) => {
            if (key.startsWith('on')) {
                const eventName = key.slice(2) as keyof typeof EmbedEvent;
                (accu.listeners as Record<string, MessageCallback>)[EmbedEvent[eventName]] = props[key as keyof T] as MessageCallback;
            } else {
                (accu.viewConfig as Record<string, any>)[key] = props[key as keyof T];
            }
            return accu as ViewConfigAndListeners<U>;
        },
        {
            viewConfig: {} as U,
            listeners: {},
        },
    );
};

export const componentFactory = <T extends typeof TSEmbed, V extends ViewConfig, U extends EmbedProps>(
    EmbedConstructor: T,
) => React.forwardRef<InstanceType<T>, U>((props, forwardedRef): JSX.Element | null => {
    const embedInstance = React.useRef<InstanceType<T> | null>(null);
    const webViewRef = React.useRef<WebView>(null);
    
    if(!embedInstance.current) {
        embedInstance.current = new EmbedConstructor(webViewRef) as InstanceType<T>;
    }

    const renderedWebView = React.useMemo((): JSX.Element | null => {
        return embedInstance.current?.render() ?? null;
    }, [props]);

    const { viewConfig, listeners } = React.useMemo(() => getViewPropsAndListeners<U, V>(props as U), [props]);

    React.useEffect(() => {
        return () => {
            embedInstance.current?.destroy();
            embedInstance.current = null;
        }
    }, [])
    
    useDeepCompareEffect(() => {
        if(forwardedRef && typeof forwardedRef == 'object') {
            (forwardedRef as React.MutableRefObject<InstanceType<T> | null>).current = embedInstance?.current;
        }
        embedInstance?.current?.updateConfig(viewConfig);

        Object.entries(listeners).forEach(([eventName, callback]) => {
            embedInstance.current?.on(eventName as EmbedEvent, callback as MessageCallback);
        });
    }, [viewConfig]);

    if(!embedInstance.current) {
        return null;
    }

    return renderedWebView ?? null;
}); 