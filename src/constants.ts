import { WebViewProps } from 'react-native-webview';

export const VERCEL_SHELL_URL = "https://embed-vercel-shell-git-class-based-final-yinstardevs-projects.vercel.app";

export enum MSG_TYPE {
    INIT = "INIT",
    EMBED = "EMBED",
    INIT_VERCEL_SHELL = "INIT_VERCEL_SHELL",
    REQUEST_AUTH_TOKEN = "REQUEST_AUTH_TOKEN",
    EMBED_EVENT = "EMBED_EVENT",
    HOST_EVENT_REPLY = "HOST_EVENT_REPLY",
    EMBED_EVENT_REPLY = "EVENT_REPLY",
    HOST_EVENT = "HOST_EVENT",
    AUTH_TOKEN_RESPONSE = "AUTH_TOKEN_RESPONSE",
}

export const DEFAULT_WEBVIEW_CONFIG: WebViewProps = {
  javaScriptEnabled: true,
  domStorageEnabled: true,
  mixedContentMode: 'always',
  keyboardDisplayRequiresUserAction: false,
  automaticallyAdjustContentInsets: false,
  scrollEnabled: false,
  style: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
};
