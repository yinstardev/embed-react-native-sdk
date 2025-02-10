import { useLiveboardRef } from "./hooks/useLiveboardRef";
import { init } from "./init";
import { LiveboardEmbed, LiveboardEmbedRef } from "./LiveboardEmbed";


export { init, LiveboardEmbed, useLiveboardRef };
export type { LiveboardEmbedRef };

const EmbedReactNativeSDK = {
  init,
  LiveboardEmbed,
  useLiveboardRef,
};
export default EmbedReactNativeSDK;