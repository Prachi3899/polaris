document.addEventListener('keydown', (e) => {
  const deskOverlay = document.getElementById('writer-desk-overlay');
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'e') {
    e.preventDefault();
    if (deskOverlay && deskOverlay.style.display === 'block') {
      window.closeDesk();
    } else {
      window.openDesk();
    }
  }

  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'p') {
    e.preventDefault();
    alert("Dear Dhruv,\n\nI built this place because I wanted to preserve the parts of you that sometimes go unnoticed.\n\nNot only your achievements.\nNot only your goals.\n\nBut your questions. Your silence. Your small thoughts.\n\nThe world will celebrate what you create. I hope you always remember that someone admires who you are while creating it.\n\n— P");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const mobileFooter = document.getElementById('mobile-secret-footer');
  if (mobileFooter) {
    let tapCount = 0;
    let tapTimer;
    mobileFooter.addEventListener('click', () => {
      tapCount++;
      clearTimeout(tapTimer);
      if (tapCount === 3) {
        window.openDesk();
        tapCount = 0;
      } else {
        tapTimer = setTimeout(() => { tapCount = 0; }, 500);
      }
    });
  }
});