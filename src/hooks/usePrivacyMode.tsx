import { useEffect } from "react";

export function usePrivacyMode() {
  useEffect(() => {
    // Prevent screenshots on mobile devices
    const meta = document.createElement("meta");
    meta.name = "prevent-screenshot";
    meta.content = "true";
    document.head.appendChild(meta);

    // Blur content when app goes to background
    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.body.classList.add("privacy-blur");
      } else {
        document.body.classList.remove("privacy-blur");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.head.removeChild(meta);
    };
  }, []);
}
