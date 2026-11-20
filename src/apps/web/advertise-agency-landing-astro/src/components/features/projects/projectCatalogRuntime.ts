// Save the filtered project catalog location before opening a project article.

function rememberCatalogReturn(event: MouseEvent): void {
  if (!(event.target instanceof Element)) {
    return;
  }
  const link = event.target.closest<HTMLAnchorElement>("[data-project-link]");
  if (!link) {
    return;
  }
  try {
    sessionStorage.setItem(
      "project-catalog-return",
      `${window.location.pathname}${window.location.search}#catalog-results`,
    );
  } catch {
    // Storage can be unavailable; the article retains its static fallback.
  }
}

if (typeof document !== "undefined") {
  document.addEventListener("click", rememberCatalogReturn);
}

export {};
