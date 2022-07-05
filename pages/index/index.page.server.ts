// /pages/star-wars/movie.page.server.js
// Environment: Node.js

import { PageContext } from "../../renderer/types"
import { Client } from "@notionhq/client";
import { config } from "dotenv";
import { notion } from "../../server/notion";

export async function onBeforeRender(pageContext: PageContext) {
    const database = await notion.databases.query({
        database_id: '471754e3c7fd4ad6b97b2637bdf1f6ae'
    })
    const data = database.results.map(result => ({
        title: result.properties.Name.title[0]?.text.content
    }))

  // We make `pageProps` available as `pageContext.pageProps`
  return {
    pageContext: {
      pageProps: {
        keks: data
      }
    }
  }
}

// By default `pageContext.*` are available only on the server. But our hydrate function
// we defined earlier runs in the browser and needs `pageContext.pageProps`; we use
// `passToClient` to tell `vite-plugin-ssr` to serialize and make `pageContext.pageProps`
// available to the browser.
export const passToClient = ['pageProps', "urlPathname"]
