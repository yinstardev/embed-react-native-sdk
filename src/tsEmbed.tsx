import WebView, { WebViewMessageEvent } from "react-native-webview";
import { EmbedBridge } from "./event-bridge";
import React from "react";
import { ViewConfig } from "./types";


export class TSEmbed<T extends ViewConfig = ViewConfig> {
    protected webViewRef: React.RefObject<WebView>;
    protected embedBridge: EmbedBridge;
    protected viewConfig: T;
    protected vercelShellLoaded: boolean = false;

    constructor(webViewRef: React.RefObject<WebView>, config?: T) {
        this.webViewRef = webViewRef;
        this.embedBridge = new EmbedBridge(webViewRef);
        this.viewConfig = config || {} as T;
    }

    protected getEmbedType() {
        return this.constructor.name.replace('EmbedClass', '');
    }

    protected updateConfig(config: Partial<T>) {
        this.viewConfig = { ...this.viewConfig, ...config };
        if(this.vercelShellLoaded) {
            this.render();
        }
    }
  
    public render() {
        if(!this.webViewRef.current || !this.vercelShellLoaded) {
            console.log("[TSEmbed] Waiting for Vercel shell to load...");
            return;
        }

        const initMsg = {
            type: "init",
            payload: this.viewConfig,
        };

        this.embedBridge.sendMessage(initMsg);

        const message = {
            type: "EMBED",
            embedType: this.getEmbedType(),
            payload: this.viewConfig,
        };

        this.embedBridge.sendMessage(message);

    }

    public on(eventName: string, callback: Function) {
        this.embedBridge.registerEmbedEvent(eventName, callback);
      }
    
    public trigger(hostEventName: string, payload?: any) {
        return this.embedBridge.trigger(hostEventName, payload);
      }

    public handleMessage(event: WebViewMessageEvent) {
        try {
          const msg = JSON.parse(event.nativeEvent.data);
          if (msg.type === "INIT_VERCEL_SHELL") {
            this.vercelShellLoaded = true;
            this.render();
          }
          this.embedBridge.handleMessage(msg);
        } catch (err) {
          console.error("[TsEmbed] handleMessage parse error:", err);
        }
      }
    
    public destroy() {
        this.embedBridge.destroy();
       
    }

    public getComponent() {
        return (
            <WebView
              ref={this.webViewRef}
              source={{ uri: "https://embed-vercel-shell.vercel.app" }}
              onMessage={this.handleMessage}
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
              keyboardDisplayRequiresUserAction={false}
              automaticallyAdjustContentInsets={false}
              scrollEnabled={false}  
              onHttpError= {(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.warn("HTTP error in the webview", nativeEvent);
              }}
              style={{ flex: 1,
                height: '100%',                    
                width: '100%'  
               }}
            />
          );
    }

}