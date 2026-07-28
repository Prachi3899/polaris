<<<<<<< HEAD
let publishedEntries = [];

function createSlug(title, id) {
      if (!title || !title.trim()) return id;
      const cleanTitle = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      return cleanTitle || id;
    }
=======
window.publishThought = function () {
  const postTitle = document.getElementById('post-title');
  const postBody = document.getElementById('post-body');

  if (!postBody || !postBody.value.trim()) return;

  const rawTitle = (postTitle && postTitle.value) ? postTitle.value : 'Untitled Thought';
  const rawBody = postBody.value;
  const date = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

  const encryptedTitle = encryptText(rawTitle);
  const encryptedBody = encryptText(rawBody);

  let targetDocId = editingArticleId;

  if (editingArticleId) {
    db.collection("articles").doc(editingArticleId).update({
      title: encryptedTitle,
      body: encryptedBody,
      date
    });
    editingArticleId = null;
  } else {
    const newDocRef = db.collection("articles").doc();
    targetDocId = newDocRef.id;
    newDocRef.set({
      title: encryptedTitle,
      body: encryptedBody,
      date,
      timestamp: Date.now()
    });
  }

  drafts = drafts.filter(d => d.id !== activeDraftId);
  if (drafts.length === 0) {
    drafts = [{ id: Date.now().toString(), title: '', body: '' }];
  }
  activeDraftId = drafts[0].id;
  localStorage.setItem('dhruv_moleskine_drafts', JSON.stringify(drafts));

  const desk = document.getElementById('writer-desk');
  if (desk) desk.classList.add('closing');

  setTimeout(() => {
    window.closeDesk();

    const toast = document.getElementById('publish-toast');
    if (toast) {
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 2000);
    }

    setTimeout(() => {
      let targetEl = null;
      if (targetDocId) {
        targetEl = document.querySelector(`[data-id="${targetDocId}"]`);
      }
      if (!targetEl) {
        targetEl = document.getElementById('journal');
      }
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 300);

  }, 500);
};

function editPublishedEntry(id) {
  const entry = publishedEntries.find(e => e.id === id);
  if (!entry) return;

  editingArticleId = id;
  const postTitle = document.getElementById('post-title');
  const postBody = document.getElementById('post-body');
  if (postTitle) postTitle.value = entry.title || '';
  if (postBody) postBody.value = entry.body || '';

  const dateElem = document.getElementById("desk-current-date");
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  if (dateElem) dateElem.textContent = `${dateStr} • Still curious. Still building.`;

  const deskOverlay = document.getElementById('writer-desk-overlay');
  if (deskOverlay) deskOverlay.scrollTop = 0;
}

function deletePublishedEntry(id) {
  if (confirm("Are you sure you want to delete this published piece permanently?")) {
    db.collection("articles").doc(id).delete();
  }
}

function renderDeskPublishedList() {
  const container = document.getElementById('desk-published-container');
  if (!container) return;
  container.innerHTML = '';

  if (publishedEntries.length === 0) {
    container.innerHTML = '<p style="font-size: 0.85rem; color: var(--muted-text); font-style: italic;">No published thoughts yet.</p>';
    return;
  }

  publishedEntries.forEach((entry) => {
    const item = document.createElement('div');
    item.className = 'desk-published-item';
    item.innerHTML = `
      <div class="desk-item-info">
        <span class="desk-item-title">${entry.title || 'Untitled'}</span>
        <span class="desk-item-date">${entry.date || ''}</span>
      </div>
      <div style="display: flex; gap: 0.4rem;">
        <button class="desk-btn-share" data-id="${entry.id}">🔗 Share</button>
        <button class="desk-btn-edit" data-id="${entry.id}">✏️ Edit</button>
        <button class="desk-btn-delete" data-id="${entry.id}">🗑️ Delete</button>
      </div>
    `;

    item.querySelector('.desk-btn-share').addEventListener('click', (e) => copyArticleLink(entry.title || '', entry.id, e.target));
    item.querySelector('.desk-btn-edit').addEventListener('click', () => editPublishedEntry(entry.id));
    item.querySelector('.desk-btn-delete').addEventListener('click', () => deletePublishedEntry(entry.id));

    container.appendChild(item);
  });
}
>>>>>>> fdd33070c53ed3e95d9949dca616633974a8b562
