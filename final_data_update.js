const fs = require('fs');

function parseJSON(file) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

const expDocente = parseJSON('./experienciaDocente.json');
const investigacion = parseJSON('./investigacion.json');
const presentacion = parseJSON('./presentacion.json');

// --- Cursos ---
const cEntries = presentacion.filter(x => x.title.includes('Cursos y seminarios'));
const courses = [];
let currC = {};
for (const item of cEntries) {
    if (item.subject.includes('Título del curso')) {
        if (Object.keys(currC).length > 0) courses.push(currC);
        currC = { nombre: item.text };
    } else if (item.subject.includes('Entidad organizadora')) currC.entidad = item.text;
    else if (item.subject.includes('Fecha de finalización')) currC.año = item.text.split('/').pop() || item.text;
}
if (Object.keys(currC).length > 0) courses.push(currC);

// --- Otros Meritos Investigacion ---
const mEntries = investigacion.filter(x => x.title.trim() === 'Otros méritos');
const meritosInv = [];
let currM = {};
for (const item of mEntries) {
    if (item.subTitle !== '' && item.subTitle !== 'Períodos de actividad investigadora, docente y de transferencia del conocimiento ') {
        if (Object.keys(currM).length > 0) meritosInv.push(currM);
        currM = { categoria: item.subTitle, titulo: item.text };
    } else if (item.subject.includes('Nombre de la actuación') || item.subject.includes('Nombre del mérito')) {
        if (Object.keys(currM).length > 0) meritosInv.push(currM);
        currM = { categoria: item.subTitle || 'Otros', titulo: item.text };
    } else if (item.subject.includes('Entidad')) currM.entidad = item.text;
    else if (item.subject.includes('Fecha')) currM.fecha = item.text;
}
if (Object.keys(currM).length > 0) meritosInv.push(currM);

// --- Update data.ts ---
let dataTS = fs.readFileSync('lib/data.ts', 'utf8');

if (!dataTS.includes('export const cursosRecibidos')) {
    dataTS += '\nexport const cursosRecibidos = ' + JSON.stringify(courses, null, 2) + ';\n';
}

if (!dataTS.includes('export const meritosInvestigacion')) {
    dataTS += '\nexport const meritosInvestigacion = ' + JSON.stringify(meritosInv, null, 2) + ';\n';
}

// Update gestionAcademica if missing that 6th one
if (!dataTS.includes('Presidente de la Comisión de Garantía de Calidad')) {
    const start = dataTS.indexOf('export const gestionAcademica = [');
    const end = dataTS.indexOf('];', start);
    const newCargo = ',\n  {\n    cargo: "Presidente de la Comisión de Garantía de Calidad",\n    entidad: "Grado en Historia (ULPGC)",\n    periodo: "2010 - 2014"\n  }';
    dataTS = dataTS.substring(0, end) + newCargo + dataTS.substring(end);
}

fs.writeFileSync('lib/data.ts', dataTS);
console.log('Final data update complete!');
