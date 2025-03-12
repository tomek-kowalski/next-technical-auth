import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

export default function MermaidChart({ chartCode }) {
  const ref = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !chartCode || !ref.current) {
      console.warn("Skipping Mermaid render: not in browser or missing chartCode/ref");
      return;
    }

    console.log("Rendering Mermaid diagram...");

    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
    });

    try {
      mermaid.render("generatedChart", chartCode, (svgCode) => {
        if (ref.current) {
          ref.current.innerHTML = svgCode;
          console.log("✅ Mermaid Diagram Rendered:", svgCode);
        }
      });
    } catch (error) {
      console.error("❌ Mermaid Render Error:", error);
    }
  }, [isMounted, chartCode]);

  return (
    <div>
      <div ref={ref} className="mermaid">
        {!isMounted ? "Loading..." : <pre>{chartCode}</pre>}
      </div>
    </div>
  );
}
