import type { WebView } from "react-native-webview";
import { authFunctionCache } from "./init";

export interface EmbedMessage {
  type: string; 
  eventName?: string;           
  eventId?: string; 
  payload?: any;
  embedType?: string;

}

export class EmbedBridge {
  private events: Record<string, Function[]> = {};
  private pendingReplies: Record<string, Function> = {};

  constructor(private webViewRef: React.RefObject<WebView>) {}

  registerEmbedEvent(eventName: string, callback: Function) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }

  public trigger(hostEventName: string, payload?: any): Promise<any> {
    if (!this.webViewRef.current) {
      console.warn("webview is not ready for host event");
      return Promise.resolve(undefined);
    }
    return new Promise((resolve) => {
      const eventId = this.generateEventId();
      this.pendingReplies[eventId] = resolve;
      const message = {
        type: "HOST_EVENT",
        eventId,
        eventName: hostEventName,
        payload,
      };
      this.sendMessage(message);
    });
  }

  handleMessage(msg: any) {
    switch (msg.type) {
      case "REQUEST_AUTH_TOKEN": {
          authFunctionCache?.().then((token: string) => {
              const replyTokenData = {
                  type: 'AUTH_TOKEN_RESPONSE',
                  token,
              };
              this.sendMessage(replyTokenData);
          })
          break;
      }
      case "EMBED_EVENT": {
        if(msg?.hasResponder) {
          this.triggerEventWithResponder(msg.eventName, msg.payload, msg.eventId);
        } else {
          this.triggerEvent(msg.eventName, msg.payload);
        }
        break;
      }
      case "HOST_EVENT_REPLY": {
        if (msg.eventId && this.pendingReplies[msg.eventId]) {
          this.pendingReplies[msg.eventId](msg.payload);
          delete this.pendingReplies[msg.eventId];
        }
        break;
      }
      default:
        console.log("Type of the message is unknown from the Shell app", msg.type);
    }
  }

  private triggerEvent(eventName: string, data: any) {
    const handlers = this.events[eventName] || [];
    handlers.forEach(handler => handler(data));
  }

  private triggerEventWithResponder(eventName: string, data: any, eventId: string) {
    const handlers = this.events[eventName] || [];
    handlers.forEach(handler => {
      handler(data, (responseData: any) => {
        this.sendMessage({
          type: 'EVENT_REPLY',
          eventId,
          payload: responseData
        });
      });
    });
  }

  public sendMessage(msg: EmbedMessage) {
    const msgString = JSON.stringify(msg);
    const jsCode = `window.postMessage(${msgString}, "*");true;`;
    this.webViewRef.current?.injectJavaScript(jsCode);
  }

  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
  }
  
  public destroy() {
    this.events = {};
    this.pendingReplies = {};
    this.webViewRef = { current: null };
  }
}
