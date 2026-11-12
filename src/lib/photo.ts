import { photos } from "@/data/photos";
import type { Photo, PhotoId } from "@/types/content";

/** Looks up one photo by id. Server-side only: never import this from a client component (it pulls the whole manifest). */
export function getPhoto(id: PhotoId): Photo {
  const photo = photos.find((p) => p.id === id);
  if (!photo) throw new Error(`Unknown photo id: ${id}`);
  return photo;
}
