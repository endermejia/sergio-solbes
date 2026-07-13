import { fetchPublicacionesList } from "@/lib/scrapers/accedacris";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await fetchPublicacionesList();
    return NextResponse.json({
      success: true,
      articulosCount: data.articulos.length,
      librosCount: data.libros.length,
      capitulosCount: data.capitulos.length,
      resenasCount: data.resenas.length,
      sampleArticulo: data.articulos[0] || null
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || String(error)
    }, { status: 500 });
  }
}
