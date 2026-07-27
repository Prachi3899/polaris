function createSlug(title, id) {
  if (!title || !title.trim()) return id;
  const cleanTitle = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  return cleanTitle || id;
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

window.copyArticleLink = function(title, id, btnElement) {
  const slug = createSlug(title, id);
  const shareUrl = `${window.location.origin}${window.location.pathname}#${slug}`;
  navigator.clipboard.writeText(shareUrl).then(() => {
    if (btnElement) {
      const originalText = btnElement.textContent;
      btnElement.textContent = '✓ Link Copied!';
      setTimeout(() => {
        btnElement.textContent = originalText;
      }, 2000);
    } else {
      alert('Article link copied to clipboard!');
    }
  }).catch(err => {
    console.error('Could not copy text: ', err);
  });
};