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
  const [toc, setToc] = useState([]); // State for Table of Contents
  const contentRef = useRef(null);

  useEffect(() => {
    if (session) {
      fetch("/api/docs")
        .then((res) => res.json())
        .then((data) => {
          setContent(data.content);
          generateToC(data.content); // Generate ToC based on content
        });
    }
  }, [session]);

  // Function to generate ToC based on Markdown content
  const generateToC = (markdownContent) => {
    const regex = /^(#{1,6})\s+(.*)/gm; // Regex to match headers (h1, h2, h3, etc.)
    let match;
    let tocLinks = [];
    
    while ((match = regex.exec(markdownContent)) !== null) {
      const level = match[1].length; // Get the header level (h1 = 1, h2 = 2, etc.)
      const text = match[2]; // Header text
      const anchor = text.toLowerCase().replace(/\s+/g, '-'); // Create anchor ID

      tocLinks.push({
        level,
        text,
        anchor,
      });
    }

    setToc(tocLinks);
  };

  // Handle Table of Contents click
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
                  style={{ marginLeft: item.level * 20 }} // Indent based on header level
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
              h1: ({ node, ...props }) => {
                const text = props.children && typeof props.children[0] === 'string' ? props.children[0] : '';
                return (
                  <h1 id={text.toLowerCase().replace(/\s+/g, '-')}>{props.children}</h1>
                );
              },
              h2: ({ node, ...props }) => {
                const text = props.children && typeof props.children[0] === 'string' ? props.children[0] : '';
                return (
                  <h2 id={text.toLowerCase().replace(/\s+/g, '-')}>{props.children}</h2>
                );
              },
              h3: ({ node, ...props }) => {
                const text = props.children && typeof props.children[0] === 'string' ? props.children[0] : '';
                return (
                  <h3 id={text.toLowerCase().replace(/\s+/g, '-')}>{props.children}</h3>
                );
              },
              // Add more if needed for h4, h5, h6
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
