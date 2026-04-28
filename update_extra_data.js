const fs = require('fs');

function parseJSON(file) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

const investigacion = parseJSON('./investigacion.json');

// --- Congress ---
const cEntries = investigacion.filter(x => x.title.trim().startsWith('Participación en congresos'));
const congress = [];
let currC = {};
for (const item of cEntries) {
    if (item.subTitle === 'Título del trabajo') {
        if (Object.keys(currC).length > 0) congress.push(currC);
        currC = { trabajo: item.text };
    } else if (item.subject.includes('Nombre del congreso')) currC.congreso = item.text;
    else if (item.subject.includes('Ciudad de celebración')) currC.ciudad = item.text;
    else if (item.subject.includes('Entidad organizadora')) currC.organizador = item.text;
}
if (Object.keys(currC).length > 0) congress.push(currC);

// --- Estancias ---
const eEntries = investigacion.filter(x => x.title.trim().startsWith('Estancias en centros'));
const estancias = [];
let currE = {};
for (const item of eEntries) {
    if (item.subTitle === 'Entidad de realización') {
        if (Object.keys(currE).length > 0) estancias.push(currE);
        currE = { entidad: item.text };
    } else if (item.subject.includes('Facultad/Centro')) currE.centro = item.text;
    else if (item.subject.includes('Duración')) currE.duracion = item.text;
    else if (item.subject.includes('Programa')) currE.programa = item.text;
}
if (Object.keys(currE).length > 0) estancias.push(currE);

// --- UPDATE DATA.TS ---
let dataTS = fs.readFileSync('lib/data.ts', 'utf8');

// Update stats
const statsStart = dataTS.indexOf('export const stats = {');
const statsEnd = dataTS.indexOf('};', statsStart) + 2;
let statsStr = dataTS.substring(statsStart, statsEnd);
if (!statsStr.includes('congresos:')) {
    statsStr = statsStr.replace('resenas: 6', 'resenas: 6,\n  congresos: ' + congress.length + ',\n  estancias: ' + estancias.length);
} else {
    statsStr = statsStr.replace(/congresos: \d+/, 'congresos: ' + congress.length);
    statsStr = statsStr.replace(/estancias: \d+/, 'estancias: ' + estancias.length);
}
dataTS = dataTS.replace(dataTS.substring(statsStart, statsEnd), statsStr);

// Add Congress and Estancias as new exports if they don't exist
if (!dataTS.includes('export const participacionCongresos')) {
    dataTS += '\nexport const participacionCongresos = ' + JSON.stringify(congress, null, 2) + ';\n';
} else {
    const start = dataTS.indexOf('export const participacionCongresos =');
    const end = dataTS.indexOf('];', start) + 2;
    dataTS = dataTS.replace(dataTS.substring(start, end), 'export const participacionCongresos = ' + JSON.stringify(congress, null, 2) + ';');
}

if (!dataTS.includes('export const estanciasInvestigacion')) {
    dataTS += '\nexport const estanciasInvestigacion = ' + JSON.stringify(estancias, null, 2) + ';\n';
} else {
    const start = dataTS.indexOf('export const estanciasInvestigacion =');
    const end = dataTS.indexOf('];', start) + 2;
    dataTS = dataTS.replace(dataTS.substring(start, end), 'export const estanciasInvestigacion = ' + JSON.stringify(estancias, null, 2) + ';');
}

fs.writeFileSync('lib/data.ts', dataTS);
console.log('Extra data update complete!');
