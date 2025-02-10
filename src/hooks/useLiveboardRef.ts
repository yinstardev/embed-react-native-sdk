import { useRef } from "react";
import { TSEmbedRef } from "src/BaseEmbed";

export const useLiveboardRef = () => {
  const liveboardRef = useRef<TSEmbedRef>(null);
  return liveboardRef;
};
