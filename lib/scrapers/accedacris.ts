import * as cheerio from 'cheerio';
import {
  Publicaciones,
  PublicacionArticulo as Articulo,
  PublicacionLibro as Libro,
  PublicacionCapitulo as Capitulo
} from '../types';

const BASE_URL = 'https://accedacris.ulpgc.es';
const ACCEDA_CRIS_URL = `${BASE_URL}/cris/rp/rp01750/publicaciones.html?open=all&sort_byall=1&orderall=desc&rppall=2000&etalall=-1&startall=0`;

export async function fetchItemDetails(handleUrl: string) {
  try {
    const handleMatch = handleUrl.match(/handle\/(.+)$/);
    if (!handleMatch) return null;
    const handlePath = handleMatch[1];

    const apiUrl = `${BASE_URL}/rest/handle/${handlePath}?expand=metadata,bitstreams`;
    const response = await fetch(apiUrl, {
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
    const response = await fetch(ACCEDA_CRIS_URL, {
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
  // We can't easily fetch details here without making it slow again.
  // But for the sake of completeness if called from server:
  return list; // Or implement full batching again
}
