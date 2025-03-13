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
  const [tableInserted, setTableInserted] = useState(false);

  useEffect(() => {
    if (session) {
      fetch("/api/docs")
        .then((res) => res.json())
        .then((data) => setContent(data.content));
    }
  }, [session]);

  useEffect(() => {
    if (!tableInserted && contentRef.current) {
      console.log("🔍 Searching for Markdown-generated ToC in rendered HTML...");

      const markdownTable = contentRef.current.querySelector("table");
      if (markdownTable) {
        console.log("✅ Markdown Table of Contents found, replacing it...");

        const newToC = document.createElement("div");
        newToC.innerHTML = generateTableOfContents(content);
        markdownTable.replaceWith(newToC);
        setTableInserted(true);
      } else {
        console.log("❌ No Markdown Table of Contents found yet.");
      }
    }
  }, [content, tableInserted]);

  if (!session) {
    return (
      <div className={mainStyle.containerCenterStart}>
        <h1>Please Sign In to View Documentation</h1>
      </div>
    );
  }

  const generateTableOfContents = (markdown) => {
    const headers = [];
    let currentNumber = [];

    markdown.split("\n").forEach(line => {
      const match = line.match(/^(#+)\s*(.*)/);
      if (match) {
        const level = match[1].length;
        const title = match[2].trim();

        currentNumber = currentNumber.slice(0, level - 1);
        currentNumber.push(currentNumber.length + 1);

        const tocNumber = currentNumber.join(".");

        headers.push({ level, title, tocNumber });
      }
    });

    return `
      <table>
        <thead>
          <tr><th>Table of Contents</th></tr>
        </thead>
        <tbody>
          ${headers
            .map(
              ({ tocNumber, title }) => `
                <tr>
                  <td>${tocNumber} <a href="#${title.toLowerCase().replace(/\s+/g, '-')}">${title}</a></td>
                </tr>`
            )
            .join("")}
        </tbody>
      </table>
    `;
  };

  return (
    <div className={mainStyle.containerCenter}>
      <div className={mainStyle.technicalDocs}>
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
