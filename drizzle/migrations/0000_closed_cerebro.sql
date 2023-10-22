DO $$ BEGIN
 CREATE TYPE "Role" AS ENUM('CALLCENTER', 'USER', 'MANAGER', 'ADMIN', 'SUPERADMIN', 'TC_STAFF');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "agency" (
	"id" serial PRIMARY KEY NOT NULL,
	"agency_id" text,
	"agency_name" text NOT NULL,
	"agency_url" text NOT NULL,
	"agency_timezone" text NOT NULL,
	"agency_lang" text,
	"agency_phone" text,
	"agency_fare_url" text,
	"agency_email" text,
	"updatedAt" timestamp(3) DEFAULT now() NOT NULL,
	"userIds" text[]
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Areas" (
	"area_id" text PRIMARY KEY NOT NULL,
	"area_name" text,
	"updatedAt" timestamp(3) NOT NULL,
	"agencyId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "calendar" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"service_id" text NOT NULL,
	"monday" integer NOT NULL,
	"tuesday" integer NOT NULL,
	"wednesday" integer NOT NULL,
	"thursday" integer NOT NULL,
	"friday" integer NOT NULL,
	"saturday" integer NOT NULL,
	"sunday" integer NOT NULL,
	"end_date" integer NOT NULL,
	"start_date" integer NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "calendarDates" (
	"id" serial PRIMARY KEY NOT NULL,
	"service_id" text NOT NULL,
	"date" integer NOT NULL,
	"exception_type" integer NOT NULL,
	"holiday_name" text,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "deadheadTimes" (
	"id" serial PRIMARY KEY NOT NULL,
	"deadhead_id" text NOT NULL,
	"arrival_time" text NOT NULL,
	"arrival_timestamp" integer,
	"departure_time" text NOT NULL,
	"departure_timestamp" integer,
	"ops_location_id" text,
	"stop_id" text,
	"location_sequence" integer NOT NULL,
	"shape_dist_traveled" double precision,
	"updatedAt" timestamp(3) NOT NULL,
	"agencyId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "deadheads" (
	"deadhead_id" text PRIMARY KEY NOT NULL,
	"service_id" text NOT NULL,
	"block_id" text NOT NULL,
	"shape_id" text,
	"to_trip_id" text,
	"from_trip_id" text,
	"to_deadhead_id" text,
	"from_deadhead_id" text,
	"updatedAt" timestamp(3) NOT NULL,
	"agencyId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "directions" (
	"id" serial PRIMARY KEY NOT NULL,
	"route_id" text NOT NULL,
	"direction_id" integer,
	"direction" text NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"agencyId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fareAttributes" (
	"fare_id" text PRIMARY KEY NOT NULL,
	"price" double precision NOT NULL,
	"currency_type" text NOT NULL,
	"payment_method" integer NOT NULL,
	"transfers" integer,
	"agency_id" text,
	"transfer_duration" integer,
	"updatedAt" timestamp(3) NOT NULL,
	"agencyId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fareProducts" (
	"fare_product_id" text PRIMARY KEY NOT NULL,
	"fare_product_name" text,
	"amount" double precision NOT NULL,
	"currency" text NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"agencyId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fareRules" (
	"id" serial PRIMARY KEY NOT NULL,
	"fare_id" text NOT NULL,
	"route_id" text,
	"origin_id" text,
	"destination_id" text,
	"contains_id" text,
	"updatedAt" timestamp(3) NOT NULL,
	"agencyId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "feedInfo" (
	"id" serial PRIMARY KEY NOT NULL,
	"feed_publisher_name" text NOT NULL,
	"feed_publisher_url" text NOT NULL,
	"feed_lang" text NOT NULL,
	"default_lang" text,
	"feed_start_date" integer,
	"feed_end_date" integer,
	"feed_version" text,
	"feed_contact_email" text,
	"feed_contact_url" text,
	"updatedAt" timestamp(3) NOT NULL,
	"agencyId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "frequencies" (
	"id" serial PRIMARY KEY NOT NULL,
	"trip_id" text NOT NULL,
	"start_time" text NOT NULL,
	"start_timestamp" integer,
	"end_time" text NOT NULL,
	"end_timestamp" integer,
	"headway_secs" integer NOT NULL,
	"exact_times" integer,
	"updatedAt" timestamp(3) NOT NULL,
	"agencyId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "geography_columns" (
	"f_table_catalog" text NOT NULL,
	"f_table_schema" text NOT NULL,
	"f_table_name" text NOT NULL,
	"f_geography_column" text NOT NULL,
	"coord_dimension" integer,
	"srid" integer,
	"type" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "geometry_columns" (
	"f_table_catalog" varchar(256),
	"f_table_schema" text NOT NULL,
	"f_table_name" text NOT NULL,
	"f_geometry_column" text NOT NULL,
	"coord_dimension" integer,
	"srid" integer,
	"type" varchar(30)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Levels" (
	"level_id" text PRIMARY KEY NOT NULL,
	"level_index" double precision NOT NULL,
	"level_name" text,
	"updatedAt" timestamp(3) NOT NULL,
	"agencyId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "opsLocations" (
	"ops_location_id" text PRIMARY KEY NOT NULL,
	"ops_location_code" text,
	"ops_location_name" text NOT NULL,
	"ops_location_desc" text,
	"ops_location_lat" double precision NOT NULL,
	"ops_location_lon" double precision NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"agencyId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pathways" (
	"pathway_id" text PRIMARY KEY NOT NULL,
	"from_stop_id" text NOT NULL,
	"to_stop_id" text NOT NULL,
	"pathway_mode" integer NOT NULL,
	"is_bidirectional" integer NOT NULL,
	"length" double precision,
	"traversal_time" integer,
	"stair_count" integer,
	"max_slope" double precision,
	"min_width" double precision,
	"signposted_as" text,
	"reversed_signposted_as" text,
	"updatedAt" timestamp(3) NOT NULL,
	"agencyId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "routes" (
	"agency_id" text,
	"route_id" text PRIMARY KEY NOT NULL,
	"route_short_name" text NOT NULL,
	"route_long_name" text NOT NULL,
	"alias_route_short_name" text,
	"alias_route_long_name" text,
	"route_desc" text,
	"route_type" integer NOT NULL,
	"route_url" text,
	"route_color" text,
	"route_text_color" text,
	"route_sort_order" integer,
	"continuous_pickup" integer,
	"continuous_drop_off" integer,
	"network_id" text,
	"updatedAt" timestamp(3) NOT NULL,
	"agencyId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "runEvent" (
	"run_event_id" text PRIMARY KEY NOT NULL,
	"piece_id" text NOT NULL,
	"event_type" integer NOT NULL,
	"event_name" text,
	"event_time" text NOT NULL,
	"event_duration" integer NOT NULL,
	"event_from_location_type" integer,
	"event_from_location_id" text,
	"event_to_location_type" integer,
	"event_to_location_id" text,
	"updatedAt" timestamp(3) NOT NULL,
	"agencyId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "runsPieces" (
	"run_id" text NOT NULL,
	"piece_id" text PRIMARY KEY NOT NULL,
	"start_type" integer NOT NULL,
	"start_trip_id" text NOT NULL,
	"start_trip_position" integer,
	"end_type" integer NOT NULL,
	"end_trip_id" text NOT NULL,
	"end_trip_position" integer,
	"updatedAt" timestamp(3) NOT NULL,
	"agencyId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "serviceAlertTargets" (
	"alert_id" text PRIMARY KEY NOT NULL,
	"stop_id" text,
	"route_id" text,
	"isUpdated" integer DEFAULT 1 NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"agencyId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "serviceAlerts" (
	"id" text PRIMARY KEY NOT NULL,
	"cause" integer NOT NULL,
	"start_time" text NOT NULL,
	"end_time" text NOT NULL,
	"headline" text NOT NULL,
	"description" text NOT NULL,
	"isUpdated" integer DEFAULT 1 NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"agencyId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shapes" (
	"id" serial PRIMARY KEY NOT NULL,
	"shape_id" text NOT NULL,
	"shape_pt_lat" double precision NOT NULL,
	"shape_pt_lon" double precision NOT NULL,
	"shape_pt_sequence" integer NOT NULL,
	"shape_dist_traveled" double precision,
	"updatedAt" timestamp(3) NOT NULL,
	"agencyId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shapesGeos" (
	"shape_id" text NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"geom" "ltree" NOT NULL,
	"agencyId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "spatial_ref_sys" (
	"srid" integer PRIMARY KEY NOT NULL,
	"auth_name" varchar(256),
	"auth_srid" integer,
	"srtext" varchar(2048),
	"proj4text" varchar(2048)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stopAttributes" (
	"id" serial PRIMARY KEY NOT NULL,
	"stop_id" text NOT NULL,
	"stop_city" text,
	"updatedAt" timestamp(3) NOT NULL,
	"agencyId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stopTimes" (
	"id" serial PRIMARY KEY NOT NULL,
	"trip_id" text NOT NULL,
	"arrival_time" text,
	"arrival_timestamp" integer,
	"departure_time" text,
	"departure_timestamp" integer,
	"stop_id" text NOT NULL,
	"stop_sequence" integer NOT NULL,
	"stop_headsign" text,
	"pickup_type" integer,
	"drop_off_type" integer DEFAULT 0,
	"continuous_pickup" integer,
	"continuous_drop_off" integer,
	"shape_dist_traveled" double precision,
	"timepoint" integer,
	"updatedAt" timestamp(3) NOT NULL,
	"agencyId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stopUpdates" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"agency_id" text NOT NULL,
	"stop_id" text NOT NULL,
	"stop_sequence" integer NOT NULL,
	"trip_id" text NOT NULL,
	"route_id" text NOT NULL,
	"trip_start_time" timestamp(3) NOT NULL,
	"vehicle_id" text NOT NULL,
	"direction_id" integer NOT NULL,
	"delay" integer NOT NULL,
	"delay_type" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp(3) DEFAULT now() NOT NULL,
	"agencyId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stops" (
	"stop_id" text PRIMARY KEY NOT NULL,
	"stop_code" text,
	"stop_name" text NOT NULL,
	"tts_stop_name" text,
	"stop_desc" text DEFAULT '',
	"stop_lat" double precision,
	"stop_lon" double precision,
	"zone_id" text,
	"stop_url" text,
	"location_type" integer,
	"parent_station" text,
	"stop_timezone" text,
	"wheelchair_boarding" integer,
	"level_id" text,
	"platform_code" text,
	"updatedAt" timestamp(3) NOT NULL,
	"geom" "ltree" NOT NULL,
	"agencyId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "timetableStopOrder" (
	"id" serial PRIMARY KEY NOT NULL,
	"timetable_id" text,
	"stop_id" text,
	"stop_sequence" integer,
	"updatedAt" timestamp(3) NOT NULL,
	"agencyId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "timetables" (
	"id" serial PRIMARY KEY NOT NULL,
	"timetable_id" text,
	"route_id" text,
	"direction_id" integer,
	"start_date" integer,
	"end_date" integer,
	"monday" integer NOT NULL,
	"tuesday" integer NOT NULL,
	"wednesday" integer NOT NULL,
	"thursday" integer NOT NULL,
	"friday" integer NOT NULL,
	"saturday" integer NOT NULL,
	"sunday" integer NOT NULL,
	"start_time" text,
	"start_timestamp" integer,
	"end_time" text,
	"end_timestamp" integer,
	"timetable_label" text,
	"service_notes" text,
	"orientation" text,
	"timetable_page_id" text,
	"timetable_sequence" integer,
	"direction_name" text,
	"include_exceptions" integer,
	"show_trip_continuation" integer,
	"updatedAt" timestamp(3) NOT NULL,
	"agencyId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transfers" (
	"id" serial PRIMARY KEY NOT NULL,
	"from_stop_id" text,
	"to_stop_id" text,
	"from_route_id" text,
	"to_route_id" text,
	"from_trip_id" text,
	"to_trip_id" text,
	"transfer_type" integer,
	"min_transfer_time" integer,
	"updatedAt" timestamp(3) NOT NULL,
	"agencyId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "translations" (
	"id" serial PRIMARY KEY NOT NULL,
	"table_name" text NOT NULL,
	"field_name" text NOT NULL,
	"language" text NOT NULL,
	"translation" text NOT NULL,
	"record_id" text,
	"record_sub_id" text,
	"field_value" text,
	"updatedAt" timestamp(3) NOT NULL,
	"agencyId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tripUpdates" (
	"update_id" text PRIMARY KEY NOT NULL,
	"vehicle_id" text,
	"trip_id" text,
	"start_date" text,
	"timestamp" text,
	"isUpdated" integer DEFAULT 1 NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"tripsTrip_id" text,
	"vehiclesId" uuid,
	"agencyId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "trips" (
	"route_id" text NOT NULL,
	"service_id" text NOT NULL,
	"trip_id" text PRIMARY KEY NOT NULL,
	"trip_headsign" text,
	"trip_short_name" text,
	"direction_id" integer,
	"block_id" text,
	"shape_id" text,
	"wheelchair_accessible" integer,
	"bikes_allowed" integer,
	"updatedAt" timestamp(3) NOT NULL,
	"agencyId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vehiclePositions" (
	"update_id" text PRIMARY KEY NOT NULL,
	"bearing" double precision,
	"latitude" double precision,
	"longitude" double precision,
	"speed" double precision,
	"trip_id" text,
	"vehicle_id" text,
	"timestamp" text,
	"isUpdated" integer DEFAULT 1 NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"agencyId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Vehicles" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"agency_id" text NOT NULL,
	"vehicle_id" text NOT NULL,
	"trip_id" text NOT NULL,
	"route_id" text NOT NULL,
	"longitude" double precision NOT NULL,
	"latitude" double precision NOT NULL,
	"updatedAt" timestamp(3) DEFAULT now() NOT NULL,
	"createdAt" timestamp(3) DEFAULT now() NOT NULL,
	"agencyId" integer
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_calendar_dates_exception_type" ON "calendarDates" ("exception_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_calendar_dates_date" ON "calendarDates" ("date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_calendar_dates_service_id" ON "calendarDates" ("service_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_deadhead_times_location_sequence" ON "deadheadTimes" ("location_sequence");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_deadhead_times_departure_timestamp" ON "deadheadTimes" ("departure_timestamp");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_deadhead_times_arrival_timestamp" ON "deadheadTimes" ("arrival_timestamp");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_deadhead_times_deadhead_id" ON "deadheadTimes" ("deadhead_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_deadheads_from_deadhead_id" ON "deadheads" ("from_deadhead_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_deadheads_to_deadhead_id" ON "deadheads" ("to_deadhead_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_deadheads_from_trip_id" ON "deadheads" ("from_trip_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_deadheads_to_trip_id" ON "deadheads" ("to_trip_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_deadheads_shape_id" ON "deadheads" ("shape_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_deadheads_block_id" ON "deadheads" ("block_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_directions_direction_id" ON "directions" ("direction_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_directions_route_id" ON "directions" ("route_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_frequencies_trip_id" ON "frequencies" ("trip_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_run_event_event_to_location_type" ON "runEvent" ("event_to_location_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_run_event_event_from_location_type" ON "runEvent" ("event_from_location_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_run_event_event_type" ON "runEvent" ("event_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_runs_pieces_end_trip_id" ON "runsPieces" ("end_trip_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_runs_pieces_end_type" ON "runsPieces" ("end_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_runs_pieces_start_trip_id" ON "runsPieces" ("start_trip_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_runs_pieces_start_type" ON "runsPieces" ("start_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_service_alert_targets_route_id" ON "serviceAlertTargets" ("route_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_service_alert_targets_stop_id" ON "serviceAlertTargets" ("stop_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_service_alert_targets_alert_id" ON "serviceAlertTargets" ("alert_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_service_alerts_id" ON "serviceAlerts" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_shapes_shape_id" ON "shapes" ("shape_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "shape_geom_idx" ON "shapesGeos" ("geom");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_stop_attributes_stop_id" ON "stopAttributes" ("stop_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_timetable_stop_order_stop_sequence" ON "timetableStopOrder" ("stop_sequence");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_timetable_stop_order_timetable_id" ON "timetableStopOrder" ("timetable_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_timetables_timetable_sequence" ON "timetables" ("timetable_sequence");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_transfers_to_stop_id" ON "transfers" ("to_stop_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_transfers_from_stop_id" ON "transfers" ("from_stop_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_vehicle_positions_vehicle_id" ON "vehiclePositions" ("vehicle_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_vehicle_positions_trip_id" ON "vehiclePositions" ("trip_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_vehicle_positions_update_id" ON "vehiclePositions" ("update_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stopUpdates" ADD CONSTRAINT "stopUpdates_stop_id_stops_stop_id_fk" FOREIGN KEY ("stop_id") REFERENCES "stops"("stop_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stopUpdates" ADD CONSTRAINT "stopUpdates_trip_id_trips_trip_id_fk" FOREIGN KEY ("trip_id") REFERENCES "trips"("trip_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stopUpdates" ADD CONSTRAINT "stopUpdates_route_id_routes_route_id_fk" FOREIGN KEY ("route_id") REFERENCES "routes"("route_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stopUpdates" ADD CONSTRAINT "stopUpdates_vehicle_id_Vehicles_vehicle_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicles"("vehicle_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transfers" ADD CONSTRAINT "transfers_agencyId_agency_id_fk" FOREIGN KEY ("agencyId") REFERENCES "agency"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tripUpdates" ADD CONSTRAINT "tripUpdates_tripsTrip_id_trips_trip_id_fk" FOREIGN KEY ("tripsTrip_id") REFERENCES "trips"("trip_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tripUpdates" ADD CONSTRAINT "tripUpdates_vehiclesId_Vehicles_id_fk" FOREIGN KEY ("vehiclesId") REFERENCES "Vehicles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_trip_id_trips_trip_id_fk" FOREIGN KEY ("trip_id") REFERENCES "trips"("trip_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_route_id_routes_route_id_fk" FOREIGN KEY ("route_id") REFERENCES "routes"("route_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
