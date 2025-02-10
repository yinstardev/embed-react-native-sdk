import { WebView } from "react-native-webview";
import React, { useRef } from "react";

export let embedConfigCache: any = null;
export let authFunctionCache: (() => Promise<string>) | null = null;

// TODO : add the webview at the time of the init.
export const init = (embedConfig: any) => {
  embedConfigCache = embedConfig;
  authFunctionCache = embedConfig.getAuthToken;
  embedConfigCache.getTokenFromSDK = true;
};

export const getEmbedConfig = () => {
  if (!embedConfigCache) {
    throw new Error('Thoughtspot not initialized');
  }
  return embedConfigCache;
}
