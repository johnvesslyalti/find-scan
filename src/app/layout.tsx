import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Find Scan</title>
      </head>
      <body
      >
        {children}
      </body>
    </html>
  );
}
