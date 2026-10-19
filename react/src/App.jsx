
function PublicHeader({ nav, active }) {
  return (
    <header className="pub-header">
      <div
        className="pub-brand"
        onClick={() => nav("home")}
        role="button"
        tabIndex={0}
      >
        <img
          src="/rosemont-logo.png"
          alt="Rosemont Hills Montessori College"
          className="pub-crest"
        />
        <span className="brand-divider" />
        <span className="pub-logo">
          Room<span>Ease</span>
        </span>
      </div>

      <nav className="pub-nav">
        <button
          className={`pub-navlink${
            active === "home" ? " pub-navlink--active" : ""
          }`}
          onClick={() => nav("home")}
        >
          Home
        </button>

        <button
          className={`pub-navlink${
            active === "about" ? " pub-navlink--active" : ""
          }`}
          onClick={() => nav("about")}
        >
          About
        </button>

        <button
          className="pub-navlink"
          onClick={() => nav("login")}
        >
          Login
        </button>

        <button
          className="pub-cta"
          onClick={() => nav("register")}
        >
          Register
        </button>
      </nav>
    </header>
  );
}
