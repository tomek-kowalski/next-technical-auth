import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

export default function MermaidChart({ chartCode }) {
  const [isClient, setIsClient] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !chartCode || !ref.current) {
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
  }, [isClient, chartCode]);

  return (
    <div>
      <div ref={ref} className="mermaid">
        {isClient ? <pre>{chartCode}</pre> : "Loading..."}
      </div>
    </div>
  );
}
