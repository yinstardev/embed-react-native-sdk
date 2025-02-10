import React, {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useMemo,
  useState,
} from "react";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import { EmbedBridge, EmbedMessage } from "./event-bridge";
import { embedConfigCache } from "./init";

interface BaseEmbedProps {
  typeofEmbed: string;
  [key: string]: any;
}

export interface TSEmbedRef {
  trigger: (hostEventName: string, payload?: any) => Promise<any>;
}

export const BaseEmbed = forwardRef<TSEmbedRef, BaseEmbedProps>(
  (props, ref) => {
    const webViewRef = useRef<WebView>(null);
    const embedBridge = useMemo(() => new EmbedBridge(webViewRef), []);
    const [vercelShellLoaded, setVercelShellLoaded] = useState(false);
    const [viewConfig, setViewConfig] = useState<Record<string, any>>({});

    useEffect(() => {
      const newViewConfig: Record<string, any> = {};
      Object.keys(props).forEach((key) => {
        if (key.startsWith("on")) {
          const eventName = key.substring(2);
          embedBridge.registerEmbedEvent(eventName, props[key]);
        } else if (key !== 'embedType') {
          newViewConfig[key] = props[key];
        }
      });
      setViewConfig(newViewConfig);
    }, [props, embedBridge]);

    useEffect(() => {
      if (!webViewRef.current || !vercelShellLoaded) {
        console.log("[BaseEmbed] Waiting for Vercel shell to load...");
        return;
      }

      const initMsg = {
        type: "INIT",
        payload: embedConfigCache, 
      };
      embedBridge.sendMessage(initMsg);

      const message = {
        type: "EMBED",
        embedType: props.embedType,
        viewConfig: viewConfig,
      };
      embedBridge.sendMessage(message);
    }, [viewConfig, embedBridge, props.embedType, vercelShellLoaded]);

    useImperativeHandle(ref, () => ({
      trigger: (hostEventName: string, payload?: any) => {
        return embedBridge.trigger(hostEventName, payload);
      },
    }));

    const handleMessage = (event: WebViewMessageEvent) => {
      try {
        const msg = JSON.parse(event.nativeEvent.data);
        if (msg.type === "INIT_VERCEL_SHELL") {
          setVercelShellLoaded(true);
        }
        embedBridge.handleMessage(msg);
      } catch (err) {
        console.error("[BaseEmbed] handleMessage parse error:", err);
      }
    };

    return (
      <WebView
        ref={webViewRef}
        source={{ uri: "https://journey-withdrawal-such-folders.trycloudflare.com" }}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        allowFileAccessFromFileURLs={true}
        mixedContentMode="always"
        onError= {(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn("[BaseEmbed] WebView error: ", nativeEvent);
        }}
        onHttpError= {(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn("[BaseEmbed] HTTP error: ", nativeEvent);
        }}
        style={{ flex: 1 }}
      />
    );
  }
);
