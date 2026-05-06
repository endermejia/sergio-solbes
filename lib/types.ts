export interface BaseItem {
  relevante?: boolean;
}

export interface ProfileData {
  name: string;
  image: string;
  birthDate: string;
  email: string;
  orcid: string;
  scopusId: string;
  researcherId: string;
  dialnetId: string;
  links: {
    researchGate: string;
    googleScholar: string;
    accedaCris: string;
    iatext: string;
  };
  logos: {
    ministerio: string;
  };
}

export interface GestionAcademica {
  cargo: string;
  entidad: string;
  periodo: string;
}

export interface Asignatura extends BaseItem {
  nombre: string;
  creditos: number | string;
  tipo?: string;
  titulacion: string;
  año?: string;
}

export interface Tesis extends BaseItem {
  titulo: string;
  doctorando: string;
  programa: string;
  universidad: string;
  calificacion: string;
  fecha: string;
}

export interface TFG extends BaseItem {
  titulo: string;
  tipo: string;
  titulacion: string;
  alumno?: string;
  año: string;
  calificacion: string;
}

export interface InnovacionDocente extends BaseItem {
  titulo: string;
  rol: string;
  financiacion: string;
}

export interface FormacionDocente extends BaseItem {
  actividad: string;
  año: string;
  entidad: string;
}

export interface ProyectoInvestigacion extends BaseItem {
  titulo: string;
  investigadorPrincipal?: string;
  entidadFinanciadora: string;
  participacion?: string;
  periodo?: string;
  referencia?: string;
}

export interface Acreditacion {
  titulo: string;
  entidad: string;
  fecha: string;
}

export interface FormacionAcademica {
  licenciatura: {
    titulo: string;
    division: string;
    seccion: string;
    universidad: string;
    ciudad: string;
    fecha: string;
    notaMedia: string;
  };
  doctorado: {
    programa: string;
    universidad: string;
    ciudad: string;
    fecha: string;
    tesis: string;
    director: string;
    calificacion: string;
  };
}

export interface CursoRecibido {
  nombre: string;
  entidad: string;
  año: string;
}

export interface LineaInvestigacion {
  titulo: string;
  descripcion: string;
  icon: string;
}

export interface PublicacionArticulo {
  autores: string;
  titulo: string;
  revista: string;
  año: number;
  tipo?: string;
  volumen?: string;
  paginas?: string;
  doi?: string;
  indices?: string;
}

export interface PublicacionLibro {
  autores: string;
  titulo: string;
  editorial: string;
  ciudad?: string;
  año: number;
  isbn?: string;
  tipo: string;
}

export interface PublicacionCapitulo {
  autores: string;
  titulo: string;
  libro: string;
  editores?: string;
  paginas?: string;
  editorial: string;
  ciudad?: string;
  año: number;
  isbn?: string;
  tipo?: string;
}

export interface ParticipacionCongreso {
  trabajo: string;
  congreso?: string;
  ciudad?: string;
  organizador?: string;
  fecha?: string;
  tipo?: string;
  modo?: string;
  ambito?: string;
}

export interface EstanciaInvestigacion {
  entidad: string;
  centro?: string;
  duracion: string;
  programa?: string;
  año?: string;
  objetivos?: string;
  tareas?: string;
}

export interface MeritoInvestigacion {
  categoria: string;
  titulo: string;
  entidad: string;
  fecha: string;
}

export interface Publicaciones {
  articulos: PublicacionArticulo[];
  libros: PublicacionLibro[];
  capitulos: PublicacionCapitulo[];
  resenas: PublicacionArticulo[];
}

export interface Stats {
  articulos: number;
  libros: number;
  capitulos: number;
  resenas: number;
  congresos: number;
  estancias: number;
  proyectos: number;
}
