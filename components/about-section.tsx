import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap, Users, Award, BookOpen } from "lucide-react"

const highlights = [
  {
    icon: GraduationCap,
    title: "Formación",
    description: "Licenciado y Doctor en Historia por la Universidad de Navarra"
  },
  {
    icon: Users,
    title: "Docencia",
    description: "Facultad de Economía, Empresa y Turismo · Facultad de Geografía e Historia"
  },
  {
    icon: Award,
    title: "Investigación",
    description: "Grupo DPHA del Instituto IATEXT"
  },
  {
    icon: BookOpen,
    title: "Especialidad",
    description: "Historia Económica · Siglo XVIII · Fiscalidad"
  },
]

export function AboutSection() {
  return (
    <section id="sobre-mi" className="py-20 md:py-28 scroll-mt-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Sobre mí
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-6">
            <p className="text-muted-foreground leading-relaxed">
              Desde 1993 desarrollo mi labor docente e investigadora en el <strong className="text-foreground">Departamento 
              de Ciencias Históricas</strong> de la Universidad de Las Palmas de Gran Canaria. Mi formación 
              académica incluye la licenciatura y el doctorado en Historia por la Universidad de Navarra, 
              con especialización en Historia Económica.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Actualmente formo parte del Grupo de Investigación <strong className="text-foreground">"Documentación, 
              Patrimonio e Historia Atlántica" (DPHA)</strong> del Instituto Universitario de Análisis y 
              Aplicaciones Textuales (IATEXT).
            </p>
          </div>
          <div className="space-y-6">
            <p className="text-muted-foreground leading-relaxed">
              A lo largo de mi trayectoria he asumido diversas responsabilidades académicas y de gestión: 
              Secretario del Departamento de Ciencias Históricas, miembro del Claustro Universitario, 
              coordinador del Área de Historia Económica, coordinador del GIR-DPHA y del Grupo de 
              Innovación Educativa en Economía e Historia (GIZEH).
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Imparto docencia tanto en la <strong className="text-foreground">Facultad de Economía, 
              Empresa y Turismo</strong> como en la <strong className="text-foreground">Facultad de 
              Geografía e Historia</strong>.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {highlights.map((item) => (
            <Card key={item.title} className="border-border/50 bg-card/50">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="p-3 rounded-full bg-accent/10">
                    <item.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
