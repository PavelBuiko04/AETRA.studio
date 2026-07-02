export function initCampaignLayout(): void {
  const rows = document.querySelectorAll<HTMLElement>(".campaign-group__grid");
  if (rows.length === 0) return;

  const fit = (): void => {
    const isScroll = window.matchMedia("(max-width: 971px)").matches;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const minHeight = isMobile ? 200 : 220;
    const maxHeight = isMobile ? 300 : Infinity;

    rows.forEach((row) => {
      const cards = row.querySelectorAll<HTMLElement>(".campaign-card");

      cards.forEach((card) => {
        const w = card.dataset.w;
        const h = card.dataset.h;
        if (w && h) {
          card.style.setProperty("--card-w", w);
          card.style.setProperty("--card-h", h);
        }
      });
    });

    if (isScroll) {
      const scrollHeight = isMobile
        ? Math.min(300, Math.max(220, window.innerWidth * 0.52))
        : Math.min(340, Math.max(260, window.innerWidth * 0.36));

      rows.forEach((row) => {
        row.style.setProperty("--row-height", `${scrollHeight}px`);
      });
      return;
    }

    const metrics: { row: HTMLElement; height: number }[] = [];

    rows.forEach((row) => {
      const cards = row.querySelectorAll<HTMLElement>(".campaign-card");
      if (cards.length === 0) return;

      const styles = getComputedStyle(row);
      const gap = parseFloat(styles.columnGap || styles.gap) || 16;
      const available = row.clientWidth;
      let ratioSum = 0;

      cards.forEach((card) => {
        const w = Number(card.dataset.w);
        const h = Number(card.dataset.h);
        if (w > 0 && h > 0) ratioSum += w / h;
      });

      if (ratioSum === 0 || available <= 0) return;

      const gaps = gap * Math.max(0, cards.length - 1);
      const idealHeight = (available - gaps) / ratioSum;
      metrics.push({ row, height: idealHeight });
    });

    const unifiedHeight =
      metrics.length > 0 ? Math.min(...metrics.map((m) => m.height)) : minHeight;
    const height = Math.min(maxHeight, Math.max(minHeight, unifiedHeight));

    metrics.forEach(({ row }) => {
      row.style.setProperty("--row-height", `${height}px`);
    });
  };

  fit();

  const observer = new ResizeObserver(fit);
  rows.forEach((row) => observer.observe(row));

  window.addEventListener("resize", fit, { passive: true });
  window.addEventListener("load", fit, { passive: true });
}
