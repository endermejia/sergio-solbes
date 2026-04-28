const fs = require('fs');
const d = require('./investigacion.json');
const t = d.filter(x => x.title.trim() === 'Participación y coordinación de proyectos de investigación');
const projects = [];
let current = {};
for (const item of t) {
  if (item.subTitle === 'Nombre del proyecto') {
    if (Object.keys(current).length > 0) projects.push(current);
    current = { titulo: item.text };
  } else if (item.subject === 'Fecha de inicio:') {
    current.inicio = item.text;
  } else if (item.subject === 'Fecha de fin:') {
    current.fin = item.text;
    current.periodo = (current.inicio || '') + ' - ' + (current.fin || '');
  } else if (item.subject === 'Entidad/es financiadora/s:') {
    current.entidadFinanciadora = item.text;
  } else if (item.subject === 'Investigadores principales:') {
    current.investigadorPrincipal = item.text;
  } else if (item.subject === 'Referencia del proyecto:') {
    current.referencia = item.text;
  } else if (item.subject === 'Tipo de participación:') {
    current.participacion = item.text;
  }
}
if (Object.keys(current).length > 0) projects.push(current);
console.log(projects.length + ' projects found');
fs.writeFileSync('projects_full.json', JSON.stringify(projects, null, 2));
