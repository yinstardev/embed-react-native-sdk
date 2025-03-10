import { useLiveboardRef } from "./hooks/useLiveboardRef";
import { init } from "./init";
import { LiveboardEmbed, LiveboardEmbedRef } from "./LiveboardEmbed";
import { Action, AuthType, ViewConfig, HostEvent } from "./types";

export { init, LiveboardEmbed, useLiveboardRef, AuthType, ViewConfig, Action, HostEvent };
export type { LiveboardEmbedRef };

const EmbedReactNativeSDK = {
  init,
  LiveboardEmbed,
  useLiveboardRef,
};
export default EmbedReactNativeSDK;