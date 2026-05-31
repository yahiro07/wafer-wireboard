import ReactMarkdown, { Components } from "react-markdown";
import instruction from "./instruction.md?raw";

const components: Components = {
  a: ({ children, ...props }) => (
    <a
      className="text-sky-300 underline underline-offset-2 hover:text-sky-200"
      target="_blank"
      rel="noreferrer"
      {...props}
    >
      {children}
    </a>
  ),
  h1: ({ children }) => (
    <h1 className="mt-5 mb-3 text-2xl font-bold first:mt-0">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-5 mb-2 text-lg font-bold">{children}</h2>
  ),
  img: ({ alt, ...props }) => (
    <img
      className="my-3 max-w-[240px] rounded border border-white/10 bg-black/20"
      alt={alt ?? ""}
      {...props}
    />
  ),
  p: ({ children }) => (
    <p className="my-2 leading-relaxed text-white/90">{children}</p>
  ),
};

export const UsageContents = () => {
  return <ReactMarkdown components={components}>{instruction}</ReactMarkdown>;
};
