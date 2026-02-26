import "./global.css" // Importe seu CSS global aqui [cite: 2026-02-25]

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body>
        {children}
      </body>
    </html>
  )
}