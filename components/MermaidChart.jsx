import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

export default function MermaidChart({ chartCode }) {
  const [isBrowser, setIsBrowser] = useState(false);
  const ref = useRef(null);


  useEffect(() => {
    setIsBrowser(true);
  }, []);

  useEffect(() => {
    if (!isBrowser || !chartCode || !ref.current) return; 

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
  }, [isBrowser, chartCode]);

  return <div ref={ref} className="mermaid" />;
}



