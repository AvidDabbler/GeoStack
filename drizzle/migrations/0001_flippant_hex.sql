ALTER TABLE "account" DROP CONSTRAINT "account_tc_agency";
--> statement-breakpoint
ALTER TABLE "account" DROP CONSTRAINT "account_userId_fkey";
--> statement-breakpoint
ALTER TABLE "calendarDates" DROP CONSTRAINT "calendardates_agency";
--> statement-breakpoint
ALTER TABLE "directions" DROP CONSTRAINT "dir_agency";
--> statement-breakpoint
ALTER TABLE "routes" DROP CONSTRAINT "_agency";
--> statement-breakpoint
ALTER TABLE "shapes" DROP CONSTRAINT "_agency";
--> statement-breakpoint
ALTER TABLE "trips" DROP CONSTRAINT "_agency";
--> statement-breakpoint
ALTER TABLE "trips" DROP CONSTRAINT "trips_tc_agency_id_route_id_fkey";
--> statement-breakpoint
ALTER TABLE "trips" DROP CONSTRAINT "trips_shapes_geo";
--> statement-breakpoint
ALTER TABLE "trips" DROP CONSTRAINT "trips_tCAgencyId_fkey";
--> statement-breakpoint
ALTER TABLE "conversation" DROP CONSTRAINT "conversation_accountId_fkey";
--> statement-breakpoint
ALTER TABLE "conversation" DROP CONSTRAINT "conversation_tc_agency_id_fkey";
--> statement-breakpoint
ALTER TABLE "conversation" DROP CONSTRAINT "conversation_userId_fkey";
--> statement-breakpoint
ALTER TABLE "chat" DROP CONSTRAINT "chat_conversationId_fkey";
--> statement-breakpoint
ALTER TABLE "chat" DROP CONSTRAINT "chat_tc_agency_id_accountId_fkey";
--> statement-breakpoint
ALTER TABLE "chat" DROP CONSTRAINT "chat_userId_fkey";
--> statement-breakpoint
ALTER TABLE "chat" DROP CONSTRAINT "chat_tc_agency_id_fkey";
--> statement-breakpoint
ALTER TABLE "password" DROP CONSTRAINT "password_profileId_fkey";
--> statement-breakpoint
ALTER TABLE "calendar" DROP CONSTRAINT "calendar_agency";
--> statement-breakpoint
ALTER TABLE "stopTimes" DROP CONSTRAINT "_agency";
--> statement-breakpoint
ALTER TABLE "stopTimes" DROP CONSTRAINT "stopTimes_tc_agency_id_trip_id_fkey";
--> statement-breakpoint
ALTER TABLE "tripUpdates" DROP CONSTRAINT "_agency";
--> statement-breakpoint
ALTER TABLE "tripUpdates" DROP CONSTRAINT "tripUpdates_tripsTrip_id_fkey";
--> statement-breakpoint
ALTER TABLE "tripUpdates" DROP CONSTRAINT "tripUpdates_vehiclesId_fkey";
--> statement-breakpoint
ALTER TABLE "tripUpdates" DROP CONSTRAINT "tripUpdates_tCAgencyId_fkey";
--> statement-breakpoint
ALTER TABLE "Vehicles" DROP CONSTRAINT "_agency";
--> statement-breakpoint
ALTER TABLE "Vehicles" DROP CONSTRAINT "Vehicles_route_id_fkey";
--> statement-breakpoint
ALTER TABLE "Vehicles" DROP CONSTRAINT "Vehicles_trip_id_fkey";
--> statement-breakpoint
ALTER TABLE "Vehicles" DROP CONSTRAINT "Vehicles_tCAgencyId_fkey";
--> statement-breakpoint
ALTER TABLE "stopUpdates" DROP CONSTRAINT "_agency";
--> statement-breakpoint
ALTER TABLE "stopUpdates" DROP CONSTRAINT "stopUpdates_route_id_fkey";
--> statement-breakpoint
ALTER TABLE "stopUpdates" DROP CONSTRAINT "stopUpdates_stop_id_fkey";
--> statement-breakpoint
ALTER TABLE "stopUpdates" DROP CONSTRAINT "stopUpdates_trip_id_fkey";
--> statement-breakpoint
ALTER TABLE "stopUpdates" DROP CONSTRAINT "stopUpdates_vehicle_id_fkey";
--> statement-breakpoint
ALTER TABLE "stopUpdates" DROP CONSTRAINT "stopUpdates_tCAgencyId_fkey";
--> statement-breakpoint
ALTER TABLE "transfers" DROP CONSTRAINT "transfers_agencyId_fkey";
--> statement-breakpoint
ALTER TABLE "stops" DROP CONSTRAINT "_agency";
--> statement-breakpoint
ALTER TABLE "Areas" DROP CONSTRAINT "areas_agency";
--> statement-breakpoint
ALTER TABLE "deadheadTimes" DROP CONSTRAINT "dhtimes_agency";
--> statement-breakpoint
ALTER TABLE "deadheads" DROP CONSTRAINT "dh_agency";
--> statement-breakpoint
ALTER TABLE "fareAttributes" DROP CONSTRAINT "fa_agency";
--> statement-breakpoint
ALTER TABLE "fareProducts" DROP CONSTRAINT "fp_agency";
--> statement-breakpoint
ALTER TABLE "fareRules" DROP CONSTRAINT "fr_agency";
--> statement-breakpoint
ALTER TABLE "feedInfo" DROP CONSTRAINT "fi_agency";
--> statement-breakpoint
ALTER TABLE "frequencies" DROP CONSTRAINT "freq_agency";
--> statement-breakpoint
ALTER TABLE "Levels" DROP CONSTRAINT "lev_agency";
--> statement-breakpoint
ALTER TABLE "opsLocations" DROP CONSTRAINT "oploc_agency";
--> statement-breakpoint
ALTER TABLE "pathways" DROP CONSTRAINT "path_agency";
--> statement-breakpoint
ALTER TABLE "runEvent" DROP CONSTRAINT "_agency";
--> statement-breakpoint
ALTER TABLE "runsPieces" DROP CONSTRAINT "_agency";
--> statement-breakpoint
ALTER TABLE "serviceAlertTargets" DROP CONSTRAINT "_agency";
--> statement-breakpoint
ALTER TABLE "stopAttributes" DROP CONSTRAINT "_agency";
--> statement-breakpoint
ALTER TABLE "serviceAlerts" DROP CONSTRAINT "_agency";
--> statement-breakpoint
ALTER TABLE "timetableStopOrder" DROP CONSTRAINT "_agency";
--> statement-breakpoint
ALTER TABLE "timetables" DROP CONSTRAINT "_agency";
--> statement-breakpoint
ALTER TABLE "translations" DROP CONSTRAINT "_agency";
--> statement-breakpoint
ALTER TABLE "translations" DROP CONSTRAINT "translations_tCAgencyId_fkey";
--> statement-breakpoint
ALTER TABLE "vehiclePositions" DROP CONSTRAINT "_agency";
--> statement-breakpoint
ALTER TABLE "vehiclePositions" DROP CONSTRAINT "vehiclePositions_tCAgencyId_fkey";
--> statement-breakpoint
ALTER TABLE "shapesGeos" DROP CONSTRAINT "_agency";
--> statement-breakpoint
DROP INDEX IF EXISTS "stops_stop_id_tc_agency_id_key";--> statement-breakpoint
ALTER TABLE "geography_columns" ALTER COLUMN "f_table_catalog" SET DATA TYPE ltree;--> statement-breakpoint
ALTER TABLE "geography_columns" ALTER COLUMN "f_table_catalog" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "geography_columns" ALTER COLUMN "f_table_schema" SET DATA TYPE ltree;--> statement-breakpoint
ALTER TABLE "geography_columns" ALTER COLUMN "f_table_schema" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "geography_columns" ALTER COLUMN "f_table_name" SET DATA TYPE ltree;--> statement-breakpoint
ALTER TABLE "geography_columns" ALTER COLUMN "f_table_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "geography_columns" ALTER COLUMN "f_geography_column" SET DATA TYPE ltree;--> statement-breakpoint
ALTER TABLE "geography_columns" ALTER COLUMN "f_geography_column" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "geometry_columns" ALTER COLUMN "f_table_schema" SET DATA TYPE ltree;--> statement-breakpoint
ALTER TABLE "geometry_columns" ALTER COLUMN "f_table_schema" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "geometry_columns" ALTER COLUMN "f_table_name" SET DATA TYPE ltree;--> statement-breakpoint
ALTER TABLE "geometry_columns" ALTER COLUMN "f_table_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "geometry_columns" ALTER COLUMN "f_geometry_column" SET DATA TYPE ltree;--> statement-breakpoint
ALTER TABLE "geometry_columns" ALTER COLUMN "f_geometry_column" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tcAgency" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "tcAgency" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "agency" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "conversation" ALTER COLUMN "bookmarked" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "conversation" ALTER COLUMN "subscribed" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "conversation" ALTER COLUMN "categories" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "conversation" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "conversation" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "conversation" ALTER COLUMN "lat" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "conversation" ALTER COLUMN "lon" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "chat" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "chat" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "Vehicles" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "Vehicles" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "stopUpdates" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "stopUpdates" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "stops" ALTER COLUMN "geom" SET DATA TYPE ltree;--> statement-breakpoint
ALTER TABLE "stops" ALTER COLUMN "geom" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "shapesGeos" ALTER COLUMN "geom" SET DATA TYPE ltree;--> statement-breakpoint
ALTER TABLE "shapesGeos" ALTER COLUMN "geom" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_tc_agency_id_tcAgency_tc_agency_id_fk" FOREIGN KEY ("tc_agency_id") REFERENCES "tcAgency"("tc_agency_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calendarDates" ADD CONSTRAINT "calendarDates_tc_agency_id_agency_tc_agency_id_fk" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "directions" ADD CONSTRAINT "directions_tc_agency_id_agency_tc_agency_id_fk" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "routes" ADD CONSTRAINT "routes_tc_agency_id_agency_tc_agency_id_fk" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shapes" ADD CONSTRAINT "shapes_tc_agency_id_agency_tc_agency_id_fk" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "trips" ADD CONSTRAINT "trips_tc_agency_id_agency_tc_agency_id_fk" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "trips" ADD CONSTRAINT "trips_tCAgencyId_tcAgency_id_fk" FOREIGN KEY ("tCAgencyId") REFERENCES "tcAgency"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "trips" ADD CONSTRAINT "trips_tc_agency_id_route_id_routes_tc_agency_id_route_id_fk" FOREIGN KEY ("tc_agency_id","route_id") REFERENCES "routes"("tc_agency_id","route_id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "trips" ADD CONSTRAINT "trips_tc_agency_id_shape_id_shapesGeos_tc_agency_id_shape_id_fk" FOREIGN KEY ("tc_agency_id","shape_id") REFERENCES "shapesGeos"("tc_agency_id","shape_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "conversation" ADD CONSTRAINT "conversation_tc_agency_id_tcAgency_tc_agency_id_fk" FOREIGN KEY ("tc_agency_id") REFERENCES "tcAgency"("tc_agency_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "conversation" ADD CONSTRAINT "conversation_accountId_account_id_fk" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "conversation" ADD CONSTRAINT "conversation_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chat" ADD CONSTRAINT "chat_tc_agency_id_tcAgency_tc_agency_id_fk" FOREIGN KEY ("tc_agency_id") REFERENCES "tcAgency"("tc_agency_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chat" ADD CONSTRAINT "chat_conversationId_conversation_id_fk" FOREIGN KEY ("conversationId") REFERENCES "conversation"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chat" ADD CONSTRAINT "chat_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chat" ADD CONSTRAINT "chat_tc_agency_id_accountId_account_id_tc_agency_id_fk" FOREIGN KEY ("tc_agency_id","accountId") REFERENCES "account"("id","tc_agency_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "password" ADD CONSTRAINT "password_profileId_user_id_fk" FOREIGN KEY ("profileId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calendar" ADD CONSTRAINT "calendar_tc_agency_id_agency_tc_agency_id_fk" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stopTimes" ADD CONSTRAINT "stopTimes_tc_agency_id_agency_tc_agency_id_fk" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stopTimes" ADD CONSTRAINT "stopTimes_tc_agency_id_trip_id_trips_tc_agency_id_trip_id_fk" FOREIGN KEY ("tc_agency_id","trip_id") REFERENCES "trips"("tc_agency_id","trip_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tripUpdates" ADD CONSTRAINT "tripUpdates_tc_agency_id_agency_tc_agency_id_fk" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
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
 ALTER TABLE "tripUpdates" ADD CONSTRAINT "tripUpdates_tCAgencyId_tcAgency_id_fk" FOREIGN KEY ("tCAgencyId") REFERENCES "tcAgency"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_tc_agency_id_agency_tc_agency_id_fk" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
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
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_tCAgencyId_tcAgency_id_fk" FOREIGN KEY ("tCAgencyId") REFERENCES "tcAgency"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stopUpdates" ADD CONSTRAINT "stopUpdates_tc_agency_id_agency_tc_agency_id_fk" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
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
 ALTER TABLE "stopUpdates" ADD CONSTRAINT "stopUpdates_tCAgencyId_tcAgency_id_fk" FOREIGN KEY ("tCAgencyId") REFERENCES "tcAgency"("id") ON DELETE set null ON UPDATE cascade;
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
 ALTER TABLE "stops" ADD CONSTRAINT "stops_tc_agency_id_agency_tc_agency_id_fk" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Areas" ADD CONSTRAINT "Areas_tc_agency_id_agency_tc_agency_id_fk" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deadheadTimes" ADD CONSTRAINT "deadheadTimes_tc_agency_id_agency_tc_agency_id_fk" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deadheads" ADD CONSTRAINT "deadheads_tc_agency_id_agency_tc_agency_id_fk" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fareAttributes" ADD CONSTRAINT "fareAttributes_tc_agency_id_agency_tc_agency_id_fk" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fareProducts" ADD CONSTRAINT "fareProducts_tc_agency_id_agency_tc_agency_id_fk" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fareRules" ADD CONSTRAINT "fareRules_tc_agency_id_agency_tc_agency_id_fk" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "feedInfo" ADD CONSTRAINT "feedInfo_tc_agency_id_agency_tc_agency_id_fk" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "frequencies" ADD CONSTRAINT "frequencies_tc_agency_id_agency_tc_agency_id_fk" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Levels" ADD CONSTRAINT "Levels_tc_agency_id_agency_tc_agency_id_fk" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "opsLocations" ADD CONSTRAINT "opsLocations_tc_agency_id_agency_tc_agency_id_fk" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pathways" ADD CONSTRAINT "pathways_tc_agency_id_agency_tc_agency_id_fk" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "runEvent" ADD CONSTRAINT "runEvent_tc_agency_id_agency_tc_agency_id_fk" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "runsPieces" ADD CONSTRAINT "runsPieces_tc_agency_id_agency_tc_agency_id_fk" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "serviceAlertTargets" ADD CONSTRAINT "serviceAlertTargets_tc_agency_id_agency_tc_agency_id_fk" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stopAttributes" ADD CONSTRAINT "stopAttributes_tc_agency_id_agency_tc_agency_id_fk" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "serviceAlerts" ADD CONSTRAINT "serviceAlerts_tc_agency_id_agency_tc_agency_id_fk" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "timetableStopOrder" ADD CONSTRAINT "timetableStopOrder_tc_agency_id_agency_tc_agency_id_fk" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "timetables" ADD CONSTRAINT "timetables_tc_agency_id_agency_tc_agency_id_fk" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "translations" ADD CONSTRAINT "translations_tc_agency_id_agency_tc_agency_id_fk" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "translations" ADD CONSTRAINT "translations_tCAgencyId_tcAgency_id_fk" FOREIGN KEY ("tCAgencyId") REFERENCES "tcAgency"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vehiclePositions" ADD CONSTRAINT "vehiclePositions_tc_agency_id_agency_tc_agency_id_fk" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vehiclePositions" ADD CONSTRAINT "vehiclePositions_tCAgencyId_tcAgency_id_fk" FOREIGN KEY ("tCAgencyId") REFERENCES "tcAgency"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shapesGeos" ADD CONSTRAINT "shapesGeos_tc_agency_id_agency_tc_agency_id_fk" FOREIGN KEY ("tc_agency_id") REFERENCES "agency"("tc_agency_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
