import { createElement } from 'react'
import type { RouteObject } from 'react-router-dom'
import StaticPage from './components/StaticPage'
import { STATIC_PAGE_KEYS, STATIC_PAGE_PATHS, type StaticPageKey } from './constants/staticPage.constants'

function createStaticPageRoute(pageKey: StaticPageKey): RouteObject {
  return {
    path: STATIC_PAGE_PATHS[pageKey],
    Component: function StaticPageRoute() {
      return createElement(StaticPage, { pageKey })
    },
  }
}

export const customerContentRoutes: RouteObject[] = STATIC_PAGE_KEYS.map(createStaticPageRoute)
