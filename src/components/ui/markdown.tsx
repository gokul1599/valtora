import { cn } from "@/lib/utils";

/** Lightweight, safe Markdown renderer for blueprint/AI content. */
function toNodes(md: string): React.ReactNode[] {
  const lines = md.split("\n");
  const nodes: React.ReactNode[] = [];
  let list: string[] | null = null;
  const key = (i: number) => `n${i}`;

  const flushList = (i: number) => {
    if (list) {
      nodes.push(
        <ul key={`ul${i}`} className="my-1.5 space-y-1 pl-5">
          {list.map((item, j) => (
            <li key={j} className="text-[0.875rem] leading-relaxed text-[var(--fg)]">
              {inline(item)}
            </li>
          ))}
        </ul>
      );
      list = null;
    }
  };

  lines.forEach((raw, i) => {
    const line = raw.trim();
    if (!line) {
      flushList(i);
      return;
    }
    if (/^(-|\*)\s+/.test(line)) {
      (list ??= []).push(line.replace(/^(-|\*)\s+/, ""));
      return;
    }
    flushList(i);
    if (/^\s*#{1,3}\s/.test(line)) {
      const level = line.match(/^#+/)![0].length;
      const text = inline(line.replace(/^#+\s+/, ""));
      const cls =
        level === 1
          ? "text-lg font-semibold tracking-tight text-[var(--fg)]"
          : level === 2
            ? "mt-5 text-[0.9375rem] font-semibold tracking-tight text-[var(--fg)]"
            : "mt-3 text-sm font-semibold text-[var(--fg)]";
      nodes.push(
        level === 1 ? (
          <h4 key={key(i)} className={cn(cls, "mt-1")}>{text}</h4>
        ) : level === 2 ? (
          <h4 key={key(i)} className={cls}>{text}</h4>
        ) : (
          <h5 key={key(i)} className={cls}>{text}</h5>
        )
      );
    } else if (/^>\s/.test(line)) {
      nodes.push(
        <blockquote key={key(i)} className="my-2 rounded-r-lg border-l-2 border-[var(--color-brand-500)] bg-[var(--color-brand-500)]/5 px-3 py-2 text-[0.875rem] text-[var(--fg)]">
          {inline(line.replace(/^>\s*/, ""))}
        </blockquote>
      );
    } else {
      nodes.push(
        <p key={key(i)} className="my-1.5 text-[0.875rem] leading-relaxed text-[var(--fg)]">
          {inline(line)}
        </p>
      );
    }
  });
  flushList(lines.length);
  return nodes;
}

function inline(text: string): React.ReactNode {
  const bold = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {bold.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-[var(--fg)]">
              {inlineInline(part.slice(2, -2))}
            </strong>
          );
        }
        return <span key={i}>{inlineInline(part)}</span>;
      })}
    </>
  );
}

function inlineInline(text: string): React.ReactNode {
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("`") && p.endsWith("`") ? (
          <code key={i} className="rounded bg-[var(--surface-2)] px-1 py-0.5 font-mono text-[0.8125rem] text-[var(--color-brand-600)] dark:text-[var(--color-brand-300)]">
            {p.slice(1, -1)}
          </code>
        ) : (
          <span key={i}>{p.replace(/\*([^*]+)\*/g, "$1")}</span>
        )
      )}
    </>
  );
}

export function Markdown({ content, className }: { content: string; className?: string }) {
  return <div className={cn("prose-ui", className)}>{toNodes(content)}</div>;
}