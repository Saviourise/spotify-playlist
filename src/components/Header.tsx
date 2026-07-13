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

  // Lock background scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
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
      </header>

      {/* Rendered outside <header> so its position:fixed is relative to the
          viewport. A backdrop-filter ancestor (the header) would otherwise
          become its containing block and collapse it. */}
      {open ? (
        <div className="drawer">
          <nav className="drawer-nav" aria-label="Mobile">
            {navItems.map((item) => (
              <NavLink key={item.label} to={item.to} end={item.to === "/"}>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <Link to="/submit" className="btn btn-primary btn-lg">
            Submit a track
          </Link>
        </div>
      ) : null}
    </>
  );
}
