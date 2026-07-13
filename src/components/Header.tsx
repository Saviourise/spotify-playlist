import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Icon } from "./Icon";
import { site } from "../data/site";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Browse", to: "/browse" },
  { label: "Categories", to: "/categories" },
  { label: "About", to: "/about" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="brand" aria-label={`${site.name} home`}>
          <span className="brand-mark">
            <Icon name="logo" />
          </span>
          {site.name}
        </Link>

        <nav className="nav" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink key={item.label} to={item.to} end={item.to === "/"}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-cta">
          <Link to="/submit" className="btn btn-primary btn-hero">
            Submit a track
          </Link>
          <button
            className="menu-btn"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </div>

      {open ? (
        <div className="drawer">
          {navItems.map((item) => (
            <NavLink key={item.label} to={item.to} end={item.to === "/"}>
              {item.label}
            </NavLink>
          ))}
          <Link to="/submit" className="btn btn-primary btn-lg">
            Submit a track
          </Link>
        </div>
      ) : null}
    </header>
  );
}
