import * as cheerio from 'cheerio';
import crypto from 'crypto';
import {
  Publicaciones,
  PublicacionArticulo as Articulo,
  PublicacionLibro as Libro,
  PublicacionCapitulo as Capitulo
} from '../types';

const BASE_URL = 'https://accedacris.ulpgc.es';
const ACCEDA_CRIS_URL = `${BASE_URL}/cris/rp/rp01750/publicaciones.html?open=all&sort_byall=1&orderall=desc&rppall=2000&etalall=-1&startall=0`;

let cachedCookies: string | null = null;

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
};

function sha256(str: string): string {
  return crypto.createHash('sha256').update(str).digest('hex');
}

function parseCookies(cookieHeader: string | null): Record<string, string> {
  if (!cookieHeader) return {};
  const jar: Record<string, string> = {};
  cookieHeader.split(',').forEach(c => {
    const parts = c.split(';')[0].split('=');
    if (parts.length >= 2) {
      const name = parts[0].trim();
      const val = parts[1].trim();
      if (name) jar[name] = val;
    }
  });
  return jar;
}

function serializeCookies(jar: Record<string, string>): string {
  return Object.entries(jar).map(([k, v]) => `${k}=${v}`).join('; ');
}

async function fetchWithAnubis(url: string, options: RequestInit = {}): Promise<Response> {
  const mergedHeaders = {
    ...HEADERS,
    ...(options.headers as Record<string, string> || {})
  };

  if (cachedCookies) {
    mergedHeaders['Cookie'] = cachedCookies;
  }

  let response = await fetch(url, {
    ...options,
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

          const initialCookies = parseCookies(response.headers.get('set-cookie'));
          const passUrl = `${BASE_URL}/.within.website/x/cmd/anubis/api/pass-challenge?response=${hash}&nonce=${nonce}&redir=${encodeURIComponent(url)}&elapsedTime=${elapsedTime}`;
          
          const passResponse = await fetch(passUrl, {
            method: 'GET',
            headers: {
              ...HEADERS,
              'Cookie': serializeCookies(initialCookies)
            },
            redirect: 'manual'
          });

          const passCookies = parseCookies(passResponse.headers.get('set-cookie'));
          const combinedCookies = { ...initialCookies, ...passCookies };
          cachedCookies = serializeCookies(combinedCookies);

          const finalHeaders = {
            ...mergedHeaders,
            'Cookie': cachedCookies
          };
          
          response = await fetch(url, {
            ...options,
            headers: finalHeaders
          });
        } catch (e) {
          console.error("[Anubis] Error solving challenge:", e);
        }
      }
    }
  }

  return response;
}

export async function fetchItemDetails(handleUrl: string) {
  try {
    const handleMatch = handleUrl.match(/handle\/(.+)$/);
    if (!handleMatch) return null;
    const handlePath = handleMatch[1];

    const apiUrl = `${BASE_URL}/rest/handle/${handlePath}?expand=metadata,bitstreams`;
    const response = await fetchWithAnubis(apiUrl, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 86400 }
    });

    if (!response.ok) return null;
    const data = await response.json();

    const metadataList: Array<{ key: string, value: string }> = data.metadata || [];
    const bitstreamsList: Array<any> = data.bitstreams || [];

    const getMetadataValues = (key: string): string[] =>
      metadataList.filter(m => m.key === key).map(m => m.value.trim()).filter(Boolean);

    // 1. PDF URL from Bitstreams
    let pdfUrl = '';
    const pdfBitstream = bitstreamsList.find(
      b => b.mimeType === 'application/pdf' && b.bundleName === 'ORIGINAL'
    ) || bitstreamsList.find(b => b.mimeType === 'application/pdf');

    if (pdfBitstream) {
      pdfUrl = `${BASE_URL}/rest${pdfBitstream.retrieveLink}`;
    }

    // 2. ISBN
    const isbn = getMetadataValues('dc.identifier.isbn')[0] ||
                 metadataList.find(m => m.key.toLowerCase().includes('isbn'))?.value ||
                 '';

    // 3. Editorial / Publisher
    const editorial = getMetadataValues('dc.publisher')[0] ||
                      getMetadataValues('dc.source')[0] ||
                      '';

    // 4. UNESCO / Classifications
    const unescoList: string[] = [];
    getMetadataValues('dc.subject.unesco').forEach(val => {
      const text = val.replace(/^\d+\s*/, '').trim();
      if (text && !unescoList.includes(text)) {
        unescoList.push(text);
      }
    });

    let clasificaciones = unescoList;
    if (clasificaciones.length === 0) {
      const fallback = getMetadataValues('dc.type2')[0] || getMetadataValues('dc.type')[0] || '';
      if (fallback && fallback.toLowerCase() !== 'libro' && fallback.toLowerCase() !== 'artículo') {
        clasificaciones.push(fallback);
      }
    }
    clasificaciones = clasificaciones.map(c => c.charAt(0).toUpperCase() + c.slice(1));

    // 5. Authors / Editors
    const detailAutores = metadataList
      .filter(m => m.key === 'dc.contributor.author' || m.key === 'dc.contributor.advisor' || m.key === 'dc.contributor.editor')
      .map(m => m.value.trim())
      .filter((value, index, self) => value && self.indexOf(value) === index);
    const autoresResult = detailAutores.join('; ');

    return {
      pdfUrl,
      isbn,
      editorial,
      clasificacion: clasificaciones,
      autores: autoresResult
    };
  } catch (error) {
    return null;
  }
}

