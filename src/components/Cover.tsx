import { useState } from "react";

type CoverProps = {
  url: string;
  title: string;
};

export function Cover({ url, title }: CoverProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  if (!url || failedUrl === url) {
    return (
      <div className="cover cover-placeholder" aria-hidden="true">
        {title.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      className="cover"
      src={url}
      alt={`Cover for ${title}`}
      onError={() => setFailedUrl(url)}
    />
  );
}
