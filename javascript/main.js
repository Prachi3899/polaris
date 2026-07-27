document.addEventListener("DOMContentLoaded", () => {
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