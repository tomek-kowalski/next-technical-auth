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
        .then((data) => {
          console.log("Fetched content:", data.content);
          setContent(replaceMarkdownTableOfContents(data.content));
        });
    }
  }, [session]);

  if (!session) {
    return (
      <div className={mainStyle.containerCenterStart}>
        <h1>Please Sign In to View Documentation</h1>
      </div>
    );
  }

  const generateTableOfContents = (markdown) => {
    console.log("Generating Table of Contents for markdown:", markdown);
    const headers = [];
    let currentNumber = [];

    markdown.split("\n").forEach((line) => {
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
            .join("")}
        </tbody>
      </table>
    `;
    console.log("Generated ToC:", tocTable);
    return tocTable;
  };

  const replaceMarkdownTableOfContents = (markdown) => {
    console.log("Raw markdown before replacement:", markdown);
  
    const tocRegex = /\| Table of Contents \|\n\|[-\s]+\|\n([\s\S]+?)\n\| <!-- \/TOC --> \|/;
  
    const match = markdown.match(tocRegex);
  
    if (match) {
      console.log("Markdown Table of Contents found, replacing it...");
      return markdown.replace(tocRegex, generateTableOfContents(markdown));
    }
  
    console.log("No markdown Table of Contents found, returning as is.");
    return markdown;
  };

  return (
    <div className={mainStyle.containerCenter}>
      <div className={mainStyle.technicalDocs}>
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
