import { useEffect } from "react";
import mermaid from "mermaid";

export default function MermaidChart({ chartCode }) {
  useEffect(() => {
    mermaid.initialize({ startOnLoad: true });
    mermaid.contentLoaded();
  }, []);

  return <div className="mermaid">{chartCode}</div>;
}