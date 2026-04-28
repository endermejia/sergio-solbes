const fs = require('fs');

function parseInnovacion() {
  const d = require('./experienciaDocente.json');
  const t = d.filter(x => x.title.trim() === 'Proyectos de innovación docente');
  const items = [];
  let current = {};
  for (const item of t) {
    if (item.subject === 'Título del proyecto') {
      if (Object.keys(current).length > 0) items.push(current);
      current = { titulo: item.text };
    } else if (item.subject === 'Tipo de participación') {
      current.rol = item.text;
    } else if (item.subject === 'Entidad financiadora') {
      current.financiacion = item.text;
    }
  }
  if (Object.keys(current).length > 0) items.push(current);
  return items;
}

function parseFormacion() {
  const d = require('./experienciaDocente.json');
  const t = d.filter(x => x.title.trim() === 'Actividades de formación docente');
  const items = [];
  let current = {};
  for (const item of t) {
    if (item.subject === 'Tipo de actividad') {
      if (Object.keys(current).length > 0) items.push(current);
      current = { actividad: item.text };
    } else if (item.subject === 'Entidad organizadora') {
      current.entidad = item.text;
    } else if (item.subject === 'Horas') {
      current.horas = item.text;
    } else if (item.subject === 'Fecha de finalización') {
      current.año = item.text.split('/').pop() || item.text;
    } else if (item.subject === 'Denominación de la actividad') {
      current.actividad = item.text; // Better name
    }
  }
  if (Object.keys(current).length > 0) items.push(current);
  return items;
}

const innovacion = parseInnovacion();
const formacion = parseFormacion();

fs.writeFileSync('innovacion_formacion.json', JSON.stringify({ innovacion, formacion }, null, 2));
console.log('Parsed ' + innovacion.length + ' innovacion and ' + formacion.length + ' formacion');
