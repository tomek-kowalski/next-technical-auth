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

    const targetText = e.target.innerText;
    const contentDiv = contentRef.current;

    if (contentDiv) {

      const matchingElement = Array.from(contentDiv.querySelectorAll("h1, h2, h3, h4, h5, h6, p"))
        .find(el => el.innerText.trim() === targetText.trim());

      if (matchingElement) {
        matchingElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <div className={mainStyle.containerCenter}>
      <div className={mainStyle.technicalDocs}>
        {/* Table of Contents - Detect Clicks */}
        <div onClick={handleToCClick} style={{ cursor: "pointer" }}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeHighlight]}
          >
            {generateTableOfContents(content)}
          </ReactMarkdown>
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


function generateTableOfContents(markdown) {
  return markdown
    .split("\n")
    .filter(line => line.startsWith("#"))
    .map(line => {
      const level = line.split(" ")[0].length;
      const title = line.replace(/^#+\s*/, "");
      return `${"  ".repeat(level - 1)}- ${title}`;
    })
    .join("\n");
}
