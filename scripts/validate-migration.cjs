const data = require('../i18n/en.json');
const items = data.projects.items;
let hasEmpty = false;

items.forEach(p => {
  if (p.thumbnail && p.thumbnail.src === '') {
    console.log('Empty thumbnail in', p.id);
    hasEmpty = true;
  }

  if (p.gallery) {
    p.gallery.forEach((g, i) => {
      if (g.sources) {
        g.sources.forEach((s, j) => {
          if (!s.src || s.src.trim() === '') {
            console.log('Empty source in', p.id, 'gallery', i, 'source', j);
            hasEmpty = true;
          }
        });
      }
    });
  }
});

if (!hasEmpty) {
  console.log('✓ No empty src entries found in en.json');
}

// Check pt.json too
const dataPt = require('../i18n/pt.json');
const itemsPt = dataPt.projects.items;
let hasEmptyPt = false;

itemsPt.forEach(p => {
  if (p.thumbnail && p.thumbnail.src === '') {
    console.log('[PT] Empty thumbnail in', p.id);
    hasEmptyPt = true;
  }

  if (p.gallery) {
    p.gallery.forEach((g, i) => {
      if (g.sources) {
        g.sources.forEach((s, j) => {
          if (!s.src || s.src.trim() === '') {
            console.log('[PT] Empty source in', p.id, 'gallery', i, 'source', j);
            hasEmptyPt = true;
          }
        });
      }
    });
  }
});

if (!hasEmptyPt) {
  console.log('✓ No empty src entries found in pt.json');
}
