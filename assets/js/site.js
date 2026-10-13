/* antelligen.com: the bar that settles as the page scrolls, and the film that plays while it is in sight (muted, as a
   browser allows) and with sound when asked. Nothing else runs. */
(() => {
  'use strict';
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const top = document.querySelector('[data-top]');
  const settle = () => top && top.classList.toggle('scrolled', window.scrollY > 8);
  settle();
  window.addEventListener('scroll', settle, { passive: true });

  const video = document.querySelector('[data-video]');
  const sound = document.querySelector('[data-sound]');
  if (video) {
    let asked = false;            // the visitor asked for sound: from then on the film is theirs to stop
    const play = () => { const p = video.play(); if (p && p.catch) p.catch(() => {}); };
    if (!still && 'IntersectionObserver' in window) {
      const watch = new IntersectionObserver(entries => {
        for (const e of entries) {
          if (asked) continue;
          if (e.isIntersecting) play(); else video.pause();
        }
      }, { threshold: 0.35 });
      watch.observe(video);
    }
    if (sound) sound.addEventListener('click', () => {
      asked = true;
      video.muted = false;
      video.loop = false;
      video.controls = true;
      video.currentTime = 0;
      play();
      sound.hidden = true;
    });
  }
})();
