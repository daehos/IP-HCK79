import ReactMarkdown from "react-markdown";
export default function MarkDown({ text }) {
  return (
    <div className="prose prose-sm dark:prose-invert">
      <ReactMarkdown>{text}</ReactMarkdown>
    </div>
  );
}
