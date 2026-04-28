const fs = require('fs');
const d = require('./investigacion.json');
const t = d.filter(x => x.title.trim().startsWith('Participación en congresos'));
const congress = [];
let current = {};
for (const item of t) {
  if (item.subTitle === 'Título del trabajo') {
    if (Object.keys(current).length > 0) congress.push(current);
    current = { trabajo: item.text };
  } else if (item.subject.includes('Nombre del congreso')) {
    current.congreso = item.text;
  } else if (item.subject.includes('Ciudad de celebración')) {
    current.ciudad = item.text;
  } else if (item.subject.includes('Entidad organizadora')) {
    current.organizador = item.text;
  } else if (item.subject.includes('Fecha')) {
    current.fecha = item.text;
  }
}
if (Object.keys(current).length > 0) congress.push(current);
console.log(congress.length + ' congress found');
fs.writeFileSync('congress_full.json', JSON.stringify(congress, null, 2));
