// netlify/edge-functions/handle-404.js
export default async (request, context) => {
  const url = new URL(request.url);
  const path = url.pathname;

  const validRoutes = [
    /^\/$/,
    /^\/kw\/?$/,
    /^\/catalogo\/[^/]+\/?$/,
    /^\/prodotto\/[^/]+\/?$/,
    /^\/not-found\/?$/,
  ];

  // Rotte Vue valide
  if (validRoutes.some((route) => route.test(path))) {
    return; // continua normalmente
  }

  // Risorse statiche: file con estensione o cartelle note
  if (
    path.startsWith("/assets/") ||
    path.startsWith("/fonts/") ||
    path.startsWith("/images/") ||
    /\.[a-zA-Z0-9]+$/.test(path) // qualsiasi file con estensione (js, css, ico, png, ...)
  ) {
    return;
  }

  // Rotta non valida: prendi l'index.html della SPA e cambia lo status
  const response = await context.next();

  return new Response(response.body, {
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