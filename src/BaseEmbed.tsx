import React, {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useMemo,
  useState,
  useCallback,
} from "react";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import { EmbedBridge } from "./event-bridge";
import { embedConfigCache } from "./init";
import * as Constants from './constants';
import { MSG_TYPE, DEFAULT_WEBVIEW_CONFIG } from './constants';
import { ERROR_MESSAGE, notifyErrorSDK } from "./utils";
import { ViewConfig, EmbedEventHandlers, EmbedEvent } from "./types";
import useDeepCompareEffect from "use-deep-compare-effect"; 

interface BaseEmbedProps extends ViewConfig, EmbedEventHandlers {
  typeofEmbed: string;
  onErrorSDK?: (error: Error) => void;
  [key: string]: any;
}

export interface TSEmbedRef {
  trigger: (hostEventName: string, payload?: any) => Promise<any>;
}

export const BaseEmbed = forwardRef<TSEmbedRef, BaseEmbedProps>(
  (props, ref) => {
    const webViewRef = useRef<WebView>(null);
    const [embedBridge, setEmbedBridge] = useState<EmbedBridge | null>(null);
    const [vercelShellLoaded, setVercelShellLoaded] = useState(false);
    const [viewConfig, setViewConfig] = useState<Record<string, any>>({});
    const [pendingHandlers, setPendingHandlers] = useState<Array<[string, Function]>>([]);
    const [isWebViewReady, setIsWebViewReady] = useState(false);

    useDeepCompareEffect(() => {
      const newViewConfig: Record<string, any> = {};
      Object.keys(props).forEach((key) => {
        if (key.startsWith("on")) {
          const eventName = key.substring(2);
          const embedEventName = EmbedEvent[eventName as keyof typeof EmbedEvent];
          setPendingHandlers((prev) => [...prev, [embedEventName, props[key]]]);
        } else if (key !== 'embedType') {
          newViewConfig[key] = props[key];
        }
      });
      setViewConfig(newViewConfig);
    }, [props]);

    const sendConfigToShell = useCallback((bridge: EmbedBridge, config: Record<string, any>) => {
      if (!webViewRef.current || !vercelShellLoaded) {
        console.info("Waiting for Vercel shell to load...");
        return;
      }

      const initMsg = {
        type: MSG_TYPE.INIT,
        payload: embedConfigCache,
      };

      bridge.sendMessage(initMsg);

      const message = {
        type: MSG_TYPE.EMBED,
        embedType: props.embedType,
        viewConfig: config,
      };

      bridge.sendMessage(message);
    }, [props.embedType, vercelShellLoaded]);

    useDeepCompareEffect(() => { 
      if (embedBridge && vercelShellLoaded && isWebViewReady) {
        sendConfigToShell(embedBridge, viewConfig);
      }
    }, [viewConfig, embedBridge, vercelShellLoaded, isWebViewReady, sendConfigToShell]);

    useImperativeHandle(ref, () => ({
      trigger: (hostEventName: string, payload?: any) => {
        return embedBridge?.trigger(hostEventName, payload) || Promise.resolve(undefined);
      },
    }));

    const handleInitVercelShell = () => {
      setVercelShellLoaded(true);
      const newEmbedBridge = new EmbedBridge(webViewRef);
      setEmbedBridge(newEmbedBridge);

      pendingHandlers.forEach(([eventName, callback]) => {
        newEmbedBridge.registerEmbedEvent(eventName, callback);
      });
      setPendingHandlers([]);
      sendConfigToShell(newEmbedBridge, viewConfig);
    };

    const handleMessage = (event: WebViewMessageEvent) => {
      try {
        const msg = JSON.parse(event.nativeEvent.data);
        if (msg.type === MSG_TYPE.INIT_VERCEL_SHELL) {
          handleInitVercelShell();
          setIsWebViewReady(true);
        }
        embedBridge?.handleMessage(msg);
      } catch (err) {
        notifyErrorSDK(err as Error, props.onErrorSDK, ERROR_MESSAGE.EVENT_ERROR);
      }
    };

    return (
      <WebView
        ref={webViewRef}
        source={{ uri: Constants.VERCEL_SHELL_URL }}
        onMessage={handleMessage}
        {...DEFAULT_WEBVIEW_CONFIG}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn("[BaseEmbed] WebView error: ", nativeEvent);
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn("[BaseEmbed] HTTP error: ", nativeEvent);
        }}
        style={{ flex: 1 }}
      />
    );
  }
);