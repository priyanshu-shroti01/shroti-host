const THEME_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var theme = stored === "light" || stored === "dark" ? stored : "dark";
    document.documentElement.setAttribute("data-theme", theme);
    if (theme === "light") { var m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute("content", "#ffffff"); }
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();
`;

/**
 * Dark is the brand default — the premium neon-on-black look both design
 * references lead with. An explicit user choice (theme toggle) still wins
 * via localStorage; system preference no longer overrides the brand
 * default.
 */
export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />;
}
