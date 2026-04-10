import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";
import "./original.css";

export const metadata = {
  title: "Enabled : Community Support Platform",
  description: "Indonesia-based community support platform for special needs children's parents and bereaved parents.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  interactiveWidget: "resizes-content",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg"
        >
          Skip to main content
        </a>
        <AuthProvider>
          <CartProvider>
            <div id="main-content">{children}</div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
