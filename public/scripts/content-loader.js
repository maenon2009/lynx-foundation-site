async function loadArticles() {
    // Find all article containers
    const containers = document.querySelectorAll('[data-articles], [data-article]');
    
    for (const container of containers) {
      // Single article case
      if (container.dataset.article) {
        const article = await loadArticle(container.dataset.article);
        if (article) {
          container.innerHTML = renderArticle(article, container.dataset.headline);
        }
      }
      // Multiple articles case
      else if (container.dataset.articles) {
        const filenames = container.dataset.articles.split(',');
        const category = container.dataset.category;
        const articles = await Promise.all(filenames.map(loadArticle));
        
        container.innerHTML = articles
          .filter(article => !category || article.categories.includes(category))
          .map(article => renderArticle(article))
          .join('');
      }
    }
  }
  
  async function loadArticle(filename) {
    try {
      const response = await fetch(`/articles/${filename.trim()}`);
      if (!response.ok) throw new Error('Not found');
      
      // Parse Markdown front matter
      const text = await response.text();
      const [metadata, ...content] = text.split('---\n');
      const article = JSON.parse(metadata);
      
      return {
        ...article,
        excerpt: content.join('').substring(0, 150) + '...',
        thumbnail: article.thumbnail || '/images/default-thumbnail.jpg'
      };
    } catch (error) {
      console.error(`Failed to load: ${filename}`, error);
      return null;
    }
  }
  
  function renderArticle(article, customTitle = null) {
    return `
      <article class="article-card">
        <img src="${article.thumbnail}" alt="${article.alt || ''}" class="article-thumbnail">
        <div class="article-meta">
          <span class="article-date">${new Date(article.date).toLocaleDateString()}</span>
          ${article.author ? `<span class="article-author">By ${article.author}</span>` : ''}
        </div>
        <h3 class="article-title">${customTitle || article.title}</h3>
        <p class="article-excerpt">${article.excerpt}</p>
        <a href="/article.html?src=${article.filename}" class="read-more">Read More</a>
      </article>
    `;
  }