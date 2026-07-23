import { cn } from "@/lib/utils";

export function SectionTag({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-none border border-[#ff00ff]/40 px-3 py-1 font-mono text-xs tracking-widest text-[#ff00ff] uppercase",
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-none bg-[#ff00ff] animate-pulse" />
      {label}
    </span>
  );
}
