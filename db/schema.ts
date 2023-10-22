import {
  pgTable,
  integer,
  text,
  timestamp,
  serial,
  index,
  doublePrecision,
  primaryKey,
  uniqueIndex,
  customType,
} from 'drizzle-orm/pg-core'

const ltree = customType<{ data: string }>({
  dataType() {
    return 'ltree'
  },
})

export const stops = pgTable(
  'stops',
  {
    stopId: text('stop_id').primaryKey().notNull(),
    stopCode: text('stop_code'),
    stopName: text('stop_name').notNull(),
    ttsStopName: text('tts_stop_name'),
    stopDesc: text('stop_desc').default(''),
    stopLat: doublePrecision('stop_lat'),
    stopLon: doublePrecision('stop_lon'),
    zoneId: text('zone_id'),
    stopUrl: text('stop_url'),
    locationType: integer('location_type'),
    parentStation: text('parent_station'),
    stopTimezone: text('stop_timezone'),
    wheelchairBoarding: integer('wheelchair_boarding'),
    levelId: text('level_id'),
    platformCode: text('platform_code'),
    updatedAt: timestamp('updatedAt', {
      precision: 3,
      mode: 'string',
    }).notNull(),
    // TODO: failed to parse database type 'geometry(Point,4326)'
    geom: ltree('geom').notNull(),
    agencyId: integer('agencyId'),
  },
  (table) => {
    return {
      idxStopsParentStation: index('idx_stops_parent_station').on(
        table.parentStation,
      ),
      idx: index('stops_idx').on(table.geom),
      stopIdTcAgencyIdKey: uniqueIndex('stops_stop_id_tc_agency_id_key'),
    }
  },
)

export const shapesGeos = pgTable(
  'shapesGeos',
  {
    shapeId: text('shape_id').notNull(),
    updatedAt: timestamp('updatedAt', {
      precision: 3,
      mode: 'string',
    }).notNull(),
    // TODO: failed to parse database type 'geometry(LineString,4326)'
    geom: ltree('geom').notNull(),
    agencyId: integer('agencyId'),
  },
  (table) => {
    return {
      shapeGeomIdx: index('shape_geom_idx').on(table.geom),
    }
  },
)

export const shapes = pgTable(
  'shapes',
  {
    id: serial('id').primaryKey().notNull(),
    shapeId: text('shape_id').notNull(),
    shapePtLat: doublePrecision('shape_pt_lat').notNull(),
    shapePtLon: doublePrecision('shape_pt_lon').notNull(),
    shapePtSequence: integer('shape_pt_sequence').notNull(),
    shapeDistTraveled: doublePrecision('shape_dist_traveled'),
    updatedAt: timestamp('updatedAt', {
      precision: 3,
      mode: 'string',
    }).notNull(),
    agencyId: integer('agencyId'),
  },
  (table) => {
    return {
      idxShapesShapeId: index('idx_shapes_shape_id').on(table.shapeId),
    }
  },
)
