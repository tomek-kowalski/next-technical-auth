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
      console.warn("Skipping Mermaid: Missing chartCode");
      return;
    }

    if (!ref.current) {
      console.warn("Skipping Mermaid: Ref is not ready");
      return;
    }

    console.log("✅ Rendering Mermaid diagram...");

    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
    });

    mermaid.render("generatedChart", chartCode, (svgCode) => {
      if (ref.current) {
        ref.current.innerHTML = svgCode;
        console.log("✅ Mermaid Diagram Rendered:", svgCode);
        setHasRendered(true);
      }
    });
  }, [chartCode]);

  return (
    <div>
      <div ref={ref} className="mermaid">
        {!hasRendered ? "🔄 Loading Diagram..." : null}
      </div>
    </div>
  );
}
