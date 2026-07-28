window.openDesk = function () {
  const deskOverlay = document.getElementById('writer-desk-overlay');
  if (deskOverlay) deskOverlay.style.display = 'block';
  
  const active = drafts.find(d => d.id === activeDraftId);
  const isNew = active && !active.title.trim() && !active.body.trim();

  Companion.open(isNew);
  renderDrafts();
  loadActiveDraft();
  renderDeskPublishedList();
};

window.closeDesk = function () {
  Companion.close();
  const deskOverlay = document.getElementById('writer-desk-overlay');
  if (deskOverlay) deskOverlay.style.display = 'none';
};

function checkAndScrollToHash() {
  if (window.location.hash) {
    const hash = window.location.hash.substring(1);
    let targetEl = document.getElementById(hash) || document.querySelector(`[data-id="${hash}"]`);
    if (targetEl) {
      setTimeout(() => {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }
}