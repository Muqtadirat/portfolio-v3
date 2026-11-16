type ScrollLenis = {
  scroll: number;
  scrollTo: (
    target: number | string | HTMLElement,
    options?: {
      immediate?: boolean;
      offset?: number;
      lock?: boolean;
      force?: boolean;
      programmatic?: boolean;
      onComplete?: () => void;
    },
  ) => void;
};

const SNAP_LOCK_CLASS = 'programmatic-scroll';

const withSnapLock = (
  lenis: ScrollLenis | null | undefined,
  targetY: number,
  onComplete?: () => void,
) => {
  document.documentElement.classList.add(SNAP_LOCK_CLASS);

  const finish = () => {
    document.documentElement.classList.remove(SNAP_LOCK_CLASS);
    onComplete?.();
  };

  if (lenis) {
    lenis.scrollTo(targetY, {
      lock: true,
      force: true,
      programmatic: true,
      onComplete: finish,
    });
  } else {
    window.scrollTo({ top: targetY, behavior: 'smooth' });
    window.setTimeout(finish, 800);
  }
};


export const scrollToContact = (lenis: ScrollLenis | null | undefined) => {
  const el = document.getElementById('contact');
  if (!el) return;

  const current = lenis?.scroll ?? window.scrollY;
  const targetY = Math.max(0, el.getBoundingClientRect().top + current - 24);
  withSnapLock(lenis, targetY);
};

export const scrollToTop = (
  lenis: ScrollLenis | null | undefined,
  onComplete?: () => void,
) => {
  withSnapLock(lenis, 0, onComplete);
};
