import * as cheerio from 'cheerio';
import { 
  Publicaciones, 
  PublicacionArticulo as Articulo, 
  PublicacionLibro as Libro, 
  PublicacionCapitulo as Capitulo,
  BasePublicacion
} from '../types';

const BASE_URL = 'https://accedacris.ulpgc.es';
const ACCEDA_CRIS_URL = `${BASE_URL}/cris/rp/rp01750/publicaciones.html?open=all&sort_byall=1&orderall=desc&rppall=2000&etalall=-1&startall=0`;

export async function fetchItemDetails(handleUrl: string) {
  try {
    const response = await fetch(handleUrl, { next: { revalidate: 86400 } });
    if (!response.ok) return null;
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // PDF Link
    let pdfUrl = '';
    const pdfLink = $('a[href$=".pdf"]').first();
    if (pdfLink.length > 0) {
      pdfUrl = BASE_URL + pdfLink.attr('href');
    } else {
      const viewLink = $('a:contains("Ver/Abrir"), a:contains("View/Open")').first();
      if (viewLink.length > 0) {
        pdfUrl = BASE_URL + viewLink.attr('href');
      }
    }

    // ISBN
    const isbn = $('.metadataFieldLabel:contains("ISBN"), .dc-identifier-isbn').next('.metadataFieldValue').text().trim() || 
                 $('td:contains("ISBN")').next('td').text().trim();

    // Editorial / Publisher
    const editorial = $('.metadataFieldLabel:contains("Editorial"), .metadataFieldLabel:contains("Editor/a"), .dc-publisher').next('.metadataFieldValue').text().trim() ||
                      $('td:contains("Editorial"), td:contains("Editor/a")').next('td').text().trim() ||
                      $('meta[name="citation_publisher"]').attr('content') || '';

    // Specific Classification (UNESCO) - Handle multiple values
    const unescoList: string[] = [];
    const $unescoLabels = $('.metadataFieldLabel:contains("Clasificación UNESCO"), .dc-subject-unesco');
    
    $unescoLabels.each((_, label) => {
      const $value = $(label).next('.metadataFieldValue');
      const html = $value.html() || '';
      const parts = html.split(/<br\s*\/?>/i);
      
      parts.forEach(part => {
        let text = cheerio.load(part).text().trim();
        if (text) {
          text = text.replace(/^\d+\s*/, '').trim();
          if (text && !unescoList.includes(text)) {
            unescoList.push(text);
          }
        }
      });
    });

    let clasificaciones = unescoList;
    if (clasificaciones.length === 0) {
      const fallback = $('.breadcrumb li.active').text().trim() || 
                       $('.metadataFieldLabel:contains("Tipo"), .dc-type').next('.metadataFieldValue').text().trim();
      
      if (fallback && fallback.toLowerCase() !== 'libro' && fallback.toLowerCase() !== 'artículo') {
        clasificaciones.push(fallback);
      } else {
        const type2 = $('.metadataFieldLabel:contains("Tipo"), .dc-type2').next('.metadataFieldValue').text().trim();
        if (type2) clasificaciones.push(type2);
      }
    }
    clasificaciones = clasificaciones.map(c => c.charAt(0).toUpperCase() + c.slice(1));

    // Authors/Editors
    const detailAutores: string[] = [];
    $('.metadataFieldLabel:contains("Autor"), .metadataFieldLabel:contains("Editor"), .metadataFieldLabel:contains("Coordinador"), .metadataFieldLabel:contains("Director")').each((_, label) => {
      const labelText = $(label).text().toLowerCase();
      if (labelText.includes('editor/a') && $(label).next('.metadataFieldValue').find('a[href*="/publishers/"]').length > 0) return;
      
      $(label).next('.metadataFieldValue').find('a.authority').each((_, auth) => {
         const text = $(auth).text().trim().replace(/;$/, '');
         if (text && !detailAutores.includes(text)) {
           detailAutores.push(text);
         }
      });
    });
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
