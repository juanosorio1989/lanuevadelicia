import ExportedImage from "next-image-export-optimizer";
import type { Locale, Photo } from "@/types/content";

type Props = {
  photo: Photo;
  locale: Locale;
  sizes: string;
  priority?: boolean;
  /** Eager and not preloaded (small above-the-fold images such as the logo): fetchPriority="low" stops React 19 auto-preloading it, so it does not compete with the hero LCP image. */
  eager?: boolean;
  className?: string;
};

export function Img({ photo, locale, sizes, priority, eager, className }: Props) {
  return (
    <ExportedImage
      src={photo.src}
      alt={photo.alt[locale]}
      width={photo.width}
      height={photo.height}
      sizes={sizes}
      priority={priority}
      {...(priority ? { fetchPriority: "high" as const } : {})}
      {...(eager && !priority ? { loading: "eager" as const, fetchPriority: "low" as const } : {})}
      className={className}
    />
  );
}
