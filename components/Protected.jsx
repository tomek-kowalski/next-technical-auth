import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import mainStyle from "../styles/Protected.module.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import MermaidChart from "./MermaidChart";

export default function Protected() {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const contentRef = useRef(null);

  useEffect(() => {
    if (session) {
      fetch("/api/docs")
        .then((res) => res.json())
        .then((data) => setContent(data.content));
    }
  }, [session]);

  if (!session) {
    return (
      <div className={mainStyle.containerCenterStart}>
        <h1>Please Sign In to View Documentation</h1>
      </div>
    );
  }

  const handleToCClick = (e) => {
    e.preventDefault();
    const targetId = e.target.getAttribute("href").substring(1); // Get the ID from href
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      // Scroll to the target element smoothly
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className={mainStyle.containerCenter}>
      <div className={mainStyle.technicalDocs}>
        {/* Static Table of Contents */}
        <div style={{ cursor: "pointer" }}>
          <ul>
            <li><a href="#tuneupfitnesscom---optimization-plan" onClick={handleToCClick}>tuneupfitness.com - Optimization plan</a></li>
            <li>
              <a href="#project-requirements" onClick={handleToCClick}>Project requirements</a>
              <ul>
                <li><a href="#stage-1-documentation--blueprint-creation" onClick={handleToCClick}>Stage 1: Documentation & Blueprint Creation</a></li>
                <li><a href="#stage-2-optimization--improvement-recommendations" onClick={handleToCClick}>Stage 2: Optimization & Improvement Recommendations</a></li>
              </ul>
            </li>
            <li><a href="#provided-documents" onClick={handleToCClick}>Provided Documents</a></li>
            <li>
              <a href="#page-speed-insights-analysis" onClick={handleToCClick}>Page Speed Insights Analysis</a>
              <ul>
                <li><a href="#mobile-performance" onClick={handleToCClick}>Mobile Performance</a></li>
              </ul>
            </li>
            <li>
              <a href="#mockup-woocommerce-process-diagrams" onClick={handleToCClick}>Mockup Woocommerce Process Diagrams</a>
              <ul>
                <li><a href="#woocommerce-and-learn-dash-integration-details" onClick={handleToCClick}>Woocommerce and Learn Dash integration details</a></li>
              </ul>
            </li>
          </ul>
        </div>

        {/* Markdown Content */}
        <div ref={contentRef}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeHighlight]}
            components={{
              code({ className, children, ...props }) {
                if (className && className.includes("language-mermaid")) {
                  return <MermaidChart chartCode={String(children).trim()} />;
                }
                return <code className={className} {...props}>{children}</code>;
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
