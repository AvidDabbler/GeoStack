import {
  MutableRefObject,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  useCallback,
} from 'react'
import {
  FeatureCollection,
  LineString,
  MultiLineString,
  MultiPoint,
  MultiPolygon,
  Point,
  Polygon,
} from 'geojson'
import mapboxgl, {
  CircleLayer,
  FillLayer,
  GeoJSONSource,
  GeoJSONSourceRaw,
  LineLayer,
  Map,
  MapboxOptions,
  SymbolLayer,
} from 'mapbox-gl'
import mapboxCss from 'mapbox-gl/dist/mapbox-gl.css'
import { z } from 'zod'
import { zJsonCheck } from '~/lib/zod'
import debounce from 'lodash/debounce'
import axios from 'axios'
import { LayerStyles, MapLayerOrder, MapLayers, MapSources } from '~/config.map'
import { useEffectOnce } from '~/lib/hooks'

export { mapboxCss }
export type SourceType = { id: string; data: GeoJSONSourceRaw['data'] }
export type Await<T extends (...args: any) => unknown> = Awaited<ReturnType<T>>

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

type GeoJsonType = {
  id: string
  name: string
  type: string
}

type PointType = GeoJsonType & {
  data: FeatureCollection<Point>
}

type LineType = GeoJsonType & {
  data: FeatureCollection<LineString>
}

type PolygonType = GeoJsonType & {
  data: FeatureCollection<Polygon>
}

type MultiPointType = GeoJsonType & {
  data: FeatureCollection<MultiPoint>
}

type MultiLineType = GeoJsonType & {
  data: FeatureCollection<MultiLineString>
}

type MultiPolygonType = GeoJsonType & {
  data: FeatureCollection<MultiPolygon>
}

export type SourceDataType =
  | PointType
  | LineType
  | PolygonType
  | MultiPointType
  | MultiLineType
  | MultiPolygonType

export type MapStateType = {
  sources: { [k: string]: SourceDataType }
  layers: {
    [k: string]: LayerType
  }
}

export type MapBoxStoreFunctions = {
  addSource: (source: SourceDataType) => void
  removeSource: (sourceId: keyof SourceDataType) => void
  addLayer: (layer: LayerType) => void
  removeLayerByLayerId: (layerId: keyof LayerType) => void
}

export type MapBoxStoreType = MapStateType & MapBoxStoreFunctions

export const MapBoxContext = createContext<MapBoxStore | null>(null)

export const useMapBox = () => {
  const map = useContext(MapBoxContext)
  if (!map) {
    throw new Error('useMap should be used in <Map> child components')
  }
  return map
}

