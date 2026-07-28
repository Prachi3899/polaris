let drafts = JSON.parse(localStorage.getItem('dhruv_moleskine_drafts')) || [
<<<<<<< HEAD
        { id: '1', title: '', body: '' }
      ];
      let activeDraftId = drafts[0].id;

      function renderDrafts() {
        if (!draftsContainer) return;
        draftsContainer.innerHTML = '';
        drafts.forEach(d => {
          const chip = document.createElement('div');
          chip.className = `draft-chip ${d.id === activeDraftId ? 'active' : ''}`;
          chip.textContent = d.title.trim() ? d.title.trim() : 'Untitled Page';
          chip.onclick = () => switchDraft(d.id);
          draftsContainer.appendChild(chip);
        });
      }

      function loadActiveDraft() {
        const active = drafts.find(d => d.id === activeDraftId) || drafts[0];
        if (postTitle) postTitle.value = active.title;
        if (postBody) postBody.value = active.body;

        if (!active.body.trim() && postBody) {
          Companion.setPlaceholderAnimated(postBody, Companion.pickFreshPlaceholder());
        }
      }

      function saveDraft() {
        const active = drafts.find(d => d.id === activeDraftId);
        if (active) {
          if (postTitle) active.title = postTitle.value;
          if (postBody) active.body = postBody.value;
          localStorage.setItem('dhruv_moleskine_drafts', JSON.stringify(drafts));
        }

        const hour = new Date().getHours();
        if (deskStatus) {
          if (hour >= 22 || hour < 5) {
            deskStatus.textContent = 'Saved. Now promise you\'ll sleep.';
          } else {
            deskStatus.textContent = 'Auto-Saved';
          }
        }
        renderDrafts();
      }


      window.createNewDraft = function () {
        saveDraft();
        editingArticleId = null;
        const newId = Date.now().toString();

        const prevBody = postBody ? postBody.value.trim() : "";
        if (prevBody.length > 0 && prevBody.length < 80) {
          Companion.whisper("Some days don't need many words.", 3500);
        }

        drafts.unshift({ id: newId, title: '', body: '' });
        activeDraftId = newId;
        loadActiveDraft();
        renderDrafts();
      }

      function switchDraft(id) {
        saveDraft();
        editingArticleId = null;
        activeDraftId = id;
        loadActiveDraft();
        renderDrafts();
      }

      window.deleteCurrentDraft = function () {
        if (confirm("Are you sure you want to delete this draft page?")) {
          drafts = drafts.filter(d => d.id !== activeDraftId);
          if (drafts.length === 0) {
            drafts = [{ id: Date.now().toString(), title: '', body: '' }];
          }
          activeDraftId = drafts[0].id;
          localStorage.setItem('dhruv_moleskine_drafts', JSON.stringify(drafts));
          loadActiveDraft();
          renderDrafts();
        }
      }
=======
  { id: '1', title: '', body: '' }
];
let activeDraftId = drafts[0].id;

function renderDrafts() {
  const draftsContainer = document.getElementById('desk-drafts-container');
  if (!draftsContainer) return;
  draftsContainer.innerHTML = '';
  drafts.forEach(d => {
    const chip = document.createElement('div');
    chip.className = `draft-chip ${d.id === activeDraftId ? 'active' : ''}`;
    chip.textContent = d.title.trim() ? d.title.trim() : 'Untitled Page';
    chip.onclick = () => switchDraft(d.id);
    draftsContainer.appendChild(chip);
  });
}

function loadActiveDraft() {
  const postTitle = document.getElementById('post-title');
  const postBody = document.getElementById('post-body');
  const dateElem = document.getElementById("desk-current-date");

  const active = drafts.find(d => d.id === activeDraftId) || drafts[0];
  if (postTitle) postTitle.value = active.title;
  if (postBody) postBody.value = active.body;

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  if (dateElem) {
    if (!active.title.trim() && !active.body.trim()) {
      dateElem.textContent = `${dateStr} • A page waiting for Dhruv`;
    } else {
      dateElem.textContent = `${dateStr} • Still curious. Still building.`;
    }
  }

  if (!active.body.trim() && postBody) {
    Companion.setPlaceholderAnimated(postBody, Companion.pickFreshPlaceholder());
  }
}

function saveDraft() {
  const postTitle = document.getElementById('post-title');
  const postBody = document.getElementById('post-body');
  const deskStatus = document.getElementById('desk-status');

  const active = drafts.find(d => d.id === activeDraftId);
  if (active) {
    if (postTitle) active.title = postTitle.value;
    if (postBody) active.body = postBody.value;
    localStorage.setItem('dhruv_moleskine_drafts', JSON.stringify(drafts));
  }

  const hour = new Date().getHours();
  if (deskStatus) {
    if (hour >= 22 || hour < 5) {
      deskStatus.textContent = "Saved. Now promise you'll sleep.";
    } else {
      deskStatus.textContent = 'Auto-Saved';
    }
  }
  renderDrafts();
}

window.createNewDraft = function () {
  saveDraft();
  editingArticleId = null;
  const newId = Date.now().toString();

  const postBody = document.getElementById('post-body');
  const prevBody = postBody ? postBody.value.trim() : "";
  if (prevBody.length > 0 && prevBody.length < 80) {
    Companion.whisper("Some days don't need many words.", 3500);
  }

  drafts.unshift({ id: newId, title: '', body: '' });
  activeDraftId = newId;

  const dateElem = document.getElementById("desk-current-date");
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  if (dateElem) dateElem.textContent = `${dateStr} • A page waiting for Dhruv`;

  loadActiveDraft();
  renderDrafts();
};

function switchDraft(id) {
  saveDraft();
  editingArticleId = null;
  activeDraftId = id;
  loadActiveDraft();
  renderDrafts();
}

window.deleteCurrentDraft = function () {
  if (confirm("Are you sure you want to delete this draft page?")) {
    drafts = drafts.filter(d => d.id !== activeDraftId);
    if (drafts.length === 0) {
      drafts = [{ id: Date.now().toString(), title: '', body: '' }];
    }
    activeDraftId = drafts[0].id;
    localStorage.setItem('dhruv_moleskine_drafts', JSON.stringify(drafts));
    loadActiveDraft();
    renderDrafts();
  }
};
>>>>>>> fdd33070c53ed3e95d9949dca616633974a8b562
