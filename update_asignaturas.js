const fs = require('fs');
const asignaturas = require('./asignaturas.json');
let content = fs.readFileSync('lib/data.ts', 'utf8');

const originalAsignaturas = [
  {
    nombre: "Historia Económica",
    titulacion: "Grado en Economía / ADE",
    tipo: "Obligatoria",
    creditos: 6,
    relevante: true
  },
  {
    nombre: "Historia Económica Mundial",
    titulacion: "Grado en Economía",
    tipo: "Básica",
    creditos: 6,
    relevante: true
  },
  {
    nombre: "Historia Económica de España",
    titulacion: "Grado en Economía",
    tipo: "Obligatoria",
    creditos: 6,
    relevante: true
  },
  {
    nombre: "Pensamiento y Acción Económica en el Mundo Moderno",
    titulacion: "Máster en Patrimonio Histórico",
    tipo: "Optativa",
    creditos: 3,
    relevante: true
  },
  {
    nombre: "Historia Moderna Universal",
    titulacion: "Grado en Historia",
    tipo: "Obligatoria",
    creditos: 6,
    relevante: true
  }
];

const isOriginal = (a) => originalAsignaturas.some(o => o.nombre.includes(a.nombre.substring(0, 10)));

const finalAsignaturas = [...originalAsignaturas, ...asignaturas.filter(a => !isOriginal(a)).map(a => ({...a, relevante: false}))];

const docenciaStart = content.indexOf('export const docencia = {');
const asignaturasStart = content.indexOf('asignaturas: [', docenciaStart);
const asignaturasEnd = content.indexOf('],', asignaturasStart) + 1;
const oldAsignaturas = content.substring(asignaturasStart, asignaturasEnd);

const newAsignaturas = 'asignaturas: ' + JSON.stringify(finalAsignaturas, null, 4);

content = content.replace(oldAsignaturas, newAsignaturas);
fs.writeFileSync('lib/data.ts', content);
console.log('data.ts updated with asignaturas!');
