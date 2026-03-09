import "@/app/global.css";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body>
        <main className="w-full">{children}</main>
      </body>
    </html>
  );
}
