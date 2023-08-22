import { json } from "@remix-run/node"
import { randomPoint } from '@turf/random'
import { SourceDataType } from "~/components/Mapbox"
import { MapSources } from "~/config.map"
import { userAuthorized } from "~/lib/auth"

export async function loader() {
  if (!userAuthorized()) throw new Error("USER IS NOT AUTHORIZED")
  const features = randomPoint(70, { bbox: [-90.514641, 38.490144, -89.995537, 38.713108] })
  return json({
    stopsSource: {
      id: MapSources.stopsSource,
      name: MapSources.stopsSource,
      type: "geojson",
      data: features
    } as SourceDataType & { name: string; id: string }
  })
}