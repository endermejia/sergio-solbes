export function Footer() {
  return (
    <footer className="border-t border-border/50 py-8">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Sergio Solbes Ferri
          </p>
          <p>
            Universidad de Las Palmas de Gran Canaria
          </p>
        </div>
      </div>
    </footer>
  )
}
