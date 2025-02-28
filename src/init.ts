import { EmbedConfig } from "./types";
export let embedConfigCache: any = null;
export let authFunctionCache: (() => Promise<string>) | null | undefined = null;

interface EmbedConfigMobile extends Omit<EmbedConfig, 'getTokenFromSDK'> {
  getTokenFromSDK?: boolean;
}

// TODO : add the webview at the time of the init.
export const init = (embedConfig: EmbedConfigMobile) => {
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
