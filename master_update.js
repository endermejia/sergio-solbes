const fs = require('fs');

function parseJSON(file) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

const expDocente = parseJSON('./experienciaDocente.json');
const investigacion = parseJSON('./investigacion.json');
const presentacion = parseJSON('./presentacion.json');
const gestion = parseJSON('./gestionAcademica.json');

// --- TFGs / TFMs / Tesis ---
const tEntries = expDocente.filter(x => x.title.trim() === 'Dirección tesis doctorales y trabajos académicos');
const tfgs = [];
let currT = {};
for (const item of tEntries) {
    if (item.subject === 'Título del trabajo') {
        if (Object.keys(currT).length > 0) tfgs.push(currT);
        const tipo = item.text.includes('TFG') ? 'TFG' : (item.text.includes('TFM') ? 'TFM' : 'Tesis');
        currT = { titulo: item.text.replace('TFG. ', '').replace('TFM. ', '').replace('TESIS DOCTORAL. ', ''), tipo };
    } else if (item.subject === 'Alumno/a') currT.alumno = item.text;
    else if (item.subject === 'Entidad de realización') currT.titulacion = item.text;
    else if (item.subject === 'Fecha de defensa') currT.año = item.text.split('/').pop() || item.text;
}
if (Object.keys(currT).length > 0) tfgs.push(currT);

// --- Research Projects ---
const pEntries = investigacion.filter(x => x.title.trim() === 'Participación y coordinación de proyectos de investigación');
const projects = [];
let currP = {};
for (const item of pEntries) {
    if (item.subTitle === 'Nombre del proyecto') {
        if (Object.keys(currP).length > 0) projects.push(currP);
        currP = { titulo: item.text };
    } else if (item.subject.includes('Fecha de inicio')) currP.inicio = item.text;
    else if (item.subject.includes('Fecha de fin')) {
        currP.fin = item.text;
        currP.periodo = (currP.inicio || '') + ' - ' + (currP.fin || '');
    } else if (item.subject.includes('Entidad/es financiadora/s')) currP.entidadFinanciadora = item.text;
    else if (item.subject.includes('Investigadores principales')) currP.investigadorPrincipal = item.text;
    else if (item.subject.includes('Referencia del proyecto')) currP.referencia = item.text;
    else if (item.subject.includes('Tipo de participación')) currP.participacion = item.text;
}
if (Object.keys(currP).length > 0) projects.push(currP);

// --- Asignaturas ---
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

// --- Innovacion ---
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

// --- Formacion ---
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

// --- UPDATE DATA.TS ---
let dataTS = fs.readFileSync('lib/data.ts', 'utf8');

function updateArray(name, newData, idField = 'titulo') {
    const regex = new RegExp(`export const ${name}(:\\s*[^=]+)?\\s*=\\s*\\[`);
    const match = dataTS.match(regex);
    if (!match) {
        console.log('Array ' + name + ' not found as top-level export');
        return;
    }
    const startIdx = match.index;
    const typeAnnotation = match[1] || '';
    const endIdx = dataTS.indexOf('];', startIdx) + 2;
    const oldBlock = dataTS.substring(startIdx, endIdx);
    
    // Parse old block to keep "relevante: true"
    // This is hacky, but let's try to match by title
    const finalData = newData.map(item => {
        const match = dataTS.includes(item[idField]?.substring(0, 20));
        return { ...item, relevante: match };
    });

    dataTS = dataTS.replace(oldBlock, 'export const ' + name + typeAnnotation + ' = ' + JSON.stringify(finalData, null, 2) + ';');
}

// Special case for docencia object
function updateDocencia() {
    const regex = /export const docencia(:\s*[^=]+)?\s*=\s*\{/;
    const match = dataTS.match(regex);
    if (!match) return;
    const docStart = match.index;
    const typeAnnotation = match[1] || '';
    const docEnd = dataTS.indexOf('};', docStart) + 2;
    let docStr = dataTS.substring(docStart, docEnd);

    // Update asignaturas
    const asigStart = docStr.indexOf('asignaturas: [');
    const asigEnd = docStr.indexOf('],', asigStart) + 2;
    const oldAsig = docStr.substring(asigStart, asigEnd);
    docStr = docStr.replace(oldAsig, 'asignaturas: ' + JSON.stringify(asignaturas, null, 4) + ',');

    // Update innovacion
    const innStart = docStr.indexOf('innovacionDocente: [');
    const innEnd = docStr.indexOf('],', innStart) + 2;
    const oldInn = docStr.substring(innStart, innEnd);
    docStr = docStr.replace(oldInn, 'innovacionDocente: ' + JSON.stringify(innovacion, null, 4) + ',');

    // Update formacion
    const forStart = docStr.indexOf('formacionDocente: [');
    const forEnd = docStr.indexOf('],', forStart) + 2;
    const oldFor = docStr.substring(forStart, forEnd);
    docStr = docStr.replace(oldFor, 'formacionDocente: ' + JSON.stringify(formacion, null, 4) + ',');

    dataTS = dataTS.replace(dataTS.substring(docStart, docEnd), docStr);
}

// Special case for direccionTrabajos
function updateDireccion() {
    const regex = /export const direccionTrabajos(:\s*[^=]+)?\s*=\s*\{/;
    const match = dataTS.match(regex);
    if (!match) return;
    const dStart = match.index;
    const typeAnnotation = match[1] || '';
    const dEnd = dataTS.indexOf('};', dStart) + 2;
    let dStr = dataTS.substring(dStart, dEnd);

    const tesis = tfgs.filter(t => t.tipo === 'Tesis').map(t => ({
        titulo: t.titulo,
        doctorando: t.alumno || '',
        programa: t.titulacion,
        universidad: t.titulacion,
        calificacion: '',
        fecha: t.año
    }));
    const tfgArr = tfgs.filter(t => t.tipo !== 'Tesis');

    const tesisStart = dStr.indexOf('tesis: [');
    const tesisEnd = dStr.indexOf('],', tesisStart) + 2;
    dStr = dStr.replace(dStr.substring(tesisStart, tesisEnd), 'tesis: ' + JSON.stringify(tesis, null, 4) + ',');

    const tfgStart = dStr.indexOf('tfg: [');
    const tfgEnd = dStr.indexOf(']', tfgStart) + 1;
    dStr = dStr.replace(dStr.substring(tfgStart, tfgEnd), 'tfg: ' + JSON.stringify(tfgArr, null, 4));

    dataTS = dataTS.replace(dataTS.substring(dStart, dEnd), dStr);
}

updateArray('proyectosInvestigacion', projects);
updateDocencia();
updateDireccion();

// Add Congress as a new export if it doesn't exist
if (!dataTS.includes('export const participacionCongresos')) {
    dataTS += '\nexport const participacionCongresos = ' + JSON.stringify(congress, null, 2) + ';\n';
}

fs.writeFileSync('lib/data.ts', dataTS);
console.log('Master update complete!');
