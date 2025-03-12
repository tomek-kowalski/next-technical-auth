import { useEffect, useRef } from "react";
import mermaid from "mermaid";

export default function MermaidChart({ chartCode }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!chartCode || !ref.current) return;

    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
    });

    try {
      mermaid.render("generatedChart", chartCode, (svgCode) => {
        if (ref.current) {
          ref.current.innerHTML = svgCode;
          console.log("✅ Mermaid Diagram Rendered");
        }
      });
    } catch (error) {
      console.error("❌ Mermaid Render Error:", error);
    }
  }, [chartCode]);

  return <div ref={ref} className="mermaid" />;
}


