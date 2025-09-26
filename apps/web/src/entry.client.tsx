import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import routes from './routes';

const router = createBrowserRouter(routes, {
  future: {
    v7_fetcherPersist: true,
    v7_partialHydration: true,
  }
});

hydrateRoot(document, <RouterProvider router={router} />);




