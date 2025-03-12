import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

export default function MermaidChart({ chartCode }) {
  const ref = useRef(null);
  const [hasRendered, setHasRendered] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      console.warn("Skipping Mermaid: Not in browser environment");
      return;
    }

    if (!chartCode) {
      console.warn("Skipping Mermaid: Missing chartCode again");
      return;
    }

    if (!ref.current) {
      console.warn("Skipping Mermaid: Ref is not ready");
      return;
    }

    console.log("✅ Initializing Mermaid...");

    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "loose",
      theme: "default",
    });

    setTimeout(() => {
      if (ref.current) {
        ref.current.innerHTML = `<div class="mermaid">${chartCode}</div>`;
        mermaid.run();
        console.log("✅ Mermaid Diagram Rendered!");
      }
    }, 100);
  }, [chartCode]);

  return <div ref={ref} />;
}
