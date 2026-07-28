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