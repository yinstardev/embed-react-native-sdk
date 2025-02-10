import React, { forwardRef } from "react";
import { BaseEmbed, TSEmbedRef } from "./BaseEmbed";
import { LiveboardViewConfig, EmbedEvent } from "./types";

type EventHandlers = {
  [K in EmbedEvent as `on${Capitalize<K>}`]?: (event: any) => void;
}

export type LiveboardEmbedRef = TSEmbedRef;

export const LiveboardEmbed = forwardRef<TSEmbedRef, LiveboardViewConfig & EventHandlers>(
  (props, ref) => {
    return (
      <BaseEmbed
        ref={ref}
        embedType="Liveboard"
        {...props}
      />
    );
  }
);
