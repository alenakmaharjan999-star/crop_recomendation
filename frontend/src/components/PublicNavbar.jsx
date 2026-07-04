import { Link } from 'react-router-dom';
import './PublicNavbar.css';

export default function PublicNavbar() {
  return (
    <header className="pub-nav">
      <div className="pub-nav__brand">🌱 E-Krishi</div>

      <nav className="pub-nav__links">
        <a href="#features">Features</a>
        <a href="#how-it-works">How it works</a>
        <a href="#preview">Try it</a>
      </nav>

      <div className="pub-nav__actions">
        <Link to="/login" className="pub-nav__login">Log in</Link>
        <Link to="/signup" className="pub-nav__cta">Get started</Link>
      </div>
    </header>
  );
}