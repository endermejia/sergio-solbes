const fs = require('fs');

function parseJSON(file) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

const expDocente = parseJSON('./experienciaDocente.json');

// Re-parse everything needed for docencia
const aEntries = expDocente.filter(x => x.title.includes('Docencia en titulaciones universitarias oficiales'));
const asignaturas = [];
let currA = {};
for (const item of aEntries) {
    if (item.subject === 'Nombre de la asignatura/curso') {
        if (Object.keys(currA).length > 0) asignaturas.push(currA);
        currA = { nombre: item.text };
    } else if (item.subject === 'Titulación universitaria') currA.titulacion = item.text;
    else if (item.subject === 'Tipo de asignatura') currA.tipo = item.text;
    else if (item.subject === 'Nº de horas/créditos ECTS') currA.creditos = parseInt(item.text) || item.text;
}
if (Object.keys(currA).length > 0) asignaturas.push(currA);

const iEntries = expDocente.filter(x => x.title.trim() === 'Proyectos de innovación docente');
const innovacion = [];
let currI = {};
for (const item of iEntries) {
    if (item.subject === 'Título del proyecto') {
        if (Object.keys(currI).length > 0) innovacion.push(currI);
        currI = { titulo: item.text };
    } else if (item.subject === 'Tipo de participación') currI.rol = item.text;
    else if (item.subject === 'Entidad financiadora') currI.financiacion = item.text;
}
if (Object.keys(currI).length > 0) innovacion.push(currI);

const fEntries = expDocente.filter(x => x.title.trim() === 'Actividades de formación docente');
const formacion = [];
let currF = {};
for (const item of fEntries) {
    if (item.subject === 'Nombre del evento') {
        if (Object.keys(currF).length > 0) formacion.push(currF);
        currF = { actividad: item.text };
    } else if (item.subject === 'Entidad organizadora') currF.entidad = item.text;
    else if (item.subject === 'Fecha de presentación') currF.año = item.text;
}
if (Object.keys(currF).length > 0) formacion.push(currF);

const docencia = {
  experiencia: {
    añosDocencia: 30,
    instituciones: ["ULPGC", "Universidad de Navarra"],
    niveles: ["Grado", "Posgrado", "Doctorado", "Mayores"]
  },
  asignaturas: asignaturas.map(a => ({...a, relevante: true})), // Reset relevante for now to be safe
  innovacionDocente: innovacion,
  formacionDocente: formacion
};

let content = fs.readFileSync('lib/data.ts', 'utf8');

// Fix gestionAcademica double ];
content = content.replace(/}\r?\n\s*\]\s*\];/, '}];');

// Find start of corrupted area
const corruptedStart = content.indexOf('eformacionDocente');
const corruptedEnd = content.indexOf('export const proyectosInvestigacion');

if (corruptedStart !== -1 && corruptedEnd !== -1) {
    const newDocencia = 'export const docencia = ' + JSON.stringify(docencia, null, 2) + ';\n\n';
    content = content.substring(0, corruptedStart) + newDocencia + content.substring(corruptedEnd);
} else {
    console.log('Could not find corrupted boundaries');
    // Fallback search
    const gestEnd = content.indexOf('export const gestionAcademica') + 50; // skipping header
    const nextExp = content.indexOf('export const proyectosInvestigacion');
    if (nextExp !== -1) {
        const actualGestEnd = content.lastIndexOf('];', nextExp) + 2;
        const newDocencia = '\nexport const docencia = ' + JSON.stringify(docencia, null, 2) + ';\n\n';
        content = content.substring(0, actualGestEnd) + newDocencia + content.substring(nextExp);
    }
}

fs.writeFileSync('lib/data.ts', content);
console.log('Fixed lib/data.ts');
