import { json } from '@remix-run/node'
import { database, tables } from 'drizzle'
import { and, isNotNull } from 'drizzle-orm'
import { SourceDataType } from '~/components/Mapbox'
import { MapSources } from '~/config.map'
import { userAuthorized } from '~/lib/auth'

export async function loader() {
  if (!userAuthorized()) throw new Error('USER IS NOT AUTHORIZED')

  const stops = await database
    .select()
    .from(tables.stops)
    .where(
      and(
        isNotNull(tables.stops.stopLat),
        isNotNull(tables.stops.stopLon),
        isNotNull(tables.stops.stopId),
      ),
    )
  const features = stops.map((stop) => {
    const { stopLat, stopLon, ...properties } = stop
    return {
      type: 'Feature',
      properties: {
        stop_id: properties.stopId ?? '',
      },
      geometry: {
        type: 'Point',
        coordinates: [stopLon, stopLat],
      },
    }
  })

  return json({
    stopsSource: {
      id: MapSources.stopsSource,
      name: MapSources.stopsSource,
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features,
      },
    } as SourceDataType & { name: string; id: string },
  })
}
