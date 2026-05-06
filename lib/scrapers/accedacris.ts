import * as cheerio from 'cheerio';
import { Publicaciones, Articulo, Libro, Capitulo, Resena } from '../types';

const ACCEDA_CRIS_URL = 'https://accedacris.ulpgc.es/cris/rp/rp01750/publicaciones.html?open=all&sort_byall=1&orderall=desc&rppall=2000&etalall=-1&startall=0';

export async function fetchPublicaciones(): Promise<Publicaciones> {
  try {
    const response = await fetch(ACCEDA_CRIS_URL, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const articulos: Articulo[] = [];
    const libros: Libro[] = [];
    const capitulos: Capitulo[] = [];
    const resenas: Resena[] = [];
    
    // In AccedaCris, publications are often in a table or list of divs
    // Let's try to find them by looking for titles which are links to /handle/
    $('a[href*="/handle/"]').each((_, el) => {
      const $link = $(el);
      const $container = $link.closest('div, tr').parent().closest('div, tr'); 
      // Actually, usually they are in a structure like:
      // <div class="artifact-description">...</div> or similar
      // Based on previous logs, they have IDs like dc.contributor.author
      
      // Let's look for the common parent that contains the type
      let $entry = $link.closest('.artifact-description, .ds-artifact-item, tr');
      
      if ($entry.length === 0) return;

      const title = $link.text().trim();
      if (!title) return;

      const autores = $entry.find('[id*="dc.contributor.author"], .authority').text().replace('Autores: ', '').trim();
      const añoStr = $entry.find('[id*="dc.date.issued"]').text().replace('Fecha de publicación: ', '').trim();
      const año = parseInt(añoStr.match(/\d{4}/)?.[0] || '') || new Date().getFullYear();
      const source = $entry.find('[id*="dc.source"]').text().replace('Localización: ', '').trim();
      const type = $entry.find('[id*="dc.type2"]').text().trim().toLowerCase();
      
      if (type.includes('artículo') || type.includes('journal')) {
        articulos.push({
          autores,
          titulo: title,
          revista: source,
          año
        });
      } else if (type.includes('libro') && !type.includes('capítulo')) {
        libros.push({
          autores,
          titulo: title,
          editorial: source,
          año,
          tipo: 'Libro'
        });
      } else if (type.includes('capítulo') || type.includes('chapter')) {
        capitulos.push({
          autores,
          titulo: title,
          libro: source,
          año
        });
      } else if (type.includes('reseña') || type.includes('review')) {
        resenas.push({
          autores,
          titulo: title,
          revista: source,
          año
        });
      }
    });
    
    return {
      articulos: articulos.sort((a, b) => b.año - a.año),
      libros: libros.sort((a, b) => b.año - a.año),
      capitulos: capitulos.sort((a, b) => b.año - a.año),
      resenas: resenas.sort((a, b) => b.año - a.año)
    };
  } catch (error) {
    console.error('Error fetching publications from AccedaCris:', error);
    // Fallback to empty if everything fails
    return {
      articulos: [],
      libros: [],
      capitulos: [],
      resenas: []
    };
  }
}
