
const VALID_ROUTES = [
  /^\/$/,
  /^\/kw\/?$/,
  /^\/catalogo\/[^/]+\/?$/,
  /^\/prodotto\/[^/]+\/?$/,
];

export default async (request) => {
  const url = new URL(request.url);
  const path = decodeURIComponent(url.pathname);

  // Lascia passare le rotte Vue valide
  if (VALID_ROUTES.some((route) => route.test(path))) {
    return;
  }

  // Lascia gestire a Netlify le risorse statiche
  if (
    path.startsWith("/assets/") ||
    path.startsWith("/fonts/") ||
    path.startsWith("/images/") ||
    path.startsWith("/favicon")
  ) {
    return;
  }

  // Recupera index.html per visualizzare NotFoundView
  const response = await fetch(new URL("/index.html", request.url));

  return new Response(response.body, {
    status: 404,
    headers: response.headers,
  });
};

export const config = {
  path: "/*",
};
