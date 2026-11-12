/** Dev-only stand-in for a photo that has not arrived yet. Renders nothing in a production build. */
export function PhotoPlaceholder({ label, className = "" }: { label: string; className?: string }) {
  if (process.env.NODE_ENV === "production") return null;
  return (
    <div
      data-placeholder
      className={`flex min-h-60 items-center justify-center rounded-card border-2 border-dashed border-sand-100 bg-sand-100/50 p-4 text-center text-sm text-muted-600 ${className}`.trim()}
    >
      {label}
    </div>
  );
}
