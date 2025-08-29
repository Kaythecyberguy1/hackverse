// src/components/Layout.jsx
import { Link } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div>
      <header>Hackverse Pro Navbar</header>
      <main>{children}</main>
      <footer>© 2025 HackVerse</footer>
    </div>
  );
}
