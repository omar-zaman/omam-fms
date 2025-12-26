import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";

export const metadata = {
  title: "Omam FMS",
  description: "Omam Factory Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper>
          <LayoutWrapper>{children}</LayoutWrapper>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}

