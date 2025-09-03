"use client";

import { useState } from "react";

/*these must important something that accesses the DOM. Because nextjs renders server 
side before browser / client side, "documemt" is missing from the dom on render and the imports 
cause a document missing error to surface
*/
import dynamic from "next/dynamic";

const Webchat = dynamic(
  () => import("@botpress/webchat").then((m) => m.Webchat),
  { ssr: false }
);
const Fab = dynamic(() => import("@botpress/webchat").then((m) => m.Fab), {
  ssr: false,
});

export const BotpressWidget = () => {
  const [isWebchatOpen, setIsWebchatOpen] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_BOTPRESS_CLIENT_ID!;
  const toggle = () => setIsWebchatOpen((v) => !v);

  return (
    <>
      <Webchat
        clientId={clientId}
        style={{
          width: "400px",
          height: "600px",
          display: isWebchatOpen ? "flex" : "none",
          position: "fixed",
          bottom: "90px",
          right: "20px",
        }}
      />

      <Fab
        onClick={toggle}
        aria-label={isWebchatOpen ? "Close chat" : "Open chat"} //for accessibility
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "64px",
          height: "64px",
        }}
      />
    </>
  );
};
