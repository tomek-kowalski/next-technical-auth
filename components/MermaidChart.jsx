import { useEffect, useRef } from "react";
import mermaid from "mermaid";

export default function MermaidChart({ chartCode }) {
  const ref = useRef(null);

  useEffect(() => {
    mermaid.initialize({ startOnLoad: false });
    if (ref.current) {
      mermaid.render("mermaidChart", chartCode, (svgCode) => {
        ref.current.innerHTML = svgCode;
      });
    }
  }, [chartCode]);

  return <div ref={ref} />;
}