window.submitComment = function(articleId, event) {
  event.preventDefault();
  const form = event.target;
  const nameInput = form.querySelector('.comment-input-name');
  const textInput = form.querySelector('.comment-input-text');

  const author = nameInput.value.trim() || 'Anonymous';
  const text = textInput.value.trim();

  if (!text) return;

  const encryptedComment = {
    author: encryptText(author),
    text: encryptText(text),
    timestamp: Date.now()
  };

  db.collection("articles").doc(articleId).collection("comments").add(encryptedComment).then(() => {
    nameInput.value = '';
    textInput.value = '';
  }).catch(err => {
    console.error("Error adding comment: ", err);
  });
};

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

    let commentsHtml = '';
    if (entry.comments) {
      entry.comments.forEach(c => {
        commentsHtml += `
          <div class="comment-item">
            <div class="comment-author">${escapeHtml(c.author)}</div>
            <div class="comment-text">${escapeHtml(c.text)}</div>
          </div>
        `;
      });
    }

    article.innerHTML = `
      <div class="entry-header">
        <h1 class="entry-title">${entry.title || 'Untitled'}</h1>
        <button class="entry-share-btn" onclick="copyArticleLink('${(entry.title || '').replace(/'/g, "\\'")}', '${entry.id}', this)">🔗 Share</button>
      </div>
      <div class="entry-meta">${entry.date || ''} • Journal</div>
      <div class="entry-content"><p>${formattedBody}</p></div>

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