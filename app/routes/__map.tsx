import { LoaderArgs, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { BoundsUpdate, MapComponent, RoutesLayer, SourceDataType, SourceType, StopsLayer, mapboxCss } from "~/components/Mapbox";
import { LayerStyles, MapLayers, MapSources } from "~/config.map";
import { MAPBOX_API_KEY } from "~/lib/config.server";
import { getUserSession } from "~/session/session.server";
import { randomPoint } from '@turf/random'
import type { LinksFunction, V2_MetaFunction } from "@remix-run/node"; // or cloudflare/deno
import { userAuthorized } from "~/lib/auth";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Very cool app | Remix" },
    {
      property: "og:title",
      content: "Very cool app",
    },
    {
      name: "description",
      content: "This app is the best",
    },
  ];
};


export async function loader({ request }: LoaderArgs) {
  const { mapSettings, } = await getUserSession(request);

  if (!userAuthorized()) throw Error("USER NOT ALLOWED")

  const features = randomPoint(100, { bbox: [-90.514641, 38.490144, -89.995537, 38.713108] })
  const bounds = [[-90.514641, 38.490144], [-89.995537, 38.713108]] as [[number, number], [number, number]]
  const points = { features, bounds }

  return json({
    MAPBOX_API_KEY,
    bounds: mapSettings.bounds ?? points.bounds, pointFeatures: points.features
  })
}

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: mapboxCss }];
};

export default function Index() {
  const { MAPBOX_API_KEY, pointFeatures, bounds } = useLoaderData<typeof loader>()
  return (
    <MapComponent
      className="h-full w-full bg-gray-500"
      MAPBOX_API_KEY={MAPBOX_API_KEY}
      options={{ bounds }}
      initState={{
        layers: {
          [MapLayers.points]: LayerStyles.pointsLayerStyle,
          [MapLayers.pointsCluster]:
            LayerStyles.pointsClusterLayerStyle,
          [MapLayers.pointsClusterCount]:
            LayerStyles.pointsClusterCountLayerStyle,
        },
        sources: {
          [MapSources.points]: {
            data: pointFeatures, id: MapSources.points,
            name: MapSources.points,
            type: "geojson",
            cluster: true,
            clusterMaxZoom: 14, // Max zoom to cluster points on
            clusterRadius: 20
          } as SourceDataType,
        },
      }}
    >
      <BoundsUpdate />
      <StopsLayer />
      <RoutesLayer />
      <Outlet />
    </MapComponent>
  )
}
