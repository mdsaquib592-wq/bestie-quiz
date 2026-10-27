import React, { useEffect, useRef } from "react";

export default function AdBanner({
  adSlot,
  format = "auto",
  responsive = true,
}) {
  const adRef = useRef(null);

  useEffect(() => {
    try {
      // Check if adsbygoogle is loaded and element has not been populated yet
      if (
        window.adsbygoogle &&
        adRef.current &&
        !adRef.current.dataset.adLoaded
      ) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        adRef.current.dataset.adLoaded = "true";
      }
    } catch (err) {
      console.error("AdSense load error:", err);
    }
  }, []);

  return (
    <div className="w-full max-w-md my-4 flex flex-col items-center justify-center overflow-hidden">
      <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">
        Sponsored
      </span>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block", width: "100%" }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // <-- YOUR PUB ID
        data-ad-slot={adSlot} // <-- YOUR AD UNIT SLOT ID
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}
