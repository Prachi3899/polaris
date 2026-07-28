document.addEventListener("DOMContentLoaded", () => {
<<<<<<< HEAD

      const deskOverlay = document.getElementById('writer-desk-overlay');
      const postTitle = document.getElementById('post-title');
      const postBody = document.getElementById('post-body');
      const deskStatus = document.getElementById('desk-status');
      const draftsContainer = document.getElementById('desk-drafts-container');
      const mobileFooter = document.getElementById('mobile-secret-footer');

      

      

      db.collection("articles").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
        const loadPromises = snapshot.docs.map(async docSnap => {
          const data = docSnap.data();
          const articleId = docSnap.id;
          
          // Fetch comments for this article in real-time
          let comments = [];
          try {
            const commentsSnap = await db.collection("articles").doc(articleId).collection("comments").orderBy("timestamp", "asc").get();
            comments = commentsSnap.docs.map(cDoc => {
              const cData = cDoc.data();
              return {
                id: cDoc.id,
                author: decryptText(cData.author),
                text: decryptText(cData.text)
              };
            });
          } catch(e) {
            console.error("Error loading comments", e);
          }

          return {
            id: articleId,
            date: data.date,
            timestamp: data.timestamp,
            title: decryptText(data.title),
            body: decryptText(data.body),
            comments: comments
          };
        });

        Promise.all(loadPromises).then(entries => {
          publishedEntries = entries;
          renderFeed();
          checkAndScrollToHash();
        });
      }, (error) => {
        console.error("Firestore snapshot error:", error);
      });

      function renderFeed() {
        const feed = document.getElementById('feed-container');
        if (!feed) return;

        feed.innerHTML = '';

        publishedEntries.forEach((entry) => {
          const article = document.createElement('article');
          article.className = 'entry scroll-fade visible';
          const slug = createSlug(entry.title, entry.id);
          article.id = slug;
          article.setAttribute('data-id', entry.id);

          const formattedBody = entry.body ? entry.body.replace(/\n/g, '</p><p>') : '';

          // Render comments HTML
          let commentsHtml = '';
          entry.comments.forEach(c => {
            commentsHtml += `
              <div class="comment-item">
                <div class="comment-author">${escapeHtml(c.author)}</div>
                <div class="comment-text">${escapeHtml(c.text)}</div>
              </div>
            `;
          });

          article.innerHTML = `
            <div class="entry-header">
              <h1 class="entry-title">${entry.title || 'Untitled'}</h1>
              <button class="entry-share-btn" onclick="copyArticleLink('${(entry.title || '').replace(/'/g, "\\'")}', '${entry.id}', this)">🔗 Share</button>
            </div>
            <div class="entry-meta">${entry.date || ''} • Journal</div>
            <div class="entry-content"><p>${formattedBody}</p></div>

            <!-- ARTICLE COMMENTS SECTION -->
            <div class="article-comments-section">
              <div class="comments-heading">Thoughts & Views</div>
              <div class="comments-list">
                ${commentsHtml || '<p style="font-size: 0.85rem; color: var(--muted-text); font-style: italic;">No thoughts left here yet. Be the first.</p>'}
              </div>
              <form class="comment-form" onsubmit="submitComment('${entry.id}', event)">
                <input type="text" class="comment-input-name" placeholder="Your name..." required />
                <textarea class="comment-input-text" placeholder="Leave a thought..." required></textarea>
                <button type="submit" class="comment-submit-btn">Leave a thought</button>
              </form>
            </div>
          `;
          feed.appendChild(article);
        });

        renderDeskPublishedList();
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

      function editPublishedEntry(id) {
        const entry = publishedEntries.find(e => e.id === id);
        if (!entry) return;

        editingArticleId = id;
        if (postTitle) postTitle.value = entry.title || '';
        if (postBody) postBody.value = entry.body || '';

        if (deskOverlay) deskOverlay.scrollTop = 0;
      }

      function deletePublishedEntry(id) {
        if (confirm("Are you sure you want to delete this published piece permanently?")) {
          db.collection("articles").doc(id).delete();
        }
      }

      

      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('writer') === 'true') {
        window.openDesk();
      }

      

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

      

      

      

      

      

      if (postTitle) postTitle.addEventListener('input', saveDraft);
      if (postBody) postBody.addEventListener('input', saveDraft);

      window.publishThought = function () {
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
      }
    });

    //  spotify integration

    // fetch("../spotify.html")
    // .then(response => response.text())
    // .then(html => {
    //     document.getElementById("spotify-container").innerHTML = html;
    // });
=======
  const deskOverlay = document.getElementById('writer-desk-overlay');
  const postTitle = document.getElementById('post-title');
  const postBody = document.getElementById('post-body');
  const mobileFooter = document.getElementById('mobile-secret-footer');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.scroll-fade').forEach(el => observer.observe(el));

  db.collection("articles").orderBy("timestamp", "desc").onSnapshot(async (snapshot) => {
    const loadPromises = snapshot.docs.map(async docSnap => {
      const data = docSnap.data();
      const articleId = docSnap.id;
      
      let comments = [];
      try {
        const commentsSnap = await db.collection("articles").doc(articleId).collection("comments").orderBy("timestamp", "asc").get();
        comments = commentsSnap.docs.map(cDoc => {
          const cData = cDoc.data();
          return {
            id: cDoc.id,
            author: decryptText(cData.author),
            text: decryptText(cData.text)
          };
        });
      } catch(e) {
        console.error("Error loading comments", e);
      }

      return {
        id: articleId,
        date: data.date,
        timestamp: data.timestamp,
        title: decryptText(data.title),
        body: decryptText(data.body),
        comments: comments
      };
    });

    publishedEntries = await Promise.all(loadPromises);
    renderFeed();
    checkAndScrollToHash();
  }, (error) => {
    console.error("Firestore snapshot error:", error);
  });

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('writer') === 'true') {
    window.openDesk();
  }

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

  if (postTitle) postTitle.addEventListener('input', saveDraft);
  if (postBody) postBody.addEventListener('input', saveDraft);
});document.addEventListener("DOMContentLoaded", () => {
  const deskOverlay = document.getElementById('writer-desk-overlay');
  const postTitle = document.getElementById('post-title');
  const postBody = document.getElementById('post-body');
  const mobileFooter = document.getElementById('mobile-secret-footer');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.scroll-fade').forEach(el => observer.observe(el));

  db.collection("articles").orderBy("timestamp", "desc").onSnapshot(async (snapshot) => {
    const loadPromises = snapshot.docs.map(async docSnap => {
      const data = docSnap.data();
      const articleId = docSnap.id;
      
      let comments = [];
      try {
        const commentsSnap = await db.collection("articles").doc(articleId).collection("comments").orderBy("timestamp", "asc").get();
        comments = commentsSnap.docs.map(cDoc => {
          const cData = cDoc.data();
          return {
            id: cDoc.id,
            author: decryptText(cData.author),
            text: decryptText(cData.text)
          };
        });
      } catch(e) {
        console.error("Error loading comments", e);
      }

      return {
        id: articleId,
        date: data.date,
        timestamp: data.timestamp,
        title: decryptText(data.title),
        body: decryptText(data.body),
        comments: comments
      };
    });

    publishedEntries = await Promise.all(loadPromises);
    renderFeed();
    checkAndScrollToHash();
  }, (error) => {
    console.error("Firestore snapshot error:", error);
  });

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('writer') === 'true') {
    window.openDesk();
  }

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

  if (postTitle) postTitle.addEventListener('input', saveDraft);
  if (postBody) postBody.addEventListener('input', saveDraft);
});
>>>>>>> fdd33070c53ed3e95d9949dca616633974a8b562
