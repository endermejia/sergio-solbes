const fs = require('fs');
const tfgs = require('./tfgs.json');

const tfgOnly = tfgs.filter(t => t.tipo === 'TFG' || t.tipo === 'TFM');
const tesisOnly = tfgs.filter(t => t.tipo === 'Tesis').map(t => ({
  titulo: t.titulo.replace('TESIS DOCTORAL. ', ''),
  doctorando: t.alumno || t.titulo.split('.')[1] || '',
  programa: t.titulacion,
  universidad: t.titulacion,
  calificacion: '',
  fecha: t.año
}));

let content = fs.readFileSync('lib/data.ts', 'utf8');

const originalTfg = [
  {
    titulo: 'La reestructuración fiscal ante las necesidades militares del siglo XVIII: el caso de Filipinas',
    alumno: 'Ada Lucía Mariscal González',
    titulacion: 'Grado en Economía',
    tipo: 'TFG',
    año: '2023',
    calificacion: 'Sobresaliente',
    relevante: true
  },
  {
    titulo: 'Canarias: de la internacionalización de los mercados a la integración nacional (finales del siglo XIX)',
    alumno: 'José Curbelo Sánchez',
    titulacion: 'Grado en Historia',
    tipo: 'TFG',
    año: '2022',
    calificacion: 'Sobresaliente',
    relevante: true
  }
];

const originalTesis = [
  {
    titulo: 'Canarias en el sistema defensivo imperial hispano: 1762-1802',
    doctorando: 'Alejandro Lantigua Ojeda',
    programa: 'Doctorado en Territorio y Sociedad: Evolución Histórica de un Espacio Tricontinental',
    universidad: 'Universidad de Las Palmas de Gran Canaria',
    calificacion: 'Sobresaliente Cum Laude',
    fecha: '2023',
    relevante: true
  },
  {
    titulo: 'Dinámicas de la contienda ambiental. Orígenes, evolución e impacto político del movimiento ecologista canario (1969-1992)',
    doctorando: 'Juan Manuel Brito Díaz',
    programa: 'Doctorado en Territorio y Sociedad',
    universidad: 'Universidad de Las Palmas de Gran Canaria',
    calificacion: 'Sobresaliente Cum Laude',
    fecha: '2022',
    relevante: true
  },
  {
    titulo: 'La gestión de los recursos naturales en la Guinea Española (1778-1968)',
    doctorando: 'Amós Farrujia Coello',
    programa: 'Doctorado en Historia',
    universidad: 'Universidad de Las Palmas de Gran Canaria',
    calificacion: 'Sobresaliente Cum Laude',
    fecha: '2013',
    relevante: true
  }
];

const isOriginal = (t) => originalTfg.some(o => o.titulo.includes(t.titulo.substring(0, 15))) || originalTesis.some(o => o.titulo.includes(t.titulo.substring(0, 15)));

const finalTfg = [...originalTfg, ...tfgOnly.filter(t => !isOriginal(t)).map(t => ({...t, relevante: false}))];
const finalTesis = [...originalTesis, ...tesisOnly.filter(t => !isOriginal(t)).map(t => ({...t, relevante: false}))];

const newDireccion = 'export const direccionTrabajos = {\n  tesis: ' + JSON.stringify(finalTesis, null, 4) + ',\n  tfg: ' + JSON.stringify(finalTfg, null, 4) + '\n};';

const oldData = content.substring(content.indexOf('export const direccionTrabajos'), content.indexOf('export const stats'));
content = content.replace(oldData, newDireccion + '\n\n');
fs.writeFileSync('lib/data.ts', content);
console.log('data.ts updated!');
