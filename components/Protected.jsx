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

    const tocTable = `
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
            .join('')}
        </tbody>
      </table>
    `;
    return tocTable;
  };

  const contentWithToc = generateTableOfContents(content);

  return (
    <div className={mainStyle.containerCenter}>
      <div className={mainStyle.technicalDocs}>
        {/* Insert Table of Contents as a table */}
        <div
          onClick={handleToCClick}
          style={{ cursor: "pointer" }}
          dangerouslySetInnerHTML={{ __html: contentWithToc }}
        />

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
