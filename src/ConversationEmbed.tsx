import React, { forwardRef } from "react";
import { BaseEmbed, TSEmbedRef } from "./BaseEmbed";
import { ConversationViewConfig, EmbedEvent } from "./types";

type EventHandlers = {
  [K in keyof typeof EmbedEvent as `on${Capitalize<string & K>}`]?: (event: any) => void;
};

export type ConversationEmbedRef = TSEmbedRef;

export const ConversationEmbed = forwardRef<TSEmbedRef, ConversationViewConfig & EventHandlers>(
  (props, ref) => {
    return (
      <BaseEmbed
        ref={ref}
        embedType="Conversation"
        {...props}
      />
    );
  }
);
