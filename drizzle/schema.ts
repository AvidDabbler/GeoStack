import {
  pgTable,
  pgEnum,
  integer,
  text,
  varchar,
  uniqueIndex,
  uuid,
  json,
  timestamp,
  boolean,
  foreignKey,
  serial,
  index,
  doublePrecision,
  primaryKey,
} from 'drizzle-orm/pg-core'
import { customType } from 'drizzle-orm/pg-core'
import { InferModel, sql } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import z from 'zod'

export const role = pgEnum('Role', [
  'CALLCENTER',
  'USER',
  'MANAGER',
  'ADMIN',
  'SUPERADMIN',
  'TC_STAFF',
])
export type Role =
  | 'CALLCENTER'
  | 'USER'
  | 'MANAGER'
  | 'ADMIN'
  | 'SUPERADMIN'
  | 'TC_STAFF'

const ltree = customType<{ data: string }>({
  dataType() {
    return 'ltree'
  },
})

export const geographyColumns = pgTable('geography_columns', {
  // TODO: failed to parse database type 'name'

  fTableCatalog: text('f_table_catalog').notNull(),
  // TODO: failed to parse database type 'name'

  fTableSchema: text('f_table_schema').notNull(),
  // TODO: failed to parse database type 'name'

  fTableName: text('f_table_name').notNull(),
  // TODO: failed to parse database type 'name'

  fGeographyColumn: text('f_geography_column').notNull(),
  coordDimension: integer('coord_dimension'),
  srid: integer('srid'),
  type: text('type'),
})

export const geometryColumns = pgTable('geometry_columns', {
  fTableCatalog: varchar('f_table_catalog', { length: 256 }),
  // TODO: failed to parse database type 'name'

  fTableSchema: text('f_table_schema').notNull(),
  // TODO: failed to parse database type 'name'

  fTableName: text('f_table_name').notNull(),
  // TODO: failed to parse database type 'name'

  fGeometryColumn: text('f_geometry_column').notNull(),
  coordDimension: integer('coord_dimension'),
  srid: integer('srid'),
  type: varchar('type', { length: 30 }),
})

export const spatialRefSys = pgTable('spatial_ref_sys', {
  srid: integer('srid').primaryKey().notNull(),
  authName: varchar('auth_name', { length: 256 }),
  authSrid: integer('auth_srid'),
  srtext: varchar('srtext', { length: 2048 }),
  proj4Text: varchar('proj4text', { length: 2048 }),
})

export const agency = pgTable('agency', {
  id: serial('id').primaryKey().notNull(),
  tcAgencyId: text('tc_agency_id').notNull(),
  agencyId: text('agency_id'),
  agencyName: text('agency_name').notNull(),
  agencyUrl: text('agency_url').notNull(),
  agencyTimezone: text('agency_timezone').notNull(),
  agencyLang: text('agency_lang'),
  agencyPhone: text('agency_phone'),
  agencyFareUrl: text('agency_fare_url'),
  agencyEmail: text('agency_email'),
  updatedAt: timestamp('updatedAt', { precision: 3, mode: 'string' })
    .defaultNow()
    .notNull(),
  userIds: text('userIds').array(),
})
export type Agency = InferModel<typeof agency> // return type when queried
export const zInsertAgency = createInsertSchema(agency)
export type ZInsertAgency = z.infer<typeof zInsertAgency>
export const zSelectAgency = createSelectSchema(agency)
export type ZSelectAgency = z.infer<typeof zSelectAgency>

export const calendarDates = pgTable(
  'calendarDates',
  {
    tcAgencyId: text('tc_agency_id')
      .notNull()
      .references(() => agency.tcAgencyId, { onDelete: 'cascade' }),
    id: serial('id').primaryKey().notNull(),
    serviceId: text('service_id').notNull(),
    date: integer('date').notNull(),
    exceptionType: integer('exception_type').notNull(),
    holidayName: text('holiday_name'),
    updatedAt: timestamp('updatedAt', {
      precision: 3,
      mode: 'string',
    }).notNull(),
  },
  (table) => {
    return {
      idxCalendarDatesExceptionType: index(
        'idx_calendar_dates_exception_type',
      ).on(table.exceptionType),
      idxCalendarDatesDate: index('idx_calendar_dates_date').on(table.date),
      idxCalendarDatesServiceId: index('idx_calendar_dates_service_id').on(
        table.serviceId,
      ),
    }
  },
)
export type CalendarDates = InferModel<typeof calendarDates> // return type when queried
export const zInsertCalendarDates = createInsertSchema(calendarDates)
export type ZInsertCalendarDates = z.infer<typeof zInsertCalendarDates>
export const zSelectCalendarDates = createSelectSchema(calendarDates)
export type ZSelectCalendarDates = z.infer<typeof zSelectCalendarDates>

export const directions = pgTable(
  'directions',
  {
    tcAgencyId: text('tc_agency_id')
      .notNull()
      .references(() => agency.tcAgencyId, { onDelete: 'cascade' }),
    id: serial('id').primaryKey().notNull(),
    routeId: text('route_id').notNull(),
    directionId: integer('direction_id'),
    direction: text('direction').notNull(),
    updatedAt: timestamp('updatedAt', {
      precision: 3,
      mode: 'string',
    }).notNull(),
    agencyId: integer('agencyId'),
  },
  (table) => {
    return {
      idxDirectionsDirectionId: index('idx_directions_direction_id').on(
        table.directionId,
      ),
      idxDirectionsRouteId: index('idx_directions_route_id').on(table.routeId),
    }
  },
)
export type Directions = InferModel<typeof directions> // return type when queried
export const zInsertDirections = createInsertSchema(directions)
export type ZInsertDirections = z.infer<typeof zInsertDirections>
export const zSelectDirections = createSelectSchema(directions)
export type ZSelectDirections = z.infer<typeof zSelectDirections>

export const routes = pgTable('routes', {
  agency_id: text('agency_id'),
  tcAgencyId: text('tc_agency_id')
    .notNull()
    .references(() => agency.tcAgencyId, { onDelete: 'cascade' }),
  routeId: text('route_id').primaryKey().notNull(),
  routeShortName: text('route_short_name').notNull(),
  routeLongName: text('route_long_name').notNull(),
  aliasRouteShortName: text('alias_route_short_name'),
  aliasRouteLongName: text('alias_route_long_name'),
  routeDesc: text('route_desc'),
  routeType: integer('route_type').notNull(),
  routeUrl: text('route_url'),
  routeColor: text('route_color'),
  routeTextColor: text('route_text_color'),
  routeSortOrder: integer('route_sort_order'),
  continuousPickup: integer('continuous_pickup'),
  continuousDropOff: integer('continuous_drop_off'),
  networkId: text('network_id'),
  updatedAt: timestamp('updatedAt', { precision: 3, mode: 'string' }).notNull(),
  agencyId: integer('agencyId'),
})
export type Routes = InferModel<typeof routes> // return type when queried
export const zInsertRoutes = createInsertSchema(routes)
export type ZInsertRoute = z.infer<typeof zInsertRoutes>
export const zSelectRoutes = createSelectSchema(routes)
export type ZSelectRoutes = z.infer<typeof zSelectRoutes>

