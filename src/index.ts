import { ConversationEmbed } from "./ConversationEmbed";
import { useLiveboardRef } from "./hooks/useLiveboardRef";
import { init } from "./init";
import { LiveboardEmbed, LiveboardEmbedRef } from "./LiveboardEmbed";
import { Action, AuthType, ViewConfig, HostEvent } from "./types";

export { init, ConversationEmbed, LiveboardEmbed, useLiveboardRef, AuthType, ViewConfig, Action, HostEvent };
export type { LiveboardEmbedRef };

const EmbedReactNativeSDK = {
  init,
  LiveboardEmbed,
  useLiveboardRef,
  ConversationEmbed
};
export default EmbedReactNativeSDK;
