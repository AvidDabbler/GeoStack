import {
  pgTable,
  pgEnum,
  integer,
  text,
  varchar,
  uuid,
  timestamp,
  serial,
  index,
  doublePrecision,
} from 'drizzle-orm/pg-core'
import { customType } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
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
  fTableCatalog: text('f_table_catalog').notNull(),

  fTableSchema: text('f_table_schema').notNull(),

  fTableName: text('f_table_name').notNull(),

  fGeographyColumn: text('f_geography_column').notNull(),
  coordDimension: integer('coord_dimension'),
  srid: integer('srid'),
  type: text('type'),
})

export const geometryColumns = pgTable('geometry_columns', {
  fTableCatalog: varchar('f_table_catalog', { length: 256 }),

  fTableSchema: text('f_table_schema').notNull(),

  fTableName: text('f_table_name').notNull(),

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
export const calendarDates = pgTable(
  'calendarDates',
  {
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

export const directions = pgTable(
  'directions',
  {
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

export const routes = pgTable('routes', {
  agency_id: text('agency_id'),
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

export const trips = pgTable('trips', {
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
})

export const calendar = pgTable('calendar', {
  id: uuid('id')
    .default(sql`uuid_generate_v4()`)
    .primaryKey()
    .notNull(),
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
})

export const stopTimes = pgTable('stopTimes', {
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
})

export const tripUpdates = pgTable('tripUpdates', {
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
})

export const vehicles = pgTable('Vehicles', {
  id: uuid('id')
    .default(sql`uuid_generate_v4()`)
    .primaryKey()
    .notNull(),
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
})

export const stopUpdates = pgTable('stopUpdates', {
  id: uuid('id')
    .default(sql`uuid_generate_v4()`)
    .primaryKey()
    .notNull(),
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
})

export const transfers = pgTable(
  'transfers',
  {
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

export const stops = pgTable('stops', {
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
  geom: ltree('geom').notNull(),
  agencyId: integer('agencyId'),
})

export const areas = pgTable('Areas', {
  areaId: text('area_id').primaryKey().notNull(),
  areaName: text('area_name'),
  updatedAt: timestamp('updatedAt', { precision: 3, mode: 'string' }).notNull(),
  agencyId: integer('agencyId'),
})

export const deadheadTimes = pgTable(
  'deadheadTimes',
  {
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

export const deadheads = pgTable(
  'deadheads',
  {
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

export const fareAttributes = pgTable('fareAttributes', {
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

export const fareProducts = pgTable('fareProducts', {
  fareProductId: text('fare_product_id').primaryKey().notNull(),
  fareProductName: text('fare_product_name'),
  amount: doublePrecision('amount').notNull(),
  currency: text('currency').notNull(),
  updatedAt: timestamp('updatedAt', { precision: 3, mode: 'string' }).notNull(),
  agencyId: integer('agencyId'),
})

export const fareRules = pgTable('fareRules', {
  id: serial('id').primaryKey().notNull(),
  fareId: text('fare_id').notNull(),
  routeId: text('route_id'),
  originId: text('origin_id'),
  destinationId: text('destination_id'),
  containsId: text('contains_id'),
  updatedAt: timestamp('updatedAt', { precision: 3, mode: 'string' }).notNull(),
  agencyId: integer('agencyId'),
})

export const feedInfo = pgTable('feedInfo', {
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

export const frequencies = pgTable(
  'frequencies',
  {
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

export const levels = pgTable('Levels', {
  levelId: text('level_id').primaryKey().notNull(),
  levelIndex: doublePrecision('level_index').notNull(),
  levelName: text('level_name'),
  updatedAt: timestamp('updatedAt', { precision: 3, mode: 'string' }).notNull(),
  agencyId: integer('agencyId'),
})

export const opsLocations = pgTable('opsLocations', {
  opsLocationId: text('ops_location_id').primaryKey().notNull(),
  opsLocationCode: text('ops_location_code'),
  opsLocationName: text('ops_location_name').notNull(),
  opsLocationDesc: text('ops_location_desc'),
  opsLocationLat: doublePrecision('ops_location_lat').notNull(),
  opsLocationLon: doublePrecision('ops_location_lon').notNull(),
  updatedAt: timestamp('updatedAt', { precision: 3, mode: 'string' }).notNull(),
  agencyId: integer('agencyId'),
})

export const pathways = pgTable('pathways', {
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

export const runEvent = pgTable(
  'runEvent',
  {
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

export const runsPieces = pgTable(
  'runsPieces',
  {
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

export const serviceAlertTargets = pgTable(
  'serviceAlertTargets',
  {
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

export const stopAttributes = pgTable(
  'stopAttributes',
  {
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

export const serviceAlerts = pgTable(
  'serviceAlerts',
  {
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

export const timetableStopOrder = pgTable(
  'timetableStopOrder',
  {
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

export const timetables = pgTable(
  'timetables',
  {
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

export const translations = pgTable('translations', {
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
})

export const vehiclePositions = pgTable(
  'vehiclePositions',
  {
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

export const shapesGeos = pgTable(
  'shapesGeos',
  {
    shapeId: text('shape_id').notNull(),
    updatedAt: timestamp('updatedAt', {
      precision: 3,
      mode: 'string',
    }).notNull(),
    geom: ltree('geom').notNull(),
    agencyId: integer('agencyId'),
  },
  (table) => {
    return {
      shapeGeomIdx: index('shape_geom_idx').on(table.geom),
    }
  },
)

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
