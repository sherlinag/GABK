import "./globals.css";

export const metadata = {
  title: "G Arasu Bakery | Freshly Baked Happiness",
  description: "Fresh bakery favourites, sweets and snacks from G Arasu Bakery in Muttaicadu, Kumarapuram."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
