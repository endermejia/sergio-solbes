const fs = require('fs');

function parseJSON(file) {
    if (!fs.existsSync(file)) return [];
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

const expDocente = parseJSON('./experienciaDocente.json');
const investigacion = parseJSON('./investigacion.json');

const getYear = (str) => {
    if (!str) return 0;
    const s = String(str);
    const match = s.match(/\d{4}/);
    return match ? parseInt(match[0]) : 0;
};

// --- Re-parse Asignaturas with Years ---
const aEntries = expDocente.filter(x => x.title.includes('Docencia en titulaciones universitarias oficiales'));
const asignaturas = [];
let currA = {};
for (const item of aEntries) {
    if (item.subject === 'Nombre de la asignatura/curso') {
        if (Object.keys(currA).length > 0) asignaturas.push(currA);
        currA = { nombre: item.text, creditos: 6 };
    } else if (item.subject === 'Titulación universitaria') currA.titulacion = item.text;
    else if (item.subject === 'Tipo de asignatura') currA.tipo = item.text;
    else if (item.subject === 'Fecha de finalización') currA.año = item.text;
}
if (Object.keys(currA).length > 0) asignaturas.push(currA);
asignaturas.sort((a, b) => getYear(b.año) - getYear(a.año));

// --- Re-parse Congresos with Years ---
const cEntries = investigacion.filter(x => x.title.trim().startsWith('Participación en congresos'));
const congress = [];
let currC = {};
for (const item of cEntries) {
    if (item.subTitle === 'Título del trabajo') {
        if (Object.keys(currC).length > 0) congress.push(currC);
        currC = { trabajo: item.text };
    } else if (item.subject.includes('Nombre del congreso')) currC.congreso = item.text;
    else if (item.subject.includes('Ciudad')) currC.ciudad = item.text;
    else if (item.subject.includes('Fecha')) currC.año = getYear(item.text);
}
if (Object.keys(currC).length > 0) congress.push(currC);
congress.sort((a, b) => (b.año || 0) - (a.año || 0));

// --- Re-parse Estancias with Years ---
const eEntries = investigacion.filter(x => x.title.includes('Estancias en centros de investigación'));
const estancias = [];
let currE = {};
for (const item of eEntries) {
    if (item.subject === 'Entidad de realización') {
        if (Object.keys(currE).length > 0) estancias.push(currE);
        currE = { entidad: item.text };
    } else if (item.subject === 'Facultad, instituto, centro') currE.centro = item.text;
    else if (item.subject === 'Duración') currE.duracion = item.text;
    else if (item.subject.includes('Fecha')) currE.año = getYear(item.text);
}
if (Object.keys(currE).length > 0) estancias.push(currE);
estancias.sort((a, b) => (b.año || 0) - (a.año || 0));

// --- Update data.ts ---
const d = require('./lib/data.ts');

// Sort existing arrays that already have years
d.proyectosInvestigacion.sort((a, b) => getYear(b.periodo) - getYear(a.periodo));
d.direccionTrabajos.tesis.sort((a, b) => getYear(b.fecha) - getYear(a.fecha));
d.direccionTrabajos.tfg.sort((a, b) => getYear(b.año) - getYear(a.año));
d.publicaciones.articulos.sort((a, b) => getYear(b.año) - getYear(a.año));
d.publicaciones.libros.sort((a, b) => getYear(b.año) - getYear(a.año));
d.publicaciones.capitulos.sort((a, b) => getYear(b.año) - getYear(a.año));
d.publicaciones.resenas.sort((a, b) => getYear(b.año) - getYear(a.año));
d.meritosInvestigacion.sort((a, b) => getYear(b.fecha) - getYear(a.fecha));

// Update with new parsed data
d.docencia.asignaturas = asignaturas;
d.participacionCongresos = congress;
d.estanciasInvestigacion = estancias;

// Write back to file
let content = fs.readFileSync('lib/data.ts', 'utf8');

// Helper to replace whole export block
function replaceExport(name, data) {
    const start = content.indexOf('export const ' + name);
    if (start === -1) return;
    let end;
    if (content[start + ('export const ' + name).length + 3] === '{') {
        // Object
        end = content.indexOf('};', start) + 2;
    } else {
        // Array
        end = content.indexOf('];', start) + 2;
    }
    content = content.substring(0, start) + 'export const ' + name + ' = ' + JSON.stringify(data, null, 2) + ';' + content.substring(end);
}

replaceExport('docencia', d.docencia);
replaceExport('proyectosInvestigacion', d.proyectosInvestigacion);
replaceExport('direccionTrabajos', d.direccionTrabajos);
replaceExport('publicaciones', d.publicaciones);
replaceExport('participacionCongresos', d.participacionCongresos);
replaceExport('estanciasInvestigacion', d.estanciasInvestigacion);
replaceExport('meritosInvestigacion', d.meritosInvestigacion);

fs.writeFileSync('lib/data.ts', content);
console.log('Global chronological sort complete!');
