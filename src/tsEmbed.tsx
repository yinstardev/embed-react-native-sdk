import { WebView, WebViewMessageEvent } from "react-native-webview";
import { EmbedBridge } from "./event-bridge";
import React from "react";
import { ViewConfig } from "./types";
import { embedConfigCache } from "./init";


export class TSEmbed<T extends ViewConfig = ViewConfig> {
    protected webViewRef: React.RefObject<WebView>;
    protected embedBridge: EmbedBridge | null = null;
    protected viewConfig: T;
    protected vercelShellLoaded: boolean = false;
    private pendingHandlers: Array<[string, Function]> = [];

    constructor(webViewRef: React.RefObject<WebView>, config?: T) {
        this.webViewRef = webViewRef;
        this.viewConfig = config || {} as T;
        this.handleMessage = this.handleMessage.bind(this);
    }

    protected getEmbedType() {
        return this.constructor.name.replace('EmbedClass', '');
    }

    public updateConfig(config: Partial<T>) {
        this.viewConfig = { ...this.viewConfig, ...config };
        if(this.vercelShellLoaded) {
            this.sendConfigToShell();
        }
    }
  
    public sendConfigToShell() {
        if(!this.webViewRef.current || !this.vercelShellLoaded) {
            console.log("[TSEmbed] Waiting for Vercel shell to load...");
            return;
        }

        const initMsg = {
            type: "INIT",
            payload: embedConfigCache,
        };

        this.embedBridge?.sendMessage(initMsg);

        const message = {
            type: "EMBED",
            embedType: this.getEmbedType(),
            viewConfig: this.viewConfig,
        };

        this.embedBridge?.sendMessage(message);

    }

    public on(eventName: string, callback: Function) {
        if (this.embedBridge) {
            this.embedBridge.registerEmbedEvent(eventName, callback);
        } else {
            console.log("[TSEmbed] Queuing event handler:", eventName);
            this.pendingHandlers.push([eventName, callback]);
        }
    }
    
    public trigger(hostEventName: string, payload?: any) {
        return this.embedBridge?.trigger(hostEventName, payload);
      }

    public handleMessage(event: WebViewMessageEvent) {
        try {
            const msg = JSON.parse(event.nativeEvent.data);
            if (msg.type === "INIT_VERCEL_SHELL") {
                this.vercelShellLoaded = true;
                this.embedBridge = new EmbedBridge(this.webViewRef);
                
                // Process pending handlers
                this.pendingHandlers.forEach(([eventName, callback]) => {
                    this.embedBridge?.registerEmbedEvent(eventName, callback);
                });
                this.pendingHandlers = [];
                
                this.sendConfigToShell();
            }
            this.embedBridge?.handleMessage(msg);
        } catch (err) {
            console.error("[TsEmbed] handleMessage parse error:", err);
        }
    }
    
    public destroy() {
        this.embedBridge?.destroy();
       
    }

    public render(): JSX.Element {
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