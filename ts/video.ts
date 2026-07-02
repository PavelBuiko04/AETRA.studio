export function initVideos(): void {
  const heroVideo = document.querySelector<HTMLVideoElement>(".hero__video");
  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.playsInline = true;
    heroVideo.play().catch(() => {});
  }

  const videos = document.querySelectorAll<HTMLVideoElement>(
    ".work__media--video, .campaign-card__media--video"
  );

  if (videos.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target as HTMLVideoElement;
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    },
    { threshold: 0.2 }
  );

  videos.forEach((video) => {
    video.muted = true;
    video.playsInline = true;
    observer.observe(video);
  });
}
