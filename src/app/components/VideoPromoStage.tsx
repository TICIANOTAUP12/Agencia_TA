import { useState, type CSSProperties, type ReactNode } from "react";

type VideoPromoStageProps = {
  id?: string;
  posterSrc?: string;
  videoSrc?: string;
  shade: string;
  minHeight?: string;
  children: ReactNode;
  style?: CSSProperties;
};

export function VideoPromoStage({
  id,
  posterSrc,
  videoSrc,
  shade,
  minHeight = "100vh",
  children,
  style,
}: VideoPromoStageProps) {
  const [useVideo, setUseVideo] = useState(Boolean(videoSrc));
  const hasMedia = Boolean(videoSrc || posterSrc);

  return (
    <section
      id={id}
      className="promo-stage"
      style={{ minHeight, ...style }}
    >
      {hasMedia ? (
        <div className="promo-stage__media" aria-hidden>
          {useVideo && videoSrc ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              poster={posterSrc}
              onError={() => setUseVideo(false)}
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
          ) : posterSrc ? (
            <img src={posterSrc} alt="" />
          ) : null}
        </div>
      ) : null}
      <div className="promo-stage__shade" style={{ background: shade }} />
      <div
        className="promo-stage__copy"
        style={{
          minHeight,
          display: "flex",
          alignItems: "center",
          padding: "96px 20px 48px",
        }}
      >
        {children}
      </div>
    </section>
  );
}