export const useMapBoxStore = (initData: {
  options: Omit<MapboxOptions, 'container'>
  MAPBOX_API_KEY: string
  state: MapStateType
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const [store, setStore] = useState<MapBoxStore | null>(null)
  const { MAPBOX_API_KEY, state, options } = initData

  useEffect(() => {
    if (store) {
      if (options.bounds) store.map.fitBounds(options.bounds, { padding: 20 })
      if (options.center && options.zoom) store.map.setCenter(options.center)
      if (state.sources) {
        for (const [key, source] of Object.entries(state.sources)) {
          const mapSource = store.map.getSource(key) as GeoJSONSource
          if (mapSource) mapSource.setData(source.data)
        }
      }
    }
  }, [state])

  const initialize = useCallback(() => {
    if (mapContainerRef.current && !store?.map) {
      const mapImpl = new MapBoxStore(
        MAPBOX_API_KEY,
        state,
        mapContainerRef,
        options,
        MapLayerOrder,
      )
      setStore(mapImpl)
    }
  }, [mapContainerRef, store?.map, options])

  useEffectOnce(initialize)

  return { mapContainerRef: mapContainerRef, store: store }
}

export class MapBoxStore {
  MAPBOX_API: string
  state: MapStateType
  mapContainerRef: HTMLDivElement
  map: Map
  options: Omit<MapboxOptions, 'container'>
  layerOrder: string[]

  constructor(
    MAPBOX_API_KEY: string,
    initialState: MapStateType,
    mapContainerRef: MutableRefObject<HTMLDivElement | null>,
    options: Omit<MapboxOptions, 'container'>,
    layerOrder: string[],
  ) {
    if (mapContainerRef.current === null)
      throw new Error('mapContainerRef is null')
    mapboxgl.accessToken = MAPBOX_API_KEY
    this.MAPBOX_API = MAPBOX_API_KEY
    this.state = { layers: {}, sources: {} }
    this.mapContainerRef = mapContainerRef.current
    document.createElement('canvas')
    this.options = options
    this.map = new mapboxgl.Map({
      container: mapContainerRef.current,
      fitBoundsOptions: {
        maxZoom: 18,
        padding: { top: 25, bottom: 25, left: 25, right: 25 },
      },
      style: 'mapbox://styles/mapbox/navigation-night-v1', // style URL
      ...options,
    })
    this.map.on('load', () => {
      console.log('initlayers', initialState.layers)
      console.log('initsources', initialState.sources)

      for (const [id, source] of Object.entries(initialState.sources)) {
        if (!this.map.getSource(id)) this.addSourceToState(id, source)
      }
      for (const [id, layer] of Object.entries(initialState.layers)) {
        if (!this.map.getLayer(id)) this.addLayerToState(layer)
      }
    })
    this.layerOrder = layerOrder.reverse()
  }

  addSourceToState(
    id: string,
    source: SourceDataType & { name: string; id: string },
  ) {
    try {
      if (!this.map.getSource(id))
        if (source.type === 'geojson') {
          const { id: _id, name, ...properties } = source
          this.map.addSource(_id, { ...properties, type: 'geojson' })
        } else {
          const mapSource = this.map.getSource(id)
          if (mapSource.type === 'geojson') {
            mapSource.setData(source.data)
          }
        }
      this.state = {
        ...this.state,
        sources: { ...this.state.sources, [source.id]: source },
      }
    } catch (e) {
      console.error(e)
    }
  }
  removeSource(sourceId: keyof SourceDataType) {
    delete this.state.sources[sourceId]
    this.map.removeSource(sourceId)
    const layers = this.state.layers
    Object.values(this.state.layers)
      .filter((layer) => layer.source !== sourceId)
      .forEach((layer) => {
        this.map.removeLayer(layer.id)
        delete this.state.layers[layer.id]
      })
  }

  findBeforeLayerId(layerId: string) {
    const layerIds = Object.keys(this.state.layers)
    if (!layerIds.includes(layerId)) return undefined
    const beforeLayerIds = this.layerOrder.slice(0, layerIds.indexOf(layerId))
    let beforeLayerId = undefined
    for (const _beforeLayerId of beforeLayerIds) {
      if (this.map.getLayer(_beforeLayerId)) beforeLayerId = _beforeLayerId
    }
    return beforeLayerId
  }

  addLayerToState(layer: LayerType, beforeId?: string) {
    try {
      const _beforeId = this.findBeforeLayerId(layer.id)
      if (!this.map.getLayer(layer.id)) {
        const beforeLoaded = _beforeId
          ? this.map.getLayer(_beforeId)
          : undefined
        console.log({ beforeLoaded })
        this.map.addLayer(
          layer,
          beforeLoaded === undefined ? undefined : beforeId,
        )
        this.state.layers[layer.id] = layer
      }
      return {
        ...this.state,
        layers: { ...this.state.layers, ...{ [layer.id]: layer } },
      }
    } catch (e) {
      console.error(e)
    }
  }
  removeLayerByLayerId(layerId: string) {
    const layers = this.state.layers
    delete layers[layerId]
    this.map.removeLayer(layerId)
    return { ...this.state, layers }
  }
}

export const MapComponent = ({
  children,
  MAPBOX_API_KEY,
  initState,
  options,
  className,
}: {
  children?: ReactNode
  MAPBOX_API_KEY: string
  initState: MapStateType
  options: Partial<MapboxOptions>
  className: string
}) => {
  const { store, mapContainerRef } = useMapBoxStore({
    MAPBOX_API_KEY,
    state: initState,
    options,
  })

  return (
    <MapBoxContext.Provider value={store}>
      <div ref={mapContainerRef} className={className}></div>
      {!!store && children}
    </MapBoxContext.Provider>
  )
}

export const BoundsUpdateAction = 'UPDATE_BOUNDS'
export const zBounds = z.array(z.number().array().length(2)).length(2)
export const zBoundsUpdate = zJsonCheck.transform(
  (data) =>
    zBounds.parse(JSON.parse(data)) as [[number, number], [number, number]],
)

export const BoundsUpdate = () => {
  const { map } = useMapBox()

  // Works but it reloads the page
  const postBounds = async (bounds: number[][]) => {
    const postData = {
      _action: BoundsUpdateAction,
      bounds: JSON.stringify(zBounds.parse(bounds)),
    }
    await axios.post('/api/map/update-bounds', axios.toFormData(postData))
  }

  useEffect(() => {
    map.on('moveend', () => {
      try {
        debounce(() => {
          const bounds = map.getBounds().toArray() as [
            [number, number],
            [number, number],
          ]
          postBounds(bounds)
        }, 2500)()
      } catch (e) {
        console.error('Error updating bounds')
      }
    })
  }, [])
  return null
}

export function StopsLayer() {
  const mapbox = useMapBox()
  const getRoutesAndStops = async () => {
    mapbox.map.once('idle', async () => {
      const response = await axios.get('/api/map/stops')

      const { stopsSource } = response.data
      console.log({ stopsSource })

      mapbox.addSourceToState(
        MapSources.stopsSource,
        stopsSource as SourceDataType,
      )
      mapbox.addLayerToState(LayerStyles.stopsLayerStyle, MapLayers.points)

      console.log('stops loaded')
    })
  }

  getRoutesAndStops()

  return null
}

export function RoutesLayer() {
  const mapbox = useMapBox()
  const getRoutes = async () => {
    try {
      mapbox.map.once('idle', async () => {
        const response = await axios.get('/api/map/routes')
        console.log(response)

        const { routesSource } = response.data
        mapbox.addSourceToState(
          MapSources.routesSource,
          routesSource as SourceDataType,
        )
        if (mapbox.map.getLayer(MapLayers.stopsLayer))
          mapbox.addLayerToState(
            LayerStyles.routesLayerStyle,
            MapLayers.stopsLayer,
          )
        else mapbox.addLayerToState(LayerStyles.routesLayerStyle)

        console.log('routes loaded')
      })
    } catch (e) {
      console.error(e)
    }
  }

  getRoutes()

  return null
}
