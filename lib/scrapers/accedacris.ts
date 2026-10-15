import * as cheerio from 'cheerio';
import crypto from 'crypto';
import publicationsMock from '../data/publications-mock.json';
import projectsMock from '../data/projects.json';
import {
  Publicaciones,
  PublicacionArticulo as Articulo,
  PublicacionLibro as Libro,
  PublicacionCapitulo as Capitulo,
  ProyectoInvestigacion
} from '../types';

const BASE_URL = 'https://accedacris.ulpgc.es';
const PERSON_PROFILE_ID = 'rp01750';
const DEFAULT_PERSON_UUID = '7ba553dc-c186-4816-82a7-be5e7435a978';

let cachedCookies: string | null = null;
let resolvedPersonUuid: string | null = null;

let cachedPublicaciones: Publicaciones | null = null;
let cacheTimestamp: number = 0;
let cachedProyectos: ProyectoInvestigacion[] | null = null;
let projectsCacheTimestamp: number = 0;
const CACHE_DURATION = 3600 * 1000; // 1 hour in ms

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'application/json, text/html, application/xhtml+xml, */*',
  'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
};

function sha256(str: string): string {
  return crypto.createHash('sha256').update(str).digest('hex');
}

function parseCookies(cookieHeaders: string | string[] | null): Record<string, string> {
  if (!cookieHeaders) return {};
  const jar: Record<string, string> = {};
  const list = Array.isArray(cookieHeaders) ? cookieHeaders : [cookieHeaders];

  for (const header of list) {
    if (!header) continue;
    header.split(',').forEach(c => {
      const parts = c.split(';')[0].split('=');
      if (parts.length >= 2) {
        const name = parts[0].trim();
        const val = parts[1].trim();
        if (name) jar[name] = val;
      }
    });
  }
  return jar;
}

function serializeCookies(jar: Record<string, string>): string {
  return Object.entries(jar).map(([k, v]) => `${k}=${v}`).join('; ');
}

export async function fetchWithAnubis(url: string, options: RequestInit = {}): Promise<Response> {
  const mergedHeaders: Record<string, string> = {
    ...HEADERS,
    ...((options.headers as Record<string, string>) || {})
  };

  if (cachedCookies) {
    mergedHeaders['Cookie'] = cachedCookies;
  }

  let response = await fetch(url, {
    ...options,
    cache: 'no-store',
    headers: mergedHeaders
  });

  if (response.ok) {
    const text = await response.clone().text();
    if (text.includes('id="anubis_challenge"')) {
      const $ = cheerio.load(text);
      const challengeText = $('#anubis_challenge').text().trim();
      if (challengeText) {
        try {
          const challengeData = JSON.parse(challengeText);
          const challenge = challengeData.challenge;
          const difficulty = challengeData.rules.difficulty;

          const startTime = Date.now();
          let nonce = 0;
          let hash = '';
          const prefix = '0'.repeat(difficulty);

          while (true) {
            const candidate = challenge + nonce;
            const h = sha256(candidate);
            if (h.startsWith(prefix)) {
              hash = h;
              break;
            }
            nonce++;
          }
          const elapsedTime = Date.now() - startTime;

          const rawSetCookies = typeof (response.headers as any).getSetCookie === 'function'
            ? (response.headers as any).getSetCookie()
            : response.headers.get('set-cookie');
          const initialCookies = parseCookies(rawSetCookies);

          const passUrl = `${BASE_URL}/.within.website/x/cmd/anubis/api/pass-challenge?response=${hash}&nonce=${nonce}&redir=${encodeURIComponent(url)}&elapsedTime=${elapsedTime}`;

          const passResponse = await fetch(passUrl, {
            method: 'GET',
            cache: 'no-store',
            headers: {
              ...HEADERS,
              'Cookie': serializeCookies(initialCookies)
            },
            redirect: 'manual'
          });

          const rawPassCookies = typeof (passResponse.headers as any).getSetCookie === 'function'
            ? (passResponse.headers as any).getSetCookie()
            : passResponse.headers.get('set-cookie');
          const passCookies = parseCookies(rawPassCookies);
          const combinedCookies = { ...initialCookies, ...passCookies };
          cachedCookies = serializeCookies(combinedCookies);

          const finalHeaders = {
            ...mergedHeaders,
            'Cookie': cachedCookies
          };

          response = await fetch(url, {
            ...options,
            cache: 'no-store',
            headers: finalHeaders
          });
        } catch (e) {
          console.error('[Anubis] Error solving challenge:', e);
        }
      }
    }
  }

  return response;
}

