// /pages/star-wars/movie.page.server.js
// Environment: Node.js

import { PageContext } from "../../renderer/types"

export async function onBeforeRender(pageContext: PageContext) {
  // We make `pageProps` available as `pageContext.pageProps`
  return {
    pageContext: {
      pageProps: {
        time: new Date().toISOString()
      }
    }
  }
}

// By default `pageContext.*` are available only on the server. But our hydrate function
// we defined earlier runs in the browser and needs `pageContext.pageProps`; we use
// `passToClient` to tell `vite-plugin-ssr` to serialize and make `pageContext.pageProps`
// available to the browser.
export const passToClient = ['pageProps']
