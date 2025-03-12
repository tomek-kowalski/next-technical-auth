import { useEffect, useRef } from "react";
import mermaid from "mermaid";

export default function MermaidChart({ chartCode }) {
  const ref = useRef(null);

  useEffect(() => {
    mermaid.initialize({ startOnLoad: false });

    if (ref.current) {
      mermaid.run(); 
      mermaid.render("mermaidChart", chartCode, (svgCode) => {
        if (ref.current) {
          ref.current.innerHTML = svgCode;
          console.log("✅ Mermaid Diagram Rendered");
        }
      });
    }
  }, [chartCode]);

  return <div ref={ref} className="mermaid" />;
}

