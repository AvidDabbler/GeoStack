-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
DO $$ BEGIN
 CREATE TYPE "Role" AS ENUM('CALLCENTER', 'USER', 'MANAGER', 'ADMIN', 'SUPERADMIN', 'TC_STAFF');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "geography_columns" (
	"f_table_catalog" "name",
	"f_table_schema" "name",
	"f_table_name" "name",
	"f_geography_column" "name",
	"coord_dimension" integer,
	"srid" integer,
	"type" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "geometry_columns" (
	"f_table_catalog" varchar(256),
	"f_table_schema" "name",
	"f_table_name" "name",
	"f_geometry_column" "name",
	"coord_dimension" integer,
	"srid" integer,
	"type" varchar(30)
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
CREATE TABLE IF NOT EXISTS "tcAgency" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"map_layers" json DEFAULT '{}'::json,
	"map_position" json DEFAULT '{"x":0,"y":0,"z":0}'::json,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"tc_agency_id" text NOT NULL,
	"agency_name" text NOT NULL,
	"timezone" text,
	"isPaid" boolean DEFAULT false NOT NULL,
	"state" text,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"userIds" text[]
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"userId" uuid NOT NULL,
	"username" text NOT NULL,
	"tc_agency_id" text NOT NULL,
	"userType" "Role" DEFAULT 'USER' NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "token" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"expires_at" timestamp(3) NOT NULL,
	"createdAt" timestamp(3) NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "agency" (
	"id" serial PRIMARY KEY NOT NULL,
	"tc_agency_id" text NOT NULL,
	"agency_id" text,
	"agency_name" text NOT NULL,
	"agency_url" text NOT NULL,
	"agency_timezone" text NOT NULL,
	"agency_lang" text,
	"agency_phone" text,
	"agency_fare_url" text,
	"agency_email" text,
	"updatedAt" timestamp(3) NOT NULL,
	"userIds" text[]
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"email" text NOT NULL,
	"lastName" text NOT NULL,
	"firstName" text NOT NULL,
	"defaultAgency" text NOT NULL,
	"tc_agency_ids" text[],
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"issueIssueId" uuid,
	"avatarColor" text NOT NULL,
	"isTransitChat" boolean DEFAULT false NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "calendarDates" (
	"tc_agency_id" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"service_id" text NOT NULL,
	"date" integer NOT NULL,
	"exception_type" integer NOT NULL,
	"holiday_name" text,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "directions" (
	"tc_agency_id" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"route_id" text NOT NULL,
	"direction_id" integer,
	"direction" text NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"agencyId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "routes" (
	"agency_id" text,
	"tc_agency_id" text NOT NULL,
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
CREATE TABLE IF NOT EXISTS "shapes" (
	"id" serial PRIMARY KEY NOT NULL,
	"tc_agency_id" text NOT NULL,
	"shape_id" text NOT NULL,
	"shape_pt_lat" double precision NOT NULL,
	"shape_pt_lon" double precision NOT NULL,
	"shape_pt_sequence" integer NOT NULL,
	"shape_dist_traveled" double precision,
	"updatedAt" timestamp(3) NOT NULL,
	"agencyId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "trips" (
	"tc_agency_id" text NOT NULL,
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
	"agencyId" integer,
	"tCAgencyId" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "conversation" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"title" text NOT NULL,
	"bookmarked" text[] DEFAULT 'RRAY[',
	"subscribed" text[] DEFAULT 'RRAY[',
	"categories" text[] DEFAULT 'RRAY[',
	"mainCategory" text DEFAULT 'UNKNOWN' NOT NULL,
	"description" text NOT NULL,
	"tc_agency_id" text NOT NULL,
	"route_long_name" text,
	"stop_name" text,
	"accountId" uuid NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"agencyId" integer,
	"userId" uuid NOT NULL,
	"lat" double precision NOT NULL,
	"lon" double precision NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chat" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"tc_agency_id" text NOT NULL,
	"conversationId" uuid NOT NULL,
	"accountId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"message" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"routesRoute_id" text,
	"stopsStop_id" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ConversationType" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"tc_agency_id" text NOT NULL,
	"type" text NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "password" (
	"hash" text NOT NULL,
	"profileId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "calendar" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"tc_agency_id" text NOT NULL,
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
CREATE TABLE IF NOT EXISTS "stopTimes" (
	"tc_agency_id" text NOT NULL,
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
CREATE TABLE IF NOT EXISTS "tripUpdates" (
	"tc_agency_id" text NOT NULL,
	"update_id" text PRIMARY KEY NOT NULL,
	"vehicle_id" text,
	"trip_id" text,
	"start_date" text,
	"timestamp" text,
	"isUpdated" integer DEFAULT 1 NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"tripsTrip_id" text,
	"vehiclesId" uuid,
	"agencyId" integer,
	"tCAgencyId" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Vehicles" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"tc_agency_id" text NOT NULL,
	"agency_id" text NOT NULL,
	"vehicle_id" text NOT NULL,
	"trip_id" text NOT NULL,
	"route_id" text NOT NULL,
	"longitude" double precision NOT NULL,
	"latitude" double precision NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"agencyId" integer,
	"tCAgencyId" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stopUpdates" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"tc_agency_id" text NOT NULL,
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
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"agencyId" integer,
	"tCAgencyId" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transfers" (
	"tc_agency_id" text NOT NULL,
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
CREATE TABLE IF NOT EXISTS "stops" (
	"tc_agency_id" text NOT NULL,
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
	"geom" "geometry(Point,4326)",
	"agencyId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Areas" (
	"tc_agency_id" text NOT NULL,
	"area_id" text PRIMARY KEY NOT NULL,
	"area_name" text,
	"updatedAt" timestamp(3) NOT NULL,
	"agencyId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "deadheadTimes" (
	"tc_agency_id" text NOT NULL,
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
	"tc_agency_id" text NOT NULL,
	"deadhead_id" text PRIMARY KEY NOT NULL,
	"service_id" text NOT NULL,
	"block_id" text NOT NULL,
	"shape_id" text,
	"to_trip_id" text,
	"from_trip_id" text,
	"to_deadhead_id" text,
	"from_deadhead_id" text,
	"updatedAt" timestamp(3) NOT NULL,
	"tcAgencyId" uuid,
	"agencyId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fareAttributes" (
	"tc_agency_id" text NOT NULL,
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
	"tc_agency_id" text NOT NULL,
	"fare_product_id" text PRIMARY KEY NOT NULL,
	"fare_product_name" text,
	"amount" double precision NOT NULL,
	"currency" text NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"agencyId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fareRules" (
	"tc_agency_id" text NOT NULL,
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
	"tc_agency_id" text NOT NULL,
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
	"tc_agency_id" text NOT NULL,
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
CREATE TABLE IF NOT EXISTS "Levels" (
	"tc_agency_id" text NOT NULL,
	"level_id" text PRIMARY KEY NOT NULL,
	"level_index" double precision NOT NULL,
	"level_name" text,
	"updatedAt" timestamp(3) NOT NULL,
	"agencyId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "opsLocations" (
	"tc_agency_id" text NOT NULL,
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
	"tc_agency_id" text NOT NULL,
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
CREATE TABLE IF NOT EXISTS "runEvent" (
	"tc_agency_id" text NOT NULL,
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
	"tc_agency_id" text NOT NULL,
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
	"tc_agency_id" text NOT NULL,
	"alert_id" text PRIMARY KEY NOT NULL,
	"stop_id" text,
	"route_id" text,
	"isUpdated" integer DEFAULT 1 NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"agencyId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stopAttributes" (
	"tc_agency_id" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"stop_id" text NOT NULL,
	"stop_city" text,
	"updatedAt" timestamp(3) NOT NULL,
	"agencyId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "serviceAlerts" (
	"tc_agency_id" text NOT NULL,
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
CREATE TABLE IF NOT EXISTS "timetableStopOrder" (
	"tc_agency_id" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"timetable_id" text,
	"stop_id" text,
	"stop_sequence" integer,
	"updatedAt" timestamp(3) NOT NULL,
	"agencyId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "timetables" (
	"tc_agency_id" text NOT NULL,
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
CREATE TABLE IF NOT EXISTS "translations" (
	"tc_agency_id" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"table_name" text NOT NULL,
	"field_name" text NOT NULL,
	"language" text NOT NULL,
	"translation" text NOT NULL,
	"record_id" text,
	"record_sub_id" text,
	"field_value" text,
	"updatedAt" timestamp(3) NOT NULL,
	"agencyId" integer,
	"tCAgencyId" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vehiclePositions" (
	"tc_agency_id" text NOT NULL,
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
	"agencyId" integer,
	"tCAgencyId" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shapesGeos" (
	"tc_agency_id" text NOT NULL,
	"shape_id" text NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"geom" "geometry(LineString,4326)",
	"agencyId" integer,
	CONSTRAINT shapesGeos_pkey PRIMARY KEY("tc_agency_id","shape_id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "tcAgency_id_key" ON "tcAgency" ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "account_id_key" ON "account" ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "account_tc_agency_id_userId_key" ON "account" ("userId","tc_agency_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "token_id_key" ON "token" ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_id_key" ON "user" ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_email_key" ON "user" ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_calendar_dates_exception_type" ON "calendarDates" ("exception_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_calendar_dates_date" ON "calendarDates" ("date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_calendar_dates_service_id" ON "calendarDates" ("service_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_directions_direction_id" ON "directions" ("direction_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_directions_route_id" ON "directions" ("route_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_shapes_shape_id" ON "shapes" ("shape_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_trips_shape_id" ON "trips" ("shape_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_trips_block_id" ON "trips" ("block_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_trips_direction_id" ON "trips" ("direction_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_trips_service_id" ON "trips" ("service_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_trips_route_id" ON "trips" ("route_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ConversationType_type_tc_agency_id_key" ON "ConversationType" ("tc_agency_id","type");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ConversationType_name_tc_agency_id_key" ON "ConversationType" ("tc_agency_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "password_profileId_key" ON "password" ("profileId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "calendar_id_key" ON "calendar" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_calendar_end_date" ON "calendar" ("end_date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_calendar_start_date" ON "calendar" ("start_date");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "calendar_service_id_tc_agency_id_key" ON "calendar" ("tc_agency_id","service_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_stop_times_stop_sequence" ON "stopTimes" ("stop_sequence");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_stop_times_departure_timestamp" ON "stopTimes" ("departure_timestamp");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_stop_times_arrival_timestamp" ON "stopTimes" ("arrival_timestamp");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_stop_times_trip_id" ON "stopTimes" ("trip_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_trip_updates_trip_id" ON "tripUpdates" ("trip_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_trip_updates_vehicle_id" ON "tripUpdates" ("vehicle_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_trip_updates_update_id" ON "tripUpdates" ("update_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Vehicles_trip_id_key" ON "Vehicles" ("trip_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_transfers_to_stop_id" ON "transfers" ("to_stop_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_transfers_from_stop_id" ON "transfers" ("from_stop_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_stops_parent_station" ON "stops" ("parent_station");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "stops_idx" ON "stops" ("geom");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "stops_stop_id_tc_agency_id_key" ON "stops" ("tc_agency_id","stop_id");--> statement-breakpoint
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
CREATE INDEX IF NOT EXISTS "idx_stop_attributes_stop_id" ON "stopAttributes" ("stop_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_service_alerts_id" ON "serviceAlerts" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_timetable_stop_order_stop_sequence" ON "timetableStopOrder" ("stop_sequence");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_timetable_stop_order_timetable_id" ON "timetableStopOrder" ("timetable_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_timetables_timetable_sequence" ON "timetables" ("timetable_sequence");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_vehicle_positions_vehicle_id" ON "vehiclePositions" ("vehicle_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_vehicle_positions_trip_id" ON "vehiclePositions" ("trip_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_vehicle_positions_update_id" ON "vehiclePositions" ("update_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "shape_geom_idx" ON "shapesGeos" ("geom");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_tc_agency" FOREIGN KEY ("tc_agency_id") REFERENCES "tcAgency"("tc_agency_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calendarDates" ADD CONSTRAINT "calendardates_agency" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "directions" ADD CONSTRAINT "dir_agency" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "routes" ADD CONSTRAINT "_agency" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shapes" ADD CONSTRAINT "_agency" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "trips" ADD CONSTRAINT "_agency" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "trips" ADD CONSTRAINT "trips_tc_agency_id_route_id_fkey" FOREIGN KEY ("tc_agency_id","route_id") REFERENCES "routes"("tc_agency_id","route_id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "trips" ADD CONSTRAINT "trips_shapes_geo" FOREIGN KEY ("tc_agency_id","shape_id") REFERENCES "shapesGeos"("tc_agency_id","shape_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "trips" ADD CONSTRAINT "trips_tCAgencyId_fkey" FOREIGN KEY ("tCAgencyId") REFERENCES "tcAgency"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "conversation" ADD CONSTRAINT "conversation_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "conversation" ADD CONSTRAINT "conversation_tc_agency_id_fkey" FOREIGN KEY ("tc_agency_id") REFERENCES "tcAgency"("tc_agency_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "conversation" ADD CONSTRAINT "conversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chat" ADD CONSTRAINT "chat_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversation"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chat" ADD CONSTRAINT "chat_tc_agency_id_accountId_fkey" FOREIGN KEY ("tc_agency_id","accountId") REFERENCES "account"("id","tc_agency_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chat" ADD CONSTRAINT "chat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chat" ADD CONSTRAINT "chat_tc_agency_id_fkey" FOREIGN KEY ("tc_agency_id") REFERENCES "tcAgency"("tc_agency_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "password" ADD CONSTRAINT "password_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calendar" ADD CONSTRAINT "calendar_agency" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stopTimes" ADD CONSTRAINT "_agency" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stopTimes" ADD CONSTRAINT "stopTimes_tc_agency_id_trip_id_fkey" FOREIGN KEY ("tc_agency_id","trip_id") REFERENCES "trips"("tc_agency_id","trip_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tripUpdates" ADD CONSTRAINT "_agency" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tripUpdates" ADD CONSTRAINT "tripUpdates_tripsTrip_id_fkey" FOREIGN KEY ("tripsTrip_id") REFERENCES "trips"("trip_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tripUpdates" ADD CONSTRAINT "tripUpdates_vehiclesId_fkey" FOREIGN KEY ("vehiclesId") REFERENCES "Vehicles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tripUpdates" ADD CONSTRAINT "tripUpdates_tCAgencyId_fkey" FOREIGN KEY ("tCAgencyId") REFERENCES "tcAgency"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Vehicles" ADD CONSTRAINT "_agency" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "routes"("route_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("trip_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_tCAgencyId_fkey" FOREIGN KEY ("tCAgencyId") REFERENCES "tcAgency"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stopUpdates" ADD CONSTRAINT "_agency" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stopUpdates" ADD CONSTRAINT "stopUpdates_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "routes"("route_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stopUpdates" ADD CONSTRAINT "stopUpdates_stop_id_fkey" FOREIGN KEY ("stop_id") REFERENCES "stops"("stop_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stopUpdates" ADD CONSTRAINT "stopUpdates_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("trip_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stopUpdates" ADD CONSTRAINT "stopUpdates_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicles"("vehicle_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stopUpdates" ADD CONSTRAINT "stopUpdates_tCAgencyId_fkey" FOREIGN KEY ("tCAgencyId") REFERENCES "tcAgency"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transfers" ADD CONSTRAINT "transfers_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "agency"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stops" ADD CONSTRAINT "_agency" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Areas" ADD CONSTRAINT "areas_agency" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deadheadTimes" ADD CONSTRAINT "dhtimes_agency" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deadheads" ADD CONSTRAINT "dh_agency" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fareAttributes" ADD CONSTRAINT "fa_agency" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fareProducts" ADD CONSTRAINT "fp_agency" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fareRules" ADD CONSTRAINT "fr_agency" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "feedInfo" ADD CONSTRAINT "fi_agency" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "frequencies" ADD CONSTRAINT "freq_agency" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Levels" ADD CONSTRAINT "lev_agency" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "opsLocations" ADD CONSTRAINT "oploc_agency" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pathways" ADD CONSTRAINT "path_agency" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "runEvent" ADD CONSTRAINT "_agency" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "runsPieces" ADD CONSTRAINT "_agency" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "serviceAlertTargets" ADD CONSTRAINT "_agency" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stopAttributes" ADD CONSTRAINT "_agency" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "serviceAlerts" ADD CONSTRAINT "_agency" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "timetableStopOrder" ADD CONSTRAINT "_agency" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "timetables" ADD CONSTRAINT "_agency" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "translations" ADD CONSTRAINT "_agency" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "translations" ADD CONSTRAINT "translations_tCAgencyId_fkey" FOREIGN KEY ("tCAgencyId") REFERENCES "tcAgency"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vehiclePositions" ADD CONSTRAINT "_agency" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vehiclePositions" ADD CONSTRAINT "vehiclePositions_tCAgencyId_fkey" FOREIGN KEY ("tCAgencyId") REFERENCES "tcAgency"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shapesGeos" ADD CONSTRAINT "_agency" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

*/