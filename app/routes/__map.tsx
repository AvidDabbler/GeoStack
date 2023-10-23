import { LoaderArgs, json } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import {
  BoundsUpdate,
  MapComponent,
  StopsLayer,
  mapboxCss,
} from '~/components/Mapbox'
import { MAPBOX_API_KEY } from '~/lib/config.server'
import type { LinksFunction, V2_MetaFunction } from '@remix-run/node' // or cloudflare/deno
import { userAuthorized } from '~/lib/auth'

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'GeoStack Example' },
    {
      property: 'og:title',
      content: 'Building geospatial web apps in Remix and PostGres',
    },
  ]
}

export async function loader() {
  if (!userAuthorized()) throw Error('USER NOT ALLOWED')

  const bounds = [
    [-90.514641, 38.490144],
    [-89.995537, 38.713108],
  ] as [[number, number], [number, number]]

  return json({
    MAPBOX_API_KEY,
    bounds,
  })
}

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: mapboxCss }]
}

export default function Index() {
  const { MAPBOX_API_KEY, bounds } = useLoaderData<typeof loader>()
  return (
    <MapComponent
      className="h-full w-full bg-gray-500"
      MAPBOX_API_KEY={MAPBOX_API_KEY}
      options={{ bounds }}
      initState={{
        layers: {},
        sources: {},
      }}
    >
      <BoundsUpdate />
      <StopsLayer />
      <Outlet />
    </MapComponent>
  )
}