async function getPersonUuid(): Promise<string> {
  if (resolvedPersonUuid) return resolvedPersonUuid;

  try {
    const searchUrl = `${BASE_URL}/server/api/discover/search/objects?configuration=person&query=${PERSON_PROFILE_ID}`;
    const res = await fetchWithAnubis(searchUrl, {
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      const data = await res.json();
      const pItem = data._embedded?.searchResult?._embedded?.objects?.[0]?._embedded?.indexableObject;
      if (pItem?.id) {
        resolvedPersonUuid = pItem.id;
        return pItem.id;
      }
    }
  } catch (err) {
    console.warn('[AccedaCRIS] Failed to dynamically resolve person UUID, using default:', err);
  }

  resolvedPersonUuid = DEFAULT_PERSON_UUID;
  return DEFAULT_PERSON_UUID;
}

function parseItem(item: any): { type: string; baseItem: any; rawType1: string; rawType2: string } {
  const meta: Record<string, Array<{ value: string }>> = item.metadata || {};

  const getMeta = (key: string): string[] =>
    meta[key]?.map(m => m.value.trim()).filter(Boolean) || [];
  const getFirst = (key: string): string => getMeta(key)[0] || '';

  const title = item.name || getFirst('dc.title') || '';
  const autores = getMeta('dc.contributor.author').join('; ');
  const añoStr = getFirst('dc.date.issued');
  const año = parseInt(añoStr.match(/\d{4}/)?.[0] || '') || new Date().getFullYear();
  const type1 = getFirst('dc.type').toLowerCase();
  const type2 = getFirst('dc.type2').toLowerCase();

  const handle = item.handle
    ? `${BASE_URL}/handle/${item.handle}`
    : `${BASE_URL}/entities/publication/${item.id}`;

  let pdfUrl = '';
  const bundles: any[] = item._embedded?.bundles?._embedded?.bundles || [];
  const origBundle = bundles.find(b => b.name === 'ORIGINAL');
  if (origBundle?._embedded?.bitstreams?._embedded?.bitstreams) {
    const bitstreams: any[] = origBundle._embedded.bitstreams._embedded.bitstreams;
    const pdf = bitstreams.find(bs => bs.name?.toLowerCase().endsWith('.pdf')) || bitstreams[0];
    if (pdf?._links?.content?.href) {
      pdfUrl = pdf._links.content.href;
    }
  }

  const unescoList: string[] = [];
  getMeta('dc.subject.unesco').forEach(val => {
    const text = val.replace(/^\d+\s*/, '').trim();
    if (text && !unescoList.includes(text)) unescoList.push(text);
  });
  if (unescoList.length === 0) {
    getMeta('dc.subject').forEach(val => {
      const text = val.replace(/^\d+\s*/, '').trim();
      if (text && !unescoList.includes(text)) unescoList.push(text);
    });
  }

  const isbn = getFirst('dc.identifier.isbn') || '';
  const editorial = getFirst('dc.publisher') || '';
  const relationIsPartOf = getFirst('dc.relation.ispartof');
  const source = getFirst('dc.source');
  const journalOrBook = relationIsPartOf || source || '';

  const volumen = getFirst('dc.identifier.volume') || getFirst('dc.identifier.issue') || '';
  const startPage = getFirst('dc.description.firstpage') || getFirst('oaire.citation.startPage');
  const endPage = getFirst('dc.description.lastpage') || getFirst('oaire.citation.endPage');
  const paginas = startPage && endPage ? `${startPage}-${endPage}` : (startPage || endPage || '');
  const doi = getFirst('dc.identifier.doi') || '';

  const baseItem = {
    autores,
    titulo: title,
    año,
    handle,
    pdfUrl: pdfUrl || undefined,
    isbn: isbn || undefined,
    editorial: editorial || undefined,
    clasificacion: unescoList,
    revistaOrLibro: journalOrBook,
    volumen: volumen || undefined,
    paginas: paginas || undefined,
    doi: doi || undefined,
    detailsLoaded: true
  };

  return { type: type2 || type1, baseItem, rawType1: type1, rawType2: type2 };
}

export async function fetchItemDetails(handleOrUrl: string) {
  try {
    let queryUrl = '';
    const handleMatch = handleOrUrl.match(/handle\/(10553\/\d+)/i) || handleOrUrl.match(/(10553\/\d+)/);
    const uuidMatch = handleOrUrl.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i);

    if (handleMatch) {
      queryUrl = `${BASE_URL}/server/api/pid/find?id=${handleMatch[1]}&embed=bundles/bitstreams`;
    } else if (uuidMatch) {
      queryUrl = `${BASE_URL}/server/api/core/items/${uuidMatch[1]}?embed=bundles/bitstreams`;
    } else {
      return null;
    }

    const response = await fetchWithAnubis(queryUrl, {
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) return null;
    const item = await response.json();
    const { baseItem } = parseItem(item);

    return {
      pdfUrl: baseItem.pdfUrl || '',
      isbn: baseItem.isbn || '',
      editorial: baseItem.editorial || '',
      clasificacion: baseItem.clasificacion || [],
      autores: baseItem.autores || '',
      revista: baseItem.revistaOrLibro || '',
      volumen: baseItem.volumen || '',
      paginas: baseItem.paginas || '',
      doi: baseItem.doi || ''
    };
  } catch (error) {
    console.error('[AccedaCRIS] Error fetching item details:', error);
    return null;
  }
}

export async function fetchPublicacionesList(): Promise<Publicaciones> {
  const now = Date.now();
  if (cachedPublicaciones && (now - cacheTimestamp < CACHE_DURATION)) {
    return cachedPublicaciones;
  }

  try {
    const personUuid = await getPersonUuid();
    const allObjects: any[] = [];
    let page = 0;
    let totalPages = 1;

    while (page < totalPages) {
      const url = `${BASE_URL}/server/api/discover/search/objects?sort=dc.date.issued,DESC&page=${page}&size=100&configuration=RELATION.Person.researchoutputs&scope=${personUuid}&embed=bundles/bitstreams`;
      const res = await fetchWithAnubis(url, {
        headers: { 'Accept': 'application/json' }
      });

      if (!res.ok) {
        throw new Error(`Discover API error page ${page}: ${res.status} ${res.statusText}`);
      }

      const json = await res.json();
      const sr = json._embedded?.searchResult;
      totalPages = sr?.page?.totalPages || 1;
      const objects = sr?._embedded?.objects || [];
      allObjects.push(...objects);
      page++;
    }

    const articulos: Articulo[] = [];
    const libros: Libro[] = [];
    const capitulos: Capitulo[] = [];
    const resenas: Articulo[] = [];
    const actas: Articulo[] = [];

    for (const obj of allObjects) {
      const item = obj._embedded?.indexableObject;
      if (!item) continue;

      const { baseItem, rawType1, rawType2 } = parseItem(item);

      const isResena = rawType2.includes('reseña') || (!rawType2 && rawType1.includes('review'));
      const isCapitulo = rawType2.includes('capítulo') || (!rawType2 && (rawType1.includes('bookpart') || rawType1.includes('chapter')));
      const isLibro = rawType2.includes('libro') || (!rawType2 && rawType1.includes('book'));
      const isArticulo = rawType2.includes('artículo') || (!rawType2 && rawType1.includes('article'));
      const isActa = rawType2.includes('actas') || (!rawType2 && rawType1.includes('conference'));

      if (isResena) {
        resenas.push({
          autores: baseItem.autores,
          titulo: baseItem.titulo,
          año: baseItem.año,
          handle: baseItem.handle,
          pdfUrl: baseItem.pdfUrl,
          isbn: baseItem.isbn,
          clasificacion: baseItem.clasificacion,
          detailsLoaded: true,
          revista: baseItem.revistaOrLibro,
          volumen: baseItem.volumen,
          paginas: baseItem.paginas,
          doi: baseItem.doi
        });
      } else if (isCapitulo) {
        capitulos.push({
          autores: baseItem.autores,
          titulo: baseItem.titulo,
          año: baseItem.año,
          handle: baseItem.handle,
          pdfUrl: baseItem.pdfUrl,
          isbn: baseItem.isbn,
          clasificacion: baseItem.clasificacion,
          detailsLoaded: true,
          libro: baseItem.revistaOrLibro,
          editorial: baseItem.editorial || '',
          paginas: baseItem.paginas,
          tipo: 'Capítulo de libro'
        });
      } else if (isLibro) {
        libros.push({
          autores: baseItem.autores,
          titulo: baseItem.titulo,
          año: baseItem.año,
          handle: baseItem.handle,
          pdfUrl: baseItem.pdfUrl,
          isbn: baseItem.isbn,
          clasificacion: baseItem.clasificacion,
          detailsLoaded: true,
          editorial: baseItem.editorial || '',
          tipo: 'Libro'
        });
      } else if (isArticulo) {
        articulos.push({
          autores: baseItem.autores,
          titulo: baseItem.titulo,
          año: baseItem.año,
          handle: baseItem.handle,
          pdfUrl: baseItem.pdfUrl,
          isbn: baseItem.isbn,
          clasificacion: baseItem.clasificacion,
          detailsLoaded: true,
          revista: baseItem.revistaOrLibro,
          volumen: baseItem.volumen,
          paginas: baseItem.paginas,
          doi: baseItem.doi
        });
      } else if (isActa) {
        actas.push({
          autores: baseItem.autores,
          titulo: baseItem.titulo,
          año: baseItem.año,
          handle: baseItem.handle,
          pdfUrl: baseItem.pdfUrl,
          isbn: baseItem.isbn,
          clasificacion: baseItem.clasificacion,
          detailsLoaded: true,
          revista: baseItem.revistaOrLibro,
          volumen: baseItem.volumen,
          paginas: baseItem.paginas,
          doi: baseItem.doi
        });
      }
    }

    const result: Publicaciones = {
      articulos: articulos.sort((a, b) => b.año - a.año),
      libros: libros.sort((a, b) => b.año - a.año),
      capitulos: capitulos.sort((a, b) => b.año - a.año),
      resenas: resenas.sort((a, b) => b.año - a.año),
      actas: actas.sort((a, b) => b.año - a.año)
    };

    if (result.articulos.length > 0 || result.libros.length > 0 || result.capitulos.length > 0) {
      cachedPublicaciones = result;
      cacheTimestamp = now;
      return result;
    }

    console.warn('[AccedaCRIS] Fetched data empty, returning fallback mock data');
    return (cachedPublicaciones || publicationsMock) as Publicaciones;
  } catch (error) {
    if (cachedPublicaciones) {
      console.warn('[AccedaCRIS] Fetch failed, returning stale cached data:', error);
      return cachedPublicaciones;
    }
    console.warn('[AccedaCRIS] Fetch failed, returning fallback mock data:', error);
    return publicationsMock as Publicaciones;
  }
}

export async function fetchPublicaciones(): Promise<Publicaciones> {
  return await fetchPublicacionesList();
}

function normalizeTitle(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

export async function fetchProyectosList(): Promise<ProyectoInvestigacion[]> {
  const now = Date.now();
  if (cachedProyectos && (now - projectsCacheTimestamp < CACHE_DURATION)) {
    return cachedProyectos;
  }

  try {
    const personUuid = await getPersonUuid();
    const url = `${BASE_URL}/server/api/discover/search/objects?configuration=RELATION.Person.projects&scope=${personUuid}&size=50`;
    const res = await fetchWithAnubis(url, {
      headers: { 'Accept': 'application/json' }
    });

    if (!res.ok) {
      throw new Error(`Projects API error: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();
    const objects = json._embedded?.searchResult?._embedded?.objects || [];

    const remoteProjects: ProyectoInvestigacion[] = objects.map((o: any) => {
      const item = o._embedded?.indexableObject;
      const meta = item?.metadata || {};
      const getFirst = (k: string) => meta[k]?.[0]?.value || '';
      const getAll = (k: string) => meta[k]?.map((x: any) => x.value) || [];

      const startYear = getFirst('crispj.startdate').slice(0, 4);
      const expYear = getFirst('crispj.expdate').slice(0, 4);
      const periodo = startYear && expYear
        ? (startYear === expYear ? startYear : `${startYear} - ${expYear}`)
        : (startYear || expYear || getFirst('crispj.year') || '');

      let funder = getFirst('crispj.funderorganization') || getFirst('crispj.funder');
      if (funder && funder === funder.toUpperCase() && funder.length > 5) {
        funder = funder.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
      }

      const rawAmount = getFirst('crispj.grantamount');
      let cuantia = '';
      if (rawAmount) {
        const num = parseFloat(rawAmount.replace(',', '.'));
        cuantia = !isNaN(num) ? new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(num) : `${rawAmount} €`;
      }

      const handle = item.handle
        ? `${BASE_URL}/handle/${item.handle}`
        : `${BASE_URL}/entities/project/${item.id}`;

      return {
        titulo: item.name || getFirst('dc.title'),
        investigadorPrincipal: getAll('crispj.principalinvestigator').join('; ') || getFirst('crispj.coordinador'),
        entidadFinanciadora: funder,
        participacion: 'Investigador principal',
        periodo,
        referencia: getFirst('crispj.reference') || getFirst('crispj.expediente') || undefined,
        cuantia: cuantia || undefined,
        handle,
        relevante: true
      };
    });

    // Merge with base projectsMock so all 18 CV projects are retained
    const baseProjects: ProyectoInvestigacion[] = (projectsMock as ProyectoInvestigacion[]).map(p => {
      const normLocal = normalizeTitle(p.titulo);
      const matchedRemote = remoteProjects.find(r => {
        const normRemote = normalizeTitle(r.titulo);
        return normLocal.includes(normRemote) || normRemote.includes(normLocal) ||
          (p.referencia && r.referencia && p.referencia === r.referencia);
      });

      if (matchedRemote) {
        return {
          ...p,
          handle: matchedRemote.handle,
          referencia: p.referencia || matchedRemote.referencia,
          cuantia: p.cuantia || matchedRemote.cuantia,
          periodo: p.periodo || matchedRemote.periodo
        };
      }
      return p;
    });

    // Check if there are any new remote projects not in base
    for (const rp of remoteProjects) {
      const normRemote = normalizeTitle(rp.titulo);
      const alreadyPresent = baseProjects.some(bp => {
        const normLocal = normalizeTitle(bp.titulo);
        return normLocal.includes(normRemote) || normRemote.includes(normLocal);
      });
      if (!alreadyPresent) {
        baseProjects.unshift(rp);
      }
    }

    cachedProyectos = baseProjects;
    projectsCacheTimestamp = now;
    return baseProjects;
  } catch (error) {
    console.warn('[AccedaCRIS] Projects fetch failed, returning fallback mock data:', error);
    return (cachedProyectos || projectsMock) as ProyectoInvestigacion[];
  }
}
