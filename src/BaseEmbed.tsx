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
import { Alert } from "react-native";

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
        console.log("Vercel shell is not loaded yet");
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
        Alert.alert(msg);
        embedBridge.handleMessage(msg);
      } catch (err) {
        console.error("Unable to parse the message from the webview", err);
      }
    };

    return (
      <WebView
        ref={webViewRef}
        source={{ uri: "https://embed-vercel-shell.vercel.app" }}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        allowFileAccessFromFileURLs={true}
        mixedContentMode="always"
        onError= {(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn("error in the webview", nativeEvent);
        }}
        onHttpError= {(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn("HTTP error in the webview", nativeEvent);
        }}
        style={{ flex: 1 }}
      />
    );
  }
);
