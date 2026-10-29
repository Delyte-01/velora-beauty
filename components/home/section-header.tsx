import Link from "next/link";
import { textLink } from "@/components/home/styles";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
}

export function SectionHeader({
  title,
  subtitle,
  href,
  linkLabel = "View all",
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-xl">
        <h2 className="font-heading text-4xl font-medium leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-5 text-base leading-[1.8] text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
      {href && (
        <Link href={href} className={textLink}>
          {linkLabel}
          <span
            aria-hidden="true"
            className="block h-px w-10 bg-accent transition-all duration-500 ease-out group-hover/link:w-16 motion-reduce:transition-none"
          />
        </Link>
      )}
    </div>
  );
}
