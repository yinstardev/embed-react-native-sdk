import { useLiveboardRef } from "./hooks/useLiveboardRef";
import { init } from "./init";
import { LiveboardEmbed, LiveboardEmbedRef } from "./LiveboardEmbed";
import { LiveboardEmbedClassX } from "./LiveboardEmbedClass";
import { AuthType, ViewConfig } from "./types";

export { init, LiveboardEmbed, useLiveboardRef, LiveboardEmbedClassX, AuthType, ViewConfig };
export type { LiveboardEmbedRef };

const EmbedReactNativeSDK = {
  init,
  LiveboardEmbed,
  useLiveboardRef,
};
export default EmbedReactNativeSDK;