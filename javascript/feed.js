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