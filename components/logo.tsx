import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  href?: string | null;
}

export function Logo({ width = 48, height = 48, className = "", href = "/dashboard" }: LogoProps) {
  const content = (
    <div className={`flex items-center justify-center ${className}`}>
      <Image
        src="/logo.png"
        alt="Geele"
        width={width}
        height={height}
        className="object-contain"
        priority
      />
    </div>
  );

  if (href) {
    return (
      <Link href={href}>
        {content}
      </Link>
    );
  }

  return content;
}
