
export default async (request) => {
  const url = new URL(request.url);
  const path = url.pathname;

  const validRoutes = [
    /^\/$/,
    /^\/kw\/?$/,
    /^\/catalogo\/[^/]+\/?$/,
    /^\/prodotto\/[^/]+\/?$/,
  ];

  // Rotte Vue valide
  if (validRoutes.some((route) => route.test(path))) {
    return;
  }

  // Risorse statiche
  if (
    path.startsWith("/assets/") ||
    path.startsWith("/fonts/") ||
    path.startsWith("/images/") ||
    path === "/favicon.ico"
  ) {
    return;
  }

  // Recupera l'HTML originale
  const response = await fetch(
    new URL("/index.html", request.url)
  );

  return new Response(await response.text(), {
    status: 404,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
};

export const config = {
  path: "/*",
};
 