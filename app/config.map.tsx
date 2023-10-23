import { CircleLayer, FillLayer, LineLayer, SymbolLayer } from 'mapbox-gl'

type CircleLayerType = CircleLayer & {
  name: string
}

type FillLayerType = FillLayer & {
  name: string
  source: string
}

type LineLayerType = LineLayer & {
  name: string
  source: string
}

export type LayerType =
  | CircleLayerType
  | FillLayerType
  | LineLayerType
  | SymbolLayer

export const MapSources = {
  points: 'points',
  routesSource: 'routes-source',
  stopsSource: 'stops-source',
}

export const MapLayers = {
  points: 'points',
  routesLayer: 'routes-layer',
  stopsLayer: 'stops-layer',
  pointsCluster: 'points-cluster',
  pointsClusterCount: 'points-cluster-count',
}

export const MapLayerOrder = [
  MapLayers.pointsClusterCount,
  MapLayers.pointsCluster,
  MapLayers.points,
  MapLayers.stopsLayer,
  MapLayers.routesLayer,
]

const pointsLayerStyle = {
  id: MapLayers.points,
  name: MapLayers.points,
  source: MapSources.points,
  type: 'circle',
  filter: ['!', ['has', 'point_count']],
  paint: {
    'circle-color': 'blue',
    'circle-radius': {
      stops: [
        [6, 8],
        [12, 8],
      ],
    },
    'circle-stroke-color': 'gray',
    'circle-stroke-width': {
      stops: [
        [5, 0],
        [8, 1],
        [10, 1],
      ],
    },
  },
} as LayerType

const pointsClusterLayerStyle = {
  id: MapLayers.pointsCluster,
  name: MapLayers.pointsCluster,
  source: MapSources.points,
  type: 'circle',
  filter: ['has', 'point_count'],
  layout: {
    'circle-sort-key': 6,
  },
  paint: {
    'circle-color': 'blue',
    'circle-stroke-color': 'white',
    'circle-stroke-width': 2,
    'circle-radius': 20,
  },
} as LayerType

const pointsClusterCountLayerStyle = {
  id: MapLayers.pointsClusterCount,
  type: 'symbol',
  source: MapSources.points,
  name: MapLayers.pointsClusterCount,
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['Arial Unicode MS Bold'],
    'text-size': 16,
    'text-allow-overlap': true,
  },
  paint: {
    'text-color': '#ffffff',
  },
} as LayerType

const routesLayerStyle = {
  id: MapLayers.routesLayer,
  type: 'line',
  source: MapSources.routesSource,
  name: MapLayers.routesLayer,
  paint: {
    'line-color': 'white', // Set the color to royal blue
    'line-width': {
      stops: [
        [1, 2],
        [12, 3],
        [15, 3],
      ],
    },
  },
} as LayerType

const stopsLayerStyle = {
  id: MapLayers.stopsLayer,
  source: MapSources.stopsSource,
  name: MapLayers.stopsLayer,
  type: 'circle',
  paint: {
    'circle-color': '#f15a24',
    'circle-radius': {
      stops: [
        [10, 8],
        [14, 4],
        [20, 6],
      ],
    },
    'circle-stroke-color': 'black',
    'circle-stroke-width': {
      stops: [[14, 1]],
    },
  },
} as LayerType

export const LayerStyles = {
  pointsLayerStyle,
  pointsClusterLayerStyle,
  pointsClusterCountLayerStyle,
  routesLayerStyle,
  stopsLayerStyle,
}

