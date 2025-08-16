import "./globals.css";
import Providers from "./providers";
import Header from "./components/Header";
import Link from "next/link";

export const metadata = { title: "EventPilot", description: "Serverless Event Platform" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-brutal">
        <Providers>
          <Header />
          <main className="p-4">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
