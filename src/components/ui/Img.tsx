import ExportedImage from "next-image-export-optimizer";
import type { Locale, Photo } from "@/types/content";

type Props = {
  photo: Photo;
  locale: Locale;
  sizes: string;
  priority?: boolean;
  className?: string;
};

export function Img({ photo, locale, sizes, priority, className }: Props) {
  return (
    <ExportedImage
      src={photo.src}
      alt={photo.alt[locale]}
      width={photo.width}
      height={photo.height}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