export async function fetchPublicacionesList(): Promise<Publicaciones> {
  try {
    const response = await fetchWithAnubis(ACCEDA_CRIS_URL, {
      next: { revalidate: 3600 }
    });

    if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);

    const html = await response.text();
    const $ = cheerio.load(html);

    const entries: { type: string, handle: string, basic: any }[] = [];

    $('a[href*="/handle/"]').each((_, el) => {
      const $link = $(el);
      const handle = $link.attr('href') || '';
      if (!handle.includes('/handle/')) return;

      let $entry = $link.closest('.artifact-description, .ds-artifact-item, tr');
      if ($entry.length === 0) return;

      const title = $link.text().trim();
      const authorsList: string[] = [];
      $entry.find('[id*="dc.contributor.author"], [id*="dc.contributor.editor"], .authority').each((_, auth) => {
        const text = $(auth).text().trim().replace(/;$/, '');
        if (text && !authorsList.includes(text)) authorsList.push(text);
      });

      const añoStr = $entry.find('[id*="dc.date.issued"]').text().trim();
      const año = parseInt(añoStr.match(/\d{4}/)?.[0] || '') || new Date().getFullYear();
      const source = $entry.find('[id*="dc.source"]').text().replace('Localización: ', '').trim();
      const type = $entry.find('[id*="dc.type2"]').text().trim().toLowerCase();

      entries.push({
        type,
        handle: handle.startsWith('http') ? handle : BASE_URL + handle,
        basic: { autores: authorsList.join('; '), titulo: title, año, source }
      });
    });

    const articulos: Articulo[] = [];
    const libros: Libro[] = [];
    const capitulos: Capitulo[] = [];
    const resenas: Articulo[] = [];

    for (const entry of entries) {
      const item: any = {
        ...entry.basic,
        handle: entry.handle,
        clasificacion: [] // Empty for now, to be filled by details
      };

      if (entry.type.includes('artículo') || entry.type.includes('journal')) {
        articulos.push({ ...item, revista: entry.basic.source });
      } else if (entry.type.includes('libro') && !entry.type.includes('capítulo')) {
        libros.push({ ...item, editorial: entry.basic.source, tipo: 'Libro' });
      } else if (entry.type.includes('capítulo') || entry.type.includes('chapter')) {
        capitulos.push({ ...item, libro: entry.basic.source, editorial: '' });
      } else if (entry.type.includes('reseña') || entry.type.includes('review')) {
        resenas.push({ ...item, revista: entry.basic.source });
      }
    }

    return {
      articulos: articulos.sort((a, b) => b.año - a.año),
      libros: libros.sort((a, b) => b.año - a.año),
      capitulos: capitulos.sort((a, b) => b.año - a.año),
      resenas: resenas.sort((a, b) => b.año - a.año)
    };
  } catch (error) {
    return { articulos: [], libros: [], capitulos: [], resenas: [] };
  }
}

// Keep old function for backward compatibility if needed, but updated to use batches
export async function fetchPublicaciones(): Promise<Publicaciones> {
  const list = await fetchPublicacionesList();
  return list;
}

