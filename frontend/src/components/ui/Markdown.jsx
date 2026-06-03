// Block: md — render de markdown con dos tonos: default | on-primary.

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const COMPONENTS = {
  h1: (p) => <h1 className="md__h1" {...p} />,
  h2: (p) => <h2 className="md__h2" {...p} />,
  h3: (p) => <h3 className="md__h3" {...p} />,
  p:  (p) => <p  className="md__p"  {...p} />,
  ul: (p) => <ul className="md__ul" {...p} />,
  ol: (p) => <ol className="md__ol" {...p} />,
  li: (p) => <li className="md__li" {...p} />,
  em: (p) => <em className="md__em" {...p} />,
  strong: (p) => <strong className="md__strong" {...p} />,
  code:   (p) => <code   className="md__code"   {...p} />,
  table:  (p) => <table  className="md__table"  {...p} />,
  th:     (p) => <th     className="md__th"     {...p} />,
  td:     (p) => <td     className="md__td"     {...p} />,
};

export default function Markdown({ children, tone = "default", className = "" }) {
  const toneClass = tone === "onPrimary" ? "md--on-primary" : "md--default";
  return (
    <div className={`md ${toneClass} ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={COMPONENTS}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
