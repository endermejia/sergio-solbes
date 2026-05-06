import {
  ProfileData,
  Asignatura,
  InnovacionDocente,
  FormacionDocente,
  ProyectoInvestigacion,
  Tesis,
  TFG,
  GestionAcademica,
  Acreditacion,
  FormacionAcademica,
  CursoRecibido,
  LineaInvestigacion,
  Publicaciones,
  Stats,
  ParticipacionCongreso,
  EstanciaInvestigacion,
  MeritoInvestigacion,
} from "./types";

import academicData from "./data/academic.json";
import projectsData from "./data/projects.json";

export const profileData: ProfileData = {
  name: "Sergio Solbes Ferri",
  image: "/sergio-solbes-ferri.webp",
  birthDate: "12/01/1967",
  email: "sergio.solbes@ulpgc.es",
  orcid: "0000-0002-1465-9725",
  scopusId: "55256239300",
  researcherId: "R-8319-2018",
  dialnetId: "173209",
  links: {
    researchGate: "https://www.researchgate.net/profile/Sergio-Solbes-Ferri",
    googleScholar: "https://scholar.google.com/citations?user=2pM2u94AAAAJ",
    accedaCris: "https://accedacris.ulpgc.es/cris/rp/rp01750",
    iatext: "https://iatext.ulpgc.es/it/node/151",
  },
  logos: {
    ministerio:
      "https://www.igme.es/wp-content/uploads/2022/05/7-1_MCIU_color_300ppp.webp",
  },
};

export const gestionAcademica: GestionAcademica[] =
  academicData.gestionAcademica as GestionAcademica[];

export const docencia: {
  experiencia: {
    añosDocencia: number;
    instituciones: string[];
    niveles: string[];
  };
  asignaturas: Asignatura[];
  innovacionDocente: InnovacionDocente[];
  formacionDocente: FormacionDocente[];
} = academicData.docencia as any;

export const proyectosInvestigacion: ProyectoInvestigacion[] =
  projectsData as ProyectoInvestigacion[];
export const publicaciones: Publicaciones = {
  articulos: [],
  libros: [],
  capitulos: [],
  resenas: [],
};

export const direccionTrabajos: {
  tesis: Tesis[];
  tfg: TFG[];
} = academicData.direccionTrabajos as any;

export const stats: Stats = academicData.stats as Stats;

export const formacionAcademica: FormacionAcademica =
  academicData.formacionAcademica as any;

export const acreditaciones: Acreditacion[] =
  academicData.acreditaciones as Acreditacion[];

export const lineasInvestigacion: LineaInvestigacion[] =
  academicData.lineasInvestigacion as LineaInvestigacion[];

export const participacionCongresos: ParticipacionCongreso[] =
  academicData.participacionCongresos as ParticipacionCongreso[];

export const estanciasInvestigacion: EstanciaInvestigacion[] =
  academicData.estanciasInvestigacion as EstanciaInvestigacion[];

export const cursosRecibidos: CursoRecibido[] =
  academicData.cursosRecibidos as CursoRecibido[];

export const meritosInvestigacion: MeritoInvestigacion[] =
  academicData.meritosInvestigacion as MeritoInvestigacion[];
