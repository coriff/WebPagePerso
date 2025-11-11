// Année dynamique
    document.getElementById('year').textContent = new Date().getFullYear();

    // News: show more / less
    const news = document.getElementById('news');
    const toggle = document.getElementById('newsToggle');
    const updateToggle = () => {
      const collapsed = news.classList.contains('news-collapsed');
      toggle.textContent = collapsed ? '↓ Voir plus' : '↑ Masquer';
      toggle.setAttribute('aria-expanded', String(!collapsed));
    };
    toggle.addEventListener('click', () => {
      news.classList.toggle('news-collapsed');
      updateToggle();
    });
    updateToggle();

    // Petit helper : liens externes sécurisés
    document.querySelectorAll('a[target="_blank"]').forEach(a => {
      if (!a.rel.includes('noopener')) a.rel += ' noopener';
    });