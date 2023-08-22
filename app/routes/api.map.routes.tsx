import { json } from "@remix-run/node"
import { randomLineString } from '@turf/random'
import { SourceDataType } from "~/components/Mapbox"
import { MapSources } from "~/config.map"
import { userAuthorized } from "~/lib/auth"

export async function loader() {
  if (!userAuthorized()) throw new Error("USER IS NOT AUTHORIZED")
  const features = randomLineString(20, { bbox: [-90.514641, 38.490144, -89.995537, 38.713108], num_vertices: 3000 })
  return json({
    routesSource: {
      id: MapSources.routesSource,
      name: MapSources.routesSource,
      type: "geojson",
      data: features
    } as SourceDataType & { name: string; id: string }
  })
}