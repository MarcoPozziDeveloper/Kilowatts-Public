export default async (request, context) => {
  const path = new URL(request.url).pathname;

  const validRoutes = [
    /^\/$/,
    /^\/kw\/?$/,
    /^\/catalogo\/[^/]+\/?$/,
    /^\/prodotto\/[^/]+\/?$/,
  ];

  if (validRoutes.some((r) => r.test(path))) return;
  if (/\.[a-zA-Z0-9]+$/.test(path)) return; // file statici, incluso /404.html

  const res = await context.rewrite("/404.html");
  return new Response(res.body, {
    status: 404,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
};

export const config = { path: "/*" };