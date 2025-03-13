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
  const [toc, setToc] = useState([]);
  const contentRef = useRef(null);

  useEffect(() => {
    if (session) {
      fetch("/api/docs")
        .then((res) => res.json())
        .then((data) => {
          setContent(data.content);
          generateToC(data.content);
        });
    }
  }, [session]);

  const generateToC = (markdownContent) => {
    const regex = /^(#{1,6})\s+(.*)/gm;
    let match;
    let tocLinks = [];
    
    while ((match = regex.exec(markdownContent)) !== null) {
      const level = match[1].length;
      const text = match[2];
      const anchor = text.toLowerCase().replace(/\s+/g, '-');

      tocLinks.push({
        level,
        text,
        anchor,
      });
    }

    setToc(tocLinks);
  };

  const handleToCClick = (e) => {
    e.preventDefault();
    const targetText = e.target.innerText.trim();
    const contentDiv = contentRef.current;

    if (contentDiv) {
      const matchingElement = Array.from(contentDiv.querySelectorAll("h1, h2, h3, h4, h5, h6"))
        .find(el => el.innerText.trim() === targetText);

      if (matchingElement) {
        matchingElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  if (!session) {
    return (
      <div className={mainStyle.containerCenterStart}>
        <h1>Please Sign In to View Documentation</h1>
      </div>
    );
  }

  return (
    <div className={mainStyle.containerCenter}>
      <div className={mainStyle.technicalDocs}>

        {/* Table of Contents (dynamically generated) */}
        <div style={{ cursor: "pointer" }}>
          <ul>
            {toc.map((item, index) => (
              <li key={index}>
                <a
                  href={`#${item.anchor}`}
                  onClick={handleToCClick}
                  style={{ marginLeft: item.level * 20 }}
                >
                  {item.text}
                </a>
              </li>
            ))}
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
              h1: ({ node, ...props }) => (
                <h1 id={props.children[0].toLowerCase().replace(/\s+/g, '-')}>{props.children}</h1>
              ),
              h2: ({ node, ...props }) => (
                <h2 id={props.children[0].toLowerCase().replace(/\s+/g, '-')}>{props.children}</h2>
              ),
              h3: ({ node, ...props }) => (
                <h3 id={props.children[0].toLowerCase().replace(/\s+/g, '-')}>{props.children}</h3>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
