"use client";

import Script from "next/script";

declare global {
  interface Window {
    botpress?: any;
    __bp_inited?: boolean;
  }
}

export default function Create() {
  const init = () => {
    if (!window.botpress || window.__bp_inited) return;
    window.__bp_inited = true;

    window.botpress.on("webchat:ready", () => window.botpress.open());
    window.botpress.init({
      botId: "71e1a49f-9636-4d93-bc19-8ce7be038b1a",
      clientId: "264ebecb-924a-4366-9419-a355b9d523cd",
      selector: "#webchat",
      configuration: {
        version: "v2",
        botName: "Blog Bot",
        botDescription:
          "Internal Botpress tool to create SEO optimized blog posts",
        color: "#3276EA",
        themeMode: "light",
        radius: 4,
        feedbackEnabled: false,
        footer: "[⚡ by Botpress](https://botpress.com/?from=webchat)",
      },
    });
  };

  return (
    <>
      {/* Full-viewport container */}
      <div
        className="fixed inset-0 bg-black"
        // if you’re not using Tailwind:
        // style={{ position: "fixed", inset: 0, background: "black" }}
      >
        {/* Botpress mounts the iframe inside this div */}
        <div id="webchat" className="w-full h-full" />
      </div>

      <style jsx global>{`
        /* Make the injected widget fill the container */
        #webchat .bpWebchat {
          position: unset;
          width: 100%;
          height: 100%;
          max-width: 100%;
          max-height: 100%;
        }
        /* Hide the default floating button */
        #webchat .bpFab {
          display: none;
        }

        /* Make the iframe fill and go black & white */
        #webchat iframe {
          width: 100%;
          height: 100%;
          border: 0;
          filter: grayscale(1);
        }
      `}</style>

      <Script
        src="https://cdn.botpress.cloud/webchat/v3.2/inject.js"
        strategy="afterInteractive"
        onLoad={init}
      />
    </>
  );
}
