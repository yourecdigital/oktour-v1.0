import React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router-dom/server';
import routes from './routes';
import type { IncomingMessage, ServerResponse } from 'http';
import { StyleRegistry } from './styles/StyleRegistry';

export async function handleRequest(req: IncomingMessage, res: ServerResponse) {
  try {
    const handler = createStaticHandler(routes);
    const context = await handler.query(new Request(`http://${req.headers.host}${req.url}`, { method: req.method }));
    const router = createStaticRouter(handler.dataRoutes, context);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    const stream = renderToPipeableStream(
      <StyleRegistry>
        <StaticRouterProvider router={router} context={context} />
      </StyleRegistry>,
      {
        onShellReady() {
          res.write('<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>'
            + '<link rel="manifest" href="/manifest.webmanifest" />'
            + '</head><body><div id="root">');
          stream.pipe(res, { end: false });
        },
        onAllReady() {
          res.write('</div><script type="module" src="/src/entry.client.tsx"></script></body></html>');
          res.end();
        },
        onError(err) {
          console.error(err);
        }
      }
    );
  } catch (e) {
    res.statusCode = 500;
    res.end('Internal Error');
  }
}




