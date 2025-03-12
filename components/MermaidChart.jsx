import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

export default function MermaidChart({ chartCode }) {
  const [isBrowser, setIsBrowser] = useState(false);
  const ref = useRef(null);

  // Ensure mermaid only runs in the client-side (browser)
  useEffect(() => {
    console.log("Checking if we're in the browser...");
    setIsBrowser(true); // Indicate we are on the client
  }, []);

  useEffect(() => {
    // Log the state of `isBrowser` and `chartCode`
    console.log("isBrowser:", isBrowser);
    console.log("chartCode:", chartCode);
    console.log("ref.current:", ref.current);

    // Avoid Mermaid rendering if we are not on the browser or chartCode is empty
    if (!isBrowser || !chartCode || !ref.current) {
      console.error("Skipping Mermaid render: not in browser or missing chartCode/ref");
      return;
    }

    // Initialize mermaid on the client
    mermaid.initialize({
      startOnLoad: false, // Avoid auto initialization
      theme: "default", // Optional: specify theme for mermaid
    });

    try {
      console.log("Rendering Mermaid diagram...");
      mermaid.render("generatedChart", chartCode, (svgCode) => {
        // If rendering is successful, insert the SVG into the ref element
        if (ref.current) {
          ref.current.innerHTML = svgCode; // Inject rendered SVG
          console.log("✅ Mermaid Diagram Rendered:", svgCode);
        }
      });
    } catch (error) {
      // Log any errors during rendering
      console.error("❌ Mermaid Render Error:", error);
    }
  }, [isBrowser, chartCode]); // Only run when chartCode and isBrowser change

  return (
    <div>
      <div ref={ref} className="mermaid">
        {/* This will show the raw chartCode in case rendering fails */}
        {chartCode && <pre>{chartCode}</pre>}
      </div>
    </div>
  );
}



