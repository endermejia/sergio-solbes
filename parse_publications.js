const fs = require('fs');
const d = require('./investigacion.json');
const t = d.filter(x => x.title.trim() === 'Publicaciones cientificas');
const publications = [];
let current = {};
for (const item of t) {
  if (item.subject === '') {
    // This is the main text of the publication
    if (Object.keys(current).length > 0) publications.push(current);
    current = { text: item.text };
  } else if (item.subject === 'Tipo de producción') {
    current.tipo = item.text;
  }
}
if (Object.keys(current).length > 0) publications.push(current);
console.log(publications.length + ' publications found');
fs.writeFileSync('publications_full.json', JSON.stringify(publications, null, 2));
