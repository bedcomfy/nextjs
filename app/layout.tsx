// app/layout.tsx
import '../globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>My Next.js App</title>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}