// /pages/star-wars/movie.page.server.js
// Environment: Node.js

import { PageContext } from "../../renderer/types"
import { notion, UnknownBlocks } from "../../server/notion";
import { renderVueBlocks } from "../../server/vue-notion";


export async function onBeforeRender(pageContext: PageContext) {
    const pageId = '7002e8cacc504ba496d89d5fe3d5434b'
    // const database = await notion.databases.query({
    //     database_id: '471754e3c7fd4ad6b97b2637bdf1f6ae'
    // })
    // const data = database.results.map(result => ({
    //     title: result.properties.Name.title[0]?.text.content
    // }))

    // const page = await notion.pages.retrieve({page_id: pageId})
    const blocks = (await notion.blocks.children.list({block_id: pageId})).results as UnknownBlocks
    // console.log(JSON.stringify(blocks))

  // We make `pageProps` available as `pageContext.pageProps`
  return {
    pageContext: {
      pageProps: {
        content: (await renderVueBlocks(blocks, './public/generated', '/generated/')).filter(block => block)
      }
    }
  }
}

// By default `pageContext.*` are available only on the server. But our hydrate function
// we defined earlier runs in the browser and needs `pageContext.pageProps`; we use
// `passToClient` to tell `vite-plugin-ssr` to serialize and make `pageContext.pageProps`
// available to the browser.
export const passToClient = ['pageProps', "urlPathname"]