export const shapes = pgTable(
  'shapes',
  {
    id: serial('id').primaryKey().notNull(),
    tcAgencyId: text('tc_agency_id')
      .notNull()
      .references(() => agency.tcAgencyId, { onDelete: 'cascade' }),
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
export type Shapes = InferModel<typeof shapes> // return type when queried
export const insertShapes = createInsertSchema(shapes)
export type InsertShapes = z.infer<typeof insertShapes>
export const selectShapes = createSelectSchema(shapes)
export type SelectShapes = z.infer<typeof selectShapes>

export const trips = pgTable(
  'trips',
  {
    tcAgencyId: text('tc_agency_id')
      .notNull()
      .references(() => agency.tcAgencyId, { onDelete: 'cascade' }),
    routeId: text('route_id').notNull(),
    serviceId: text('service_id').notNull(),
    tripId: text('trip_id').primaryKey().notNull(),
    tripHeadsign: text('trip_headsign'),
    tripShortName: text('trip_short_name'),
    directionId: integer('direction_id'),
    blockId: text('block_id'),
    shapeId: text('shape_id'),
    wheelchairAccessible: integer('wheelchair_accessible'),
    bikesAllowed: integer('bikes_allowed'),
    updatedAt: timestamp('updatedAt', {
      precision: 3,
      mode: 'string',
    }).notNull(),
    agencyId: integer('agencyId'),
    tCagencyId: uuid('tCAgencyId').references(() => tcAgency.id, {
      onDelete: 'set null',
      onUpdate: 'cascade',
    }),
  },
  (table) => {
    return {
      idxTripsShapeId: index('idx_trips_shape_id').on(table.shapeId),
      idxTripsBlockId: index('idx_trips_block_id').on(table.blockId),
      idxTripsDirectionId: index('idx_trips_direction_id').on(
        table.directionId,
      ),
      idxTripsServiceId: index('idx_trips_service_id').on(table.serviceId),
      idxTripsRouteId: index('idx_trips_route_id').on(table.routeId),
      tripsTcAgencyIdRouteIdFkey: foreignKey({
        columns: [table.tcAgencyId, table.routeId],
        foreignColumns: [routes.tcAgencyId, routes.routeId],
      })
        .onUpdate('cascade')
        .onDelete('restrict'),
      tripsShapesGeo: foreignKey({
        columns: [table.tcAgencyId, table.shapeId],
        foreignColumns: [shapesGeos.tcAgencyId, shapesGeos.shapeId],
      }),
    }
  },
)
export type Trips = InferModel<typeof trips> // return type when queried
export const zInsertTrips = createInsertSchema(trips)
export type ZInsertTrips = z.infer<typeof zInsertTrips>
export const zSelectTrips = createSelectSchema(trips)
export type ZSelectTrips = z.infer<typeof zSelectTrips>

export const calendar = pgTable(
  'calendar',
  {
    id: uuid('id')
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    tcAgencyId: text('tc_agency_id')
      .notNull()
      .references(() => agency.tcAgencyId, { onDelete: 'cascade' }),
    serviceId: text('service_id').notNull(),
    monday: integer('monday').notNull(),
    tuesday: integer('tuesday').notNull(),
    wednesday: integer('wednesday').notNull(),
    thursday: integer('thursday').notNull(),
    friday: integer('friday').notNull(),
    saturday: integer('saturday').notNull(),
    sunday: integer('sunday').notNull(),
    endDate: integer('end_date').notNull(),
    startDate: integer('start_date').notNull(),
    updatedAt: timestamp('updatedAt', {
      precision: 3,
      mode: 'string',
    }).notNull(),
  },
  (table) => {
    return {
      idKey: uniqueIndex('calendar_id_key').on(table.id),
      idxCalendarEndDate: index('idx_calendar_end_date').on(table.endDate),
      idxCalendarStartDate: index('idx_calendar_start_date').on(
        table.startDate,
      ),
      serviceIdTcAgencyIdKey: uniqueIndex(
        'calendar_service_id_tc_agency_id_key',
      ).on(table.tcAgencyId, table.serviceId),
    }
  },
)
export type Calendar = InferModel<typeof calendar> // return type when queried
export const zInsertCalendar = createInsertSchema(calendar)
export const zSelectCalendar = createSelectSchema(calendar)
export type ZSelectCalendar = z.infer<typeof zSelectCalendar>
export type ZInsertCalendar = z.infer<typeof zInsertCalendar>

export const stopTimes = pgTable(
  'stopTimes',
  {
    tcAgencyId: text('tc_agency_id')
      .notNull()
      .references(() => agency.tcAgencyId, { onDelete: 'cascade' }),
    id: serial('id').primaryKey().notNull(),
    tripId: text('trip_id').notNull(),
    arrivalTime: text('arrival_time'),
    arrivalTimestamp: integer('arrival_timestamp'),
    departureTime: text('departure_time'),
    departureTimestamp: integer('departure_timestamp'),
    stopId: text('stop_id').notNull(),
    stopSequence: integer('stop_sequence').notNull(),
    stopHeadsign: text('stop_headsign'),
    pickupType: integer('pickup_type'),
    dropOffType: integer('drop_off_type').default(0),
    continuousPickup: integer('continuous_pickup'),
    continuousDropOff: integer('continuous_drop_off'),
    shapeDistTraveled: doublePrecision('shape_dist_traveled'),
    timepoint: integer('timepoint'),
    updatedAt: timestamp('updatedAt', {
      precision: 3,
      mode: 'string',
    }).notNull(),
    agencyId: integer('agencyId'),
  },
  (table) => {
    return {
      idxStopTimesStopSequence: index('idx_stop_times_stop_sequence').on(
        table.stopSequence,
      ),
      idxStopTimesDepartureTimestamp: index(
        'idx_stop_times_departure_timestamp',
      ).on(table.departureTimestamp),
      idxStopTimesArrivalTimestamp: index(
        'idx_stop_times_arrival_timestamp',
      ).on(table.arrivalTimestamp),
      idxStopTimesTripId: index('idx_stop_times_trip_id').on(table.tripId),
      stopTimesTcAgencyIdTripIdFkey: foreignKey({
        columns: [table.tcAgencyId, table.tripId],
        foreignColumns: [trips.tcAgencyId, trips.tripId],
      }).onDelete('cascade'),
    }
  },
)
export type StopTimes = InferModel<typeof stopTimes> // return type when queried
export const zInsertStopTimes = createInsertSchema(stopTimes)
export const zSelectStopTimes = createSelectSchema(stopTimes)
export type ZSelectStopTimes = z.infer<typeof zSelectStopTimes>
export type ZInsertStopTimes = z.infer<typeof zInsertStopTimes>

export const tripUpdates = pgTable(
  'tripUpdates',
  {
    tcAgencyId: text('tc_agency_id')
      .notNull()
      .references(() => agency.tcAgencyId, { onDelete: 'cascade' }),
    updateId: text('update_id').primaryKey().notNull(),
    vehicleId: text('vehicle_id'),
    tripId: text('trip_id'),
    startDate: text('start_date'),
    timestamp: text('timestamp'),
    isUpdated: integer('isUpdated').default(1).notNull(),
    updatedAt: timestamp('updatedAt', {
      precision: 3,
      mode: 'string',
    }).notNull(),
    tripsTripId: text('tripsTrip_id').references(() => trips.tripId),
    vehiclesId: uuid('vehiclesId').references(() => vehicles.id),
    agencyId: integer('agencyId'),
    tCagencyId: uuid('tCAgencyId').references(() => tcAgency.id, {
      onDelete: 'set null',
      onUpdate: 'cascade',
    }),
  },
  (table) => {
    return {
      idxTripUpdatesTripId: index('idx_trip_updates_trip_id').on(table.tripId),
      idxTripUpdatesVehicleId: index('idx_trip_updates_vehicle_id').on(
        table.vehicleId,
      ),
      idxTripUpdatesUpdateId: index('idx_trip_updates_update_id').on(
        table.updateId,
      ),
    }
  },
)
export type TripUpdates = InferModel<typeof tripUpdates> // return type when queried
export const zInsertTripUpdates = createInsertSchema(tripUpdates)
export const zSelectTripUpdates = createSelectSchema(tripUpdates)
export type ZSelectTripUpdates = z.infer<typeof zSelectTripUpdates>
export type ZInsertTripUpdates = z.infer<typeof zInsertTripUpdates>

export const vehicles = pgTable(
  'Vehicles',
  {
    id: uuid('id')
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    tcAgencyId: text('tc_agency_id')
      .notNull()
      .references(() => agency.tcAgencyId, { onDelete: 'cascade' }),
    agency_id: text('agency_id').notNull(),
    vehicleId: text('vehicle_id').notNull(),
    tripId: text('trip_id')
      .notNull()
      .references(() => trips.tripId),
    routeId: text('route_id')
      .notNull()
      .references(() => routes.routeId),
    longitude: doublePrecision('longitude').notNull(),
    latitude: doublePrecision('latitude').notNull(),
    updatedAt: timestamp('updatedAt', { precision: 3, mode: 'string' })
      .defaultNow()
      .notNull(),
    createdAt: timestamp('createdAt', { precision: 3, mode: 'string' })
      .defaultNow()
      .notNull(),
    agencyId: integer('agencyId'),
    tCagencyId: uuid('tCAgencyId').references(() => tcAgency.id, {
      onDelete: 'set null',
      onUpdate: 'cascade',
    }),
  },
  (table) => {
    return {
      tripIdKey: uniqueIndex('Vehicles_trip_id_key').on(table.tripId),
    }
  },
)
export type Vehicles = InferModel<typeof vehicles> // return type when queried
export const zInsertVehicles = createInsertSchema(vehicles)
export const zSelectVehicles = createSelectSchema(vehicles)
export type ZSelectVehicles = z.infer<typeof zSelectVehicles>
export type ZInsertVehicles = z.infer<typeof zInsertVehicles>

export const stopUpdates = pgTable('stopUpdates', {
  id: uuid('id')
    .default(sql`uuid_generate_v4()`)
    .primaryKey()
    .notNull(),
  tcAgencyId: text('tc_agency_id')
    .notNull()
    .references(() => agency.tcAgencyId, { onDelete: 'cascade' }),
  agency_id: text('agency_id').notNull(),
  stopId: text('stop_id')
    .notNull()
    .references(() => stops.stopId),
  stopSequence: integer('stop_sequence').notNull(),
  tripId: text('trip_id')
    .notNull()
    .references(() => trips.tripId),
  routeId: text('route_id')
    .notNull()
    .references(() => routes.routeId),
  tripStartTime: timestamp('trip_start_time', {
    precision: 3,
    mode: 'string',
  }).notNull(),
  vehicleId: text('vehicle_id')
    .notNull()
    .references(() => vehicles.vehicleId),
  directionId: integer('direction_id').notNull(),
  delay: integer('delay').notNull(),
  delayType: text('delay_type').notNull(),
  createdAt: timestamp('createdAt', { precision: 3, mode: 'string' })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updatedAt', { precision: 3, mode: 'string' })
    .defaultNow()
    .notNull(),
  agencyId: integer('agencyId'),
  tCagencyId: uuid('tCAgencyId').references(() => tcAgency.id, {
    onDelete: 'set null',
    onUpdate: 'cascade',
  }),
})
export type StopUpdates = InferModel<typeof stopUpdates> // return type when queried
export const zInsertStopUpdates = createInsertSchema(stopUpdates)
export const zSelectStopUpdates = createSelectSchema(stopUpdates)
export type ZSelectStopUpdates = z.infer<typeof zSelectStopUpdates>
export type ZInsertStopUpdates = z.infer<typeof zInsertStopUpdates>

export const transfers = pgTable(
  'transfers',
  {
    tcAgencyId: text('tc_agency_id').notNull(),
    id: serial('id').primaryKey().notNull(),
    fromStopId: text('from_stop_id'),
    toStopId: text('to_stop_id'),
    fromRouteId: text('from_route_id'),
    toRouteId: text('to_route_id'),
    fromTripId: text('from_trip_id'),
    toTripId: text('to_trip_id'),
    transferType: integer('transfer_type'),
    minTransferTime: integer('min_transfer_time'),
    updatedAt: timestamp('updatedAt', {
      precision: 3,
      mode: 'string',
    }).notNull(),
    agencyId: integer('agencyId').references(() => agency.id, {
      onDelete: 'set null',
      onUpdate: 'cascade',
    }),
  },
  (table) => {
    return {
      idxTransfersToStopId: index('idx_transfers_to_stop_id').on(
        table.toStopId,
      ),
      idxTransfersFromStopId: index('idx_transfers_from_stop_id').on(
        table.fromStopId,
      ),
    }
  },
)
export type Transfers = InferModel<typeof transfers> // return type when queried
export const zInsertTransfers = createInsertSchema(transfers)
export const zSelectTransfers = createSelectSchema(transfers)
export type ZSelectTransfers = z.infer<typeof zSelectTransfers>
export type ZInsertTransfers = z.infer<typeof zInsertTransfers>

export const stops = pgTable(
  'stops',
  {
    tcAgencyId: text('tc_agency_id')
      .notNull()
      .references(() => agency.tcAgencyId, { onDelete: 'cascade' }),
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
      stopIdTcAgencyIdKey: uniqueIndex('stops_stop_id_tc_agency_id_key').on(
        table.tcAgencyId,
        table.stopId,
      ),
    }
  },
)
export type Stops = InferModel<typeof stops> // return type when queried
export const zInsertStops = createInsertSchema(stops)
export const zSelectStops = createSelectSchema(stops)
export type ZSelectStops = z.infer<typeof zSelectStops>
export type ZInsertStops = z.infer<typeof zInsertStops>

export const areas = pgTable('Areas', {
  tcAgencyId: text('tc_agency_id')
    .notNull()
    .references(() => agency.tcAgencyId, { onDelete: 'cascade' }),
  areaId: text('area_id').primaryKey().notNull(),
  areaName: text('area_name'),
  updatedAt: timestamp('updatedAt', { precision: 3, mode: 'string' }).notNull(),
  agencyId: integer('agencyId'),
})
export type Areas = InferModel<typeof areas> // return type when queried
export const zInsertAreas = createInsertSchema(areas)
export const zSelectAreas = createSelectSchema(areas)
export type ZSelectAreas = z.infer<typeof zSelectAreas>
export type ZInsertAreas = z.infer<typeof zInsertAreas>

export const deadheadTimes = pgTable(
  'deadheadTimes',
  {
    tcAgencyId: text('tc_agency_id')
      .notNull()
      .references(() => agency.tcAgencyId, { onDelete: 'cascade' }),
    id: serial('id').primaryKey().notNull(),
    deadheadId: text('deadhead_id').notNull(),
    arrivalTime: text('arrival_time').notNull(),
    arrivalTimestamp: integer('arrival_timestamp'),
    departureTime: text('departure_time').notNull(),
    departureTimestamp: integer('departure_timestamp'),
    opsLocationId: text('ops_location_id'),
    stopId: text('stop_id'),
    locationSequence: integer('location_sequence').notNull(),
    shapeDistTraveled: doublePrecision('shape_dist_traveled'),
    updatedAt: timestamp('updatedAt', {
      precision: 3,
      mode: 'string',
    }).notNull(),
    agencyId: integer('agencyId'),
  },
  (table) => {
    return {
      idxDeadheadTimesLocationSequence: index(
        'idx_deadhead_times_location_sequence',
      ).on(table.locationSequence),
      idxDeadheadTimesDepartureTimestamp: index(
        'idx_deadhead_times_departure_timestamp',
      ).on(table.departureTimestamp),
      idxDeadheadTimesArrivalTimestamp: index(
        'idx_deadhead_times_arrival_timestamp',
      ).on(table.arrivalTimestamp),
      idxDeadheadTimesDeadheadId: index('idx_deadhead_times_deadhead_id').on(
        table.deadheadId,
      ),
    }
  },
)
export type DeadheadTimes = InferModel<typeof deadheadTimes> // return type when queried
export const zInsertDeadheadTimes = createInsertSchema(deadheadTimes)
export const zSelectDeadheadTimes = createSelectSchema(deadheadTimes)
export type ZSelectDeadheadTimes = z.infer<typeof zSelectDeadheadTimes>
export type ZInsertDeadheadTimes = z.infer<typeof zInsertDeadheadTimes>

export const deadheads = pgTable(
  'deadheads',
  {
    tc_agency_id: text('tc_agency_id')
      .notNull()
      .references(() => agency.tcAgencyId, { onDelete: 'cascade' }),
    deadheadId: text('deadhead_id').primaryKey().notNull(),
    serviceId: text('service_id').notNull(),
    blockId: text('block_id').notNull(),
    shapeId: text('shape_id'),
    toTripId: text('to_trip_id'),
    fromTripId: text('from_trip_id'),
    toDeadheadId: text('to_deadhead_id'),
    fromDeadheadId: text('from_deadhead_id'),
    updatedAt: timestamp('updatedAt', {
      precision: 3,
      mode: 'string',
    }).notNull(),
    tcAgencyId: uuid('tcAgencyId'),
    agencyId: integer('agencyId'),
  },
  (table) => {
    return {
      idxDeadheadsFromDeadheadId: index('idx_deadheads_from_deadhead_id').on(
        table.fromDeadheadId,
      ),
      idxDeadheadsToDeadheadId: index('idx_deadheads_to_deadhead_id').on(
        table.toDeadheadId,
      ),
      idxDeadheadsFromTripId: index('idx_deadheads_from_trip_id').on(
        table.fromTripId,
      ),
      idxDeadheadsToTripId: index('idx_deadheads_to_trip_id').on(
        table.toTripId,
      ),
      idxDeadheadsShapeId: index('idx_deadheads_shape_id').on(table.shapeId),
      idxDeadheadsBlockId: index('idx_deadheads_block_id').on(table.blockId),
    }
  },
)
export type Deadheads = InferModel<typeof deadheads> // return type when queried
export const zInsertDeadheads = createInsertSchema(deadheads)
export const zSelectDeadheads = createSelectSchema(deadheads)
export type ZSelectDeadheads = z.infer<typeof zSelectDeadheads>
export type ZInsertDeadheads = z.infer<typeof zInsertDeadheads>

export const fareAttributes = pgTable('fareAttributes', {
  tcAgencyId: text('tc_agency_id')
    .notNull()
    .references(() => agency.tcAgencyId, { onDelete: 'cascade' }),
  fareId: text('fare_id').primaryKey().notNull(),
  price: doublePrecision('price').notNull(),
  currencyType: text('currency_type').notNull(),
  paymentMethod: integer('payment_method').notNull(),
  transfers: integer('transfers'),
  agency_id: text('agency_id'),
  transferDuration: integer('transfer_duration'),
  updatedAt: timestamp('updatedAt', { precision: 3, mode: 'string' }).notNull(),
  agencyId: integer('agencyId'),
})
export type FareAttributes = InferModel<typeof fareAttributes> // return type when queried
export const zInsertFareAttributes = createInsertSchema(fareAttributes)
export const zSelectFareAttributes = createSelectSchema(fareAttributes)
export type ZSelectFareAttributes = z.infer<typeof zSelectFareAttributes>
export type ZInsertFareAttributes = z.infer<typeof zInsertFareAttributes>

export const fareProducts = pgTable('fareProducts', {
  tcAgencyId: text('tc_agency_id')
    .notNull()
    .references(() => agency.tcAgencyId, { onDelete: 'cascade' }),
  fareProductId: text('fare_product_id').primaryKey().notNull(),
  fareProductName: text('fare_product_name'),
  amount: doublePrecision('amount').notNull(),
  currency: text('currency').notNull(),
  updatedAt: timestamp('updatedAt', { precision: 3, mode: 'string' }).notNull(),
  agencyId: integer('agencyId'),
})
export type FareProducts = InferModel<typeof fareProducts> // return type when queried
export const zInsertFareProducts = createInsertSchema(fareProducts)
export const zSelectFareProducts = createSelectSchema(fareProducts)
export type ZSelectFareProducts = z.infer<typeof zSelectFareProducts>
export type ZInsertFareProducts = z.infer<typeof zInsertFareProducts>

export const fareRules = pgTable('fareRules', {
  tcAgencyId: text('tc_agency_id')
    .notNull()
    .references(() => agency.tcAgencyId, { onDelete: 'cascade' }),
  id: serial('id').primaryKey().notNull(),
  fareId: text('fare_id').notNull(),
  routeId: text('route_id'),
  originId: text('origin_id'),
  destinationId: text('destination_id'),
  containsId: text('contains_id'),
  updatedAt: timestamp('updatedAt', { precision: 3, mode: 'string' }).notNull(),
  agencyId: integer('agencyId'),
})
export type FareRules = InferModel<typeof fareRules> // return type when queried
export const zInsertFareRules = createInsertSchema(fareRules)
export const zSelectFareRules = createSelectSchema(fareRules)
export type ZSelectFareRules = z.infer<typeof zSelectFareRules>
export type ZInsertFareRules = z.infer<typeof zInsertFareRules>

export const feedInfo = pgTable('feedInfo', {
  tcAgencyId: text('tc_agency_id')
    .notNull()
    .references(() => agency.tcAgencyId, { onDelete: 'cascade' }),
  id: serial('id').primaryKey().notNull(),
  feedPublisherName: text('feed_publisher_name').notNull(),
  feedPublisherUrl: text('feed_publisher_url').notNull(),
  feedLang: text('feed_lang').notNull(),
  defaultLang: text('default_lang'),
  feedStartDate: integer('feed_start_date'),
  feedEndDate: integer('feed_end_date'),
  feedVersion: text('feed_version'),
  feedContactEmail: text('feed_contact_email'),
  feedContactUrl: text('feed_contact_url'),
  updatedAt: timestamp('updatedAt', { precision: 3, mode: 'string' }).notNull(),
  agencyId: integer('agencyId'),
})
export type FeedInfo = InferModel<typeof feedInfo> // return type when queried
export const insertFeedInfo = createInsertSchema(feedInfo)
export const selectFeedInfo = createSelectSchema(feedInfo)

export const frequencies = pgTable(
  'frequencies',
  {
    tcAgencyId: text('tc_agency_id')
      .notNull()
      .references(() => agency.tcAgencyId, { onDelete: 'cascade' }),
    id: serial('id').primaryKey().notNull(),
    tripId: text('trip_id').notNull(),
    startTime: text('start_time').notNull(),
    startTimestamp: integer('start_timestamp'),
    endTime: text('end_time').notNull(),
    endTimestamp: integer('end_timestamp'),
    headwaySecs: integer('headway_secs').notNull(),
    exactTimes: integer('exact_times'),
    updatedAt: timestamp('updatedAt', {
      precision: 3,
      mode: 'string',
    }).notNull(),
    agencyId: integer('agencyId'),
  },
  (table) => {
    return {
      idxFrequenciesTripId: index('idx_frequencies_trip_id').on(table.tripId),
    }
  },
)
export type Frequencies = InferModel<typeof frequencies> // return type when queried
export const zInsertFrequencies = createInsertSchema(frequencies)
export const zSelectFrequencies = createSelectSchema(frequencies)
export type ZSelectFrequencies = z.infer<typeof zSelectFrequencies>
export type ZInsertFrequencies = z.infer<typeof zInsertFrequencies>

export const levels = pgTable('Levels', {
  tcAgencyId: text('tc_agency_id')
    .notNull()
    .references(() => agency.tcAgencyId, { onDelete: 'cascade' }),
  levelId: text('level_id').primaryKey().notNull(),
  levelIndex: doublePrecision('level_index').notNull(),
  levelName: text('level_name'),
  updatedAt: timestamp('updatedAt', { precision: 3, mode: 'string' }).notNull(),
  agencyId: integer('agencyId'),
})
export type Levels = InferModel<typeof levels> // return type when queried
export const zInsertLevels = createInsertSchema(levels)
export const zSelectLevels = createSelectSchema(levels)
export type ZSelectLevels = z.infer<typeof zSelectLevels>
export type ZInsertLevels = z.infer<typeof zInsertLevels>

export const opsLocations = pgTable('opsLocations', {
  tcAgencyId: text('tc_agency_id')
    .notNull()
    .references(() => agency.tcAgencyId, { onDelete: 'cascade' }),
  opsLocationId: text('ops_location_id').primaryKey().notNull(),
  opsLocationCode: text('ops_location_code'),
  opsLocationName: text('ops_location_name').notNull(),
  opsLocationDesc: text('ops_location_desc'),
  opsLocationLat: doublePrecision('ops_location_lat').notNull(),
  opsLocationLon: doublePrecision('ops_location_lon').notNull(),
  updatedAt: timestamp('updatedAt', { precision: 3, mode: 'string' }).notNull(),
  agencyId: integer('agencyId'),
})
export type OpsLocations = InferModel<typeof opsLocations> // return type when queried
export const zInsertOpsLocations = createInsertSchema(opsLocations)
export const zSelectOpsLocations = createSelectSchema(opsLocations)
export type ZSelectOpsLocations = z.infer<typeof zSelectOpsLocations>
export type ZInsertOpsLocations = z.infer<typeof zInsertOpsLocations>

export const pathways = pgTable('pathways', {
  tcAgencyId: text('tc_agency_id')
    .notNull()
    .references(() => agency.tcAgencyId, { onDelete: 'cascade' }),
  pathwayId: text('pathway_id').primaryKey().notNull(),
  fromStopId: text('from_stop_id').notNull(),
  toStopId: text('to_stop_id').notNull(),
  pathwayMode: integer('pathway_mode').notNull(),
  isBidirectional: integer('is_bidirectional').notNull(),
  length: doublePrecision('length'),
  traversalTime: integer('traversal_time'),
  stairCount: integer('stair_count'),
  maxSlope: doublePrecision('max_slope'),
  minWidth: doublePrecision('min_width'),
  signpostedAs: text('signposted_as'),
  reversedSignpostedAs: text('reversed_signposted_as'),
  updatedAt: timestamp('updatedAt', { precision: 3, mode: 'string' }).notNull(),
  agencyId: integer('agencyId'),
})
export type Pathways = InferModel<typeof pathways> // return type when queried
export const zInsertPathways = createInsertSchema(pathways)
export const zSelectPathways = createSelectSchema(pathways)
export type ZSelectPathways = z.infer<typeof zSelectPathways>
export type ZInsertPathways = z.infer<typeof zInsertPathways>

export const runEvent = pgTable(
  'runEvent',
  {
    tcAgencyId: text('tc_agency_id')
      .notNull()
      .references(() => agency.tcAgencyId, { onDelete: 'cascade' }),
    runEventId: text('run_event_id').primaryKey().notNull(),
    pieceId: text('piece_id').notNull(),
    eventType: integer('event_type').notNull(),
    eventName: text('event_name'),
    eventTime: text('event_time').notNull(),
    eventDuration: integer('event_duration').notNull(),
    eventFromLocationType: integer('event_from_location_type'),
    eventFromLocationId: text('event_from_location_id'),
    eventToLocationType: integer('event_to_location_type'),
    eventToLocationId: text('event_to_location_id'),
    updatedAt: timestamp('updatedAt', {
      precision: 3,
      mode: 'string',
    }).notNull(),
    agencyId: integer('agencyId'),
  },
  (table) => {
    return {
      idxRunEventEventToLocationType: index(
        'idx_run_event_event_to_location_type',
      ).on(table.eventToLocationType),
      idxRunEventEventFromLocationType: index(
        'idx_run_event_event_from_location_type',
      ).on(table.eventFromLocationType),
      idxRunEventEventType: index('idx_run_event_event_type').on(
        table.eventType,
      ),
    }
  },
)
export type RunEvent = InferModel<typeof runEvent> // return type when queried
export const zInsertRunEvent = createInsertSchema(runEvent)
export const zSelectRunEvent = createSelectSchema(runEvent)
export type ZSelectRunEvent = z.infer<typeof zSelectRunEvent>
export type ZInsertRunEvent = z.infer<typeof zInsertRunEvent>

export const runsPieces = pgTable(
  'runsPieces',
  {
    tcAgencyId: text('tc_agency_id')
      .notNull()
      .references(() => agency.tcAgencyId, { onDelete: 'cascade' }),
    runId: text('run_id').notNull(),
    pieceId: text('piece_id').primaryKey().notNull(),
    startType: integer('start_type').notNull(),
    startTripId: text('start_trip_id').notNull(),
    startTripPosition: integer('start_trip_position'),
    endType: integer('end_type').notNull(),
    endTripId: text('end_trip_id').notNull(),
    endTripPosition: integer('end_trip_position'),
    updatedAt: timestamp('updatedAt', {
      precision: 3,
      mode: 'string',
    }).notNull(),
    agencyId: integer('agencyId'),
  },
  (table) => {
    return {
      idxRunsPiecesEndTripId: index('idx_runs_pieces_end_trip_id').on(
        table.endTripId,
      ),
      idxRunsPiecesEndType: index('idx_runs_pieces_end_type').on(table.endType),
      idxRunsPiecesStartTripId: index('idx_runs_pieces_start_trip_id').on(
        table.startTripId,
      ),
      idxRunsPiecesStartType: index('idx_runs_pieces_start_type').on(
        table.startType,
      ),
    }
  },
)
export type RunsPieces = InferModel<typeof runsPieces> // return type when queried
export const zInsertRunsPieces = createInsertSchema(runsPieces)
export const zSelectRunsPieces = createSelectSchema(runsPieces)
export type ZSelectRunsPieces = z.infer<typeof zSelectRunsPieces>
export type ZInsertRunsPieces = z.infer<typeof zInsertRunsPieces>

export const serviceAlertTargets = pgTable(
  'serviceAlertTargets',
  {
    tcAgencyId: text('tc_agency_id')
      .notNull()
      .references(() => agency.tcAgencyId, { onDelete: 'cascade' }),
    alertId: text('alert_id').primaryKey().notNull(),
    stopId: text('stop_id'),
    routeId: text('route_id'),
    isUpdated: integer('isUpdated').default(1).notNull(),
    updatedAt: timestamp('updatedAt', {
      precision: 3,
      mode: 'string',
    }).notNull(),
    agencyId: integer('agencyId'),
  },
  (table) => {
    return {
      idxServiceAlertTargetsRouteId: index(
        'idx_service_alert_targets_route_id',
      ).on(table.routeId),
      idxServiceAlertTargetsStopId: index(
        'idx_service_alert_targets_stop_id',
      ).on(table.stopId),
      idxServiceAlertTargetsAlertId: index(
        'idx_service_alert_targets_alert_id',
      ).on(table.alertId),
    }
  },
)
export type ServiceAlertTargets = InferModel<typeof serviceAlertTargets> // return type when queried
export const zInsertServiceAlertTargets =
  createInsertSchema(serviceAlertTargets)
export const zSelectServiceAlertTargets =
  createSelectSchema(serviceAlertTargets)
export type ZSelectServiceAlertTargets = z.infer<
  typeof zSelectServiceAlertTargets
>
export type ZInsertServiceAlertTargets = z.infer<
  typeof zInsertServiceAlertTargets
>

export const stopAttributes = pgTable(
  'stopAttributes',
  {
    tcAgencyId: text('tc_agency_id')
      .notNull()
      .references(() => agency.tcAgencyId, { onDelete: 'cascade' }),
    id: serial('id').primaryKey().notNull(),
    stopId: text('stop_id').notNull(),
    stopCity: text('stop_city'),
    updatedAt: timestamp('updatedAt', {
      precision: 3,
      mode: 'string',
    }).notNull(),
    agencyId: integer('agencyId'),
  },
  (table) => {
    return {
      idxStopAttributesStopId: index('idx_stop_attributes_stop_id').on(
        table.stopId,
      ),
    }
  },
)
export type StopAttributes = InferModel<typeof stopAttributes> // return type when queried
export const zInsertStopAttributes = createInsertSchema(stopAttributes)
export const zSelectStopAttributes = createSelectSchema(stopAttributes)
export type ZSelectStopAttributes = z.infer<typeof zSelectStopAttributes>
export type ZInsertStopAttributes = z.infer<typeof zInsertStopAttributes>

export const serviceAlerts = pgTable(
  'serviceAlerts',
  {
    tcAgencyId: text('tc_agency_id')
      .notNull()
      .references(() => agency.tcAgencyId, { onDelete: 'cascade' }),
    id: text('id').primaryKey().notNull(),
    cause: integer('cause').notNull(),
    startTime: text('start_time').notNull(),
    endTime: text('end_time').notNull(),
    headline: text('headline').notNull(),
    description: text('description').notNull(),
    isUpdated: integer('isUpdated').default(1).notNull(),
    updatedAt: timestamp('updatedAt', {
      precision: 3,
      mode: 'string',
    }).notNull(),
    agencyId: integer('agencyId'),
  },
  (table) => {
    return {
      idxServiceAlertsId: index('idx_service_alerts_id').on(table.id),
    }
  },
)
export type ServiceAlerts = InferModel<typeof serviceAlerts> // return type when queried
export const zInsertServiceAlerts = createInsertSchema(serviceAlerts)
export const zSelectServiceAlerts = createSelectSchema(serviceAlerts)
export type ZSelectServiceAlerts = z.infer<typeof zSelectServiceAlerts>
export type ZInsertServiceAlerts = z.infer<typeof zInsertServiceAlerts>

export const timetableStopOrder = pgTable(
  'timetableStopOrder',
  {
    tcAgencyId: text('tc_agency_id')
      .notNull()
      .references(() => agency.tcAgencyId, { onDelete: 'cascade' }),
    id: serial('id').primaryKey().notNull(),
    timetableId: text('timetable_id'),
    stopId: text('stop_id'),
    stopSequence: integer('stop_sequence'),
    updatedAt: timestamp('updatedAt', {
      precision: 3,
      mode: 'string',
    }).notNull(),
    agencyId: integer('agencyId'),
  },
  (table) => {
    return {
      idxTimetableStopOrderStopSequence: index(
        'idx_timetable_stop_order_stop_sequence',
      ).on(table.stopSequence),
      idxTimetableStopOrderTimetableId: index(
        'idx_timetable_stop_order_timetable_id',
      ).on(table.timetableId),
    }
  },
)
export type TimetableStopOrder = InferModel<typeof timetableStopOrder> // return type when queried
export const zInsertTimetableStopOrder = createInsertSchema(timetableStopOrder)
export const zSelectTimetableStopOrder = createSelectSchema(timetableStopOrder)
export type ZSelectTimetableStopOrder = z.infer<
  typeof zSelectTimetableStopOrder
>
export type ZInsertTimetableStopOrder = z.infer<
  typeof zInsertTimetableStopOrder
>

export const timetables = pgTable(
  'timetables',
  {
    tcAgencyId: text('tc_agency_id')
      .notNull()
      .references(() => agency.tcAgencyId, { onDelete: 'cascade' }),
    id: serial('id').primaryKey().notNull(),
    timetableId: text('timetable_id'),
    routeId: text('route_id'),
    directionId: integer('direction_id'),
    startDate: integer('start_date'),
    endDate: integer('end_date'),
    monday: integer('monday').notNull(),
    tuesday: integer('tuesday').notNull(),
    wednesday: integer('wednesday').notNull(),
    thursday: integer('thursday').notNull(),
    friday: integer('friday').notNull(),
    saturday: integer('saturday').notNull(),
    sunday: integer('sunday').notNull(),
    startTime: text('start_time'),
    startTimestamp: integer('start_timestamp'),
    endTime: text('end_time'),
    endTimestamp: integer('end_timestamp'),
    timetableLabel: text('timetable_label'),
    serviceNotes: text('service_notes'),
    orientation: text('orientation'),
    timetablePageId: text('timetable_page_id'),
    timetableSequence: integer('timetable_sequence'),
    directionName: text('direction_name'),
    includeExceptions: integer('include_exceptions'),
    showTripContinuation: integer('show_trip_continuation'),
    updatedAt: timestamp('updatedAt', {
      precision: 3,
      mode: 'string',
    }).notNull(),
    agencyId: integer('agencyId'),
  },
  (table) => {
    return {
      idxTimetablesTimetableSequence: index(
        'idx_timetables_timetable_sequence',
      ).on(table.timetableSequence),
    }
  },
)
export type Timetables = InferModel<typeof timetables> // return type when queried
export const zInsertTimetables = createInsertSchema(timetables)
export const zSelectTimetables = createSelectSchema(timetables)
export type ZInsertTimetables = z.infer<typeof zInsertTimetables>
export type ZSelectTimetables = z.infer<typeof zSelectTimetables>

export const translations = pgTable('translations', {
  tcAgencyId: text('tc_agency_id')
    .notNull()
    .references(() => agency.tcAgencyId, { onDelete: 'cascade' }),
  id: serial('id').primaryKey().notNull(),
  tableName: text('table_name').notNull(),
  fieldName: text('field_name').notNull(),
  language: text('language').notNull(),
  translation: text('translation').notNull(),
  recordId: text('record_id'),
  recordSubId: text('record_sub_id'),
  fieldValue: text('field_value'),
  updatedAt: timestamp('updatedAt', { precision: 3, mode: 'string' }).notNull(),
  agencyId: integer('agencyId'),
  tCagencyId: uuid('tCAgencyId').references(() => tcAgency.id, {
    onDelete: 'set null',
    onUpdate: 'cascade',
  }),
})
export type Translations = InferModel<typeof translations> // return type when queried
export const zInsertTranslations = createInsertSchema(translations)
export const zSelectTranslations = createSelectSchema(translations)
export type ZInsertTranslations = z.infer<typeof zInsertTranslations>
export type ZSelectTranslations = z.infer<typeof zSelectTranslations>

export const vehiclePositions = pgTable(
  'vehiclePositions',
  {
    tcAgencyId: text('tc_agency_id')
      .notNull()
      .references(() => agency.tcAgencyId, { onDelete: 'cascade' }),
    updateId: text('update_id').primaryKey().notNull(),
    bearing: doublePrecision('bearing'),
    latitude: doublePrecision('latitude'),
    longitude: doublePrecision('longitude'),
    speed: doublePrecision('speed'),
    tripId: text('trip_id'),
    vehicleId: text('vehicle_id'),
    timestamp: text('timestamp'),
    isUpdated: integer('isUpdated').default(1).notNull(),
    updatedAt: timestamp('updatedAt', {
      precision: 3,
      mode: 'string',
    }).notNull(),
    agencyId: integer('agencyId'),
    tCagencyId: uuid('tCAgencyId').references(() => tcAgency.id, {
      onDelete: 'set null',
      onUpdate: 'cascade',
    }),
  },
  (table) => {
    return {
      idxVehiclePositionsVehicleId: index(
        'idx_vehicle_positions_vehicle_id',
      ).on(table.vehicleId),
      idxVehiclePositionsTripId: index('idx_vehicle_positions_trip_id').on(
        table.tripId,
      ),
      idxVehiclePositionsUpdateId: index('idx_vehicle_positions_update_id').on(
        table.updateId,
      ),
    }
  },
)
export type VehiclePositions = InferModel<typeof vehiclePositions> // return type when queried
export const zInsertVehiclePositions = createInsertSchema(vehiclePositions)
export const zSelectVehiclePositions = createSelectSchema(vehiclePositions)
export type ZInsertVehiclePositions = z.infer<typeof zInsertVehiclePositions>
export type ZSelectVehiclePositions = z.infer<typeof zSelectVehiclePositions>

export const shapesGeos = pgTable(
  'shapesGeos',
  {
    tcAgencyId: text('tc_agency_id')
      .notNull()
      .references(() => agency.tcAgencyId, { onDelete: 'cascade' }),
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
      shapesGeosPkey: primaryKey(table.tcAgencyId, table.shapeId),
    }
  },
)
export type ShapesGeos = InferModel<typeof shapesGeos> // return type when queried
export const zInsertGeos = createInsertSchema(shapesGeos)
export const zSelectGeos = createSelectSchema(shapesGeos)
export type ZInsertGeos = z.infer<typeof zInsertGeos>
export type ZSelectGeos = z.infer<typeof zSelectGeos>

// use InferModel to generate all types with all pgTables like below sample
// export type User = InferModel<typeof users>; // return type when queried

// export all pgTables into one object named tables
export const tables = {
  agency,
  calendarDates,
  directions,
  routes,
  shapes,
  trips,
  calendar,
  stopTimes,
  tripUpdates,
  vehicles,
  stopUpdates,
  transfers,
  stops,
  areas,
  deadheadTimes,
  deadheads,
  fareAttributes,
  fareProducts,
  fareRules,
  feedInfo,
  frequencies,
  levels,
  opsLocations,
  pathways,
  runEvent,
  runsPieces,
  serviceAlertTargets,
  stopAttributes,
  serviceAlerts,
  timetableStopOrder,
  timetables,
  translations,
  vehiclePositions,
  shapesGeos,
}
