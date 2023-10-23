import pgPromise from 'pg-promise'
import { downloadFile, extractZip, listDir, makeDir } from '../app/utils/files'
import csvtojson from 'csvtojson'
import { database } from './index'
import { tables } from './schema'
import { prisma } from '../prisma/index'
import { AgencyConfig } from '~/utils/agency'

const colParser = {
  id: 'string',
  service_id: 'string',
  route_id: 'string',
  route_short_name: 'string',
  route_long_name: 'string',
  network_id: 'string',
  route_text_color: 'string',
  route_color: 'string',
  shape_id: 'string',
  stop_id: 'string',
  stop_code: 'string',
  stop_name: 'string',
  tts_stop_name: 'string',
  stop_desc: 'string',
  zone_id: 'string',
  stop_url: 'string',
  parent_station: 'string',
  stop_timezone: 'string',
  level_id: 'string',
  platform_code: 'string',
  from_stop_id: 'string',
  to_stop_id: 'string',
  from_route_id: 'string',
  to_route_id: 'string',
  from_trip_id: 'string',
  to_trip_id: 'string',
  trip_id: 'string',
  trip_headsign: 'string',
  trip_short_name: 'string',
  block_id: 'string',
  bikes_allowed: 'string',
}

const shapesGeomInsertStatement = (timestamp: Date, agencyId: string) => {
  return `INSERT INTO "shapesGeos" 
              SELECT shape_id, 
              to_timestamp(${timestamp.getTime()} / 1000.0) AS updatedAt, 
              ST_Simplify(ST_GeomFromText('LineString(' || pt_seq || ')', 4326), 0.00001) AS geom
              FROM (SELECT shape_id, string_agg(shape_pt_lon || ' ' || shape_pt_lat, ',' ORDER BY shape_pt_sequence) AS pt_seq
              FROM "shapes" GROUP BY shape_id
              ) shp`
}

const stopsGeomUpdate = async (agencyId: string) => {
  const query = `
  update stops
  set geom = ST_SetSRID(ST_MakePoint(stop_lon, stop_lat),4326)`
  await pgClient.query(`
                  update stops
                  set geom = ST_SetSRID(ST_MakePoint(stop_lon, stop_lat),4326)`)
}

const convertFile = async (
  fileName: string,
  timestamp: Date,
  agencyId: string,
  filterOut: (j: any) => boolean = () => true,
) => {
  return await csvtojson({ colParser, checkType: true, ignoreEmpty: true })
    .fromFile(`.zip/csv/${agencyId}/${fileName}`)
    .then((json) => {
      const newArr: any = []
      for (const item of json) {
        if (!filterOut(item)) continue
        newArr.push({
          ...item,
          updatedAt: timestamp,
        })
      }
      return newArr
    })
}

// ! i stole this from here - https://dev.to/yogski/optimizing-conditional-bulk-insert-in-node-js-postgresql-26gd
const bulkInsertStatement = (tableName: string, bulkData: any[]) => {
  try {
    const columns = Object.keys(bulkData[0]).map((str) => str.trim())
    const setTable = new pgp.helpers.ColumnSet(columns, { table: tableName })
    return pgp.helpers.insert(bulkData, setTable)
  } catch (error) {
    console.log({ error })
    throw Error('Cannot create insert query for: ' + tableName)
  }
}

const execInsertTransaction = async (
  tableName: string,
  insertStatement: string,
) => {
  return await pgClient
    .tx(`update ${tableName}`, async (t) => {
      await t.none(insertStatement)
    })
    .catch((err) => {
      console.error(`issue with updating ${tableName}`)
    })
}

const bulkInsertTransaction = async (tableName: string, bulkData: any[]) => {
  const insertStatement = bulkInsertStatement(tableName, bulkData)
  return await execInsertTransaction(tableName, insertStatement)
}

const agencyImport = async (
  agencyId: string,
  fileName: string,
  timestamp: Date,
) => {
  const json = await convertFile(fileName, timestamp, agencyId)

  for (const agency of json) {
    const newAgency = { ...agency, agency_id: agencyId }
    const ag = {
      agencyPhone: newAgency.agency_phone,
      agencyUrl: newAgency.agency_url,
      agencyLang: newAgency.agency_lang,
      agencyName: newAgency.agency_name,
      agencyTimezone: newAgency.agency_timezone,
      agencyFareUrl: newAgency.agency_fare_url,
      agencyEmail: newAgency.agency_email,
      agencyId: newAgency.agency_id,
      updatedAt: new Date().toDateString(),
      createdAt: new Date().toDateString(),
    } as any
    await database.insert(tables.agency).values([ag])
  }
}

const calendarImport = async (
  agencyId: string,
  fileName: string,
  timestamp: Date,
) => {
  const json = await convertFile(fileName, timestamp, agencyId)

  await prisma.calendar.createMany({
    data: json,
  })
}

const calendarDatesImport = async (
  agencyId: string,
  fileName: string,
  timestamp: Date,
) => {
  const json = await convertFile(fileName, timestamp, agencyId)
  await prisma.$transaction([
    prisma.calendarDates.createMany({
      data: json,
    }),
  ])
}

const routesImport = async (
  agencyId: string,
  fileName: string,
  timestamp: Date,
) => {
  const json = await convertFile(fileName, timestamp, agencyId)
  await prisma.$transaction([
    prisma.routes.createMany({
      data: json.map((routes) => {
        return {
          ...routes,
          agency_id: agencyId,
        }
      }),
    }),
  ])
}

const shapesImport = async (
  agencyId: string,
  fileName: string,
  timestamp: Date,
) => {
  const json = await convertFile(fileName, timestamp, agencyId)
  await bulkInsertTransaction('shapes', json)
  const insertQueryGeom = shapesGeomInsertStatement(timestamp, agencyId)
  await execInsertTransaction('shapesGeos', insertQueryGeom)
}

// ! this does not work - might have something to do with new import times
const stopTimesImport = async (
  agencyId: string,
  fileName: string,
  timestamp: Date,
) => {
  try {
    const json = await convertFile(fileName, timestamp, agencyId)

    // !update to have arrival and departure timestamps converted if not present
    await bulkInsertTransaction('stopTimes', json)
  } catch (e) {
    console.log(e)
  }
}

const stopsImport = async (
  agencyId: string,
  fileName: string,
  timestamp: Date,
) => {
  try {
    let json = await convertFile(fileName, timestamp, agencyId)
    json = json.map((item) => {
      delete item.stop_desc
      delete item.wheelchair_boarding
      return {
        ...item,
        geom: null,
      }
    })

    await bulkInsertTransaction('stops', json)
    await stopsGeomUpdate(agencyId)
  } catch (e) {
    console.log(e)
  }
}

const transfersImport = async (
  agencyId: string,
  fileName: string,
  timestamp: Date,
) => {
  const json = await convertFile(fileName, timestamp, agencyId)
  await prisma.$transaction([
    prisma.transfers.createMany({
      data: json,
    }),
  ])
}

const tripsImport = async (
  agencyId: string,
  fileName: string,
  timestamp: Date,
) => {
  try {
    const json = await convertFile(fileName, timestamp, agencyId)
    await bulkInsertTransaction('trips', json)
  } catch (e) {
    console.log(e)
  }
}

export const agencyFileUpload = async (
  agencyConfig: AgencyConfig,
  fileLocs: string[],
) => {
  const timestamp = new Date()

  for (const fileName of fileLocs) {
    console.log(`start of ${fileName}`)
    switch (fileName) {
      case 'agency.txt':
        await agencyImport(agencyConfig.id, fileName, timestamp)
        break
      case 'calendar.txt':
        await calendarImport(agencyConfig.id, fileName, timestamp)
        break
      case 'calendar_dates.txt':
        await calendarDatesImport(agencyConfig.id, fileName, timestamp)
        break
      case 'routes.txt':
        await routesImport(agencyConfig.id, fileName, timestamp)
        break
      case 'shapes.txt':
        await shapesImport(agencyConfig.id, fileName, timestamp)
        break
      case 'stop_times.txt':
        await tripsImport(agencyConfig.id, 'trips.txt', timestamp)
        await stopTimesImport(agencyConfig.id, fileName, timestamp)
        break
      case 'stops.txt':
        await stopsImport(agencyConfig.id, fileName, timestamp)
        break
      case 'transfers.txt':
        await transfersImport(agencyConfig.id, fileName, timestamp)
        break
      default:
        console.log('unknown file')
        break
    }
    console.log(`end of ${fileName}`)
  }
}

export const clearGtfsRecords = async () => {
  pgClient.query(`TRUNCATE TABLE "calendarDates",
    "agency",
    "calendar",
    "trips",
    "stopTimes",
    "tripUpdates",
    "shapesGeos",
    "transfers",
    "stops",
    "shapes",
    "routes",
    "Areas",
    "deadheadTimes",
    "deadheads",
    "directions",
    "fareAttributes",
    "fareProducts",
    "fareRules",
    "feedInfo",
    "frequencies",
    "Levels",
    "opsLocations",
    "pathways",
    "runEvent",
    "runsPieces",
    "serviceAlertTargets",
    "stopAttributes",
    "serviceAlerts",
    "timetableStopOrder",
    "timetables",
    "agency";`)
}

export const pgp = pgPromise()
export const pgClient = pgp(process.env.DATABASE_URL ?? '')

export const loadAgencies = async () => {
  makeDir('.zip')
  makeDir('.zip/csv')

  const allAgencies = [
    {
      id: 'stlouis',
      name: 'St Louis',
      url: 'https://metrostlouis.org/Transit/google_transit.zip',
      tripUpdates:
        'https://www.metrostlouis.org/RealTimeData/StlRealTimeTrips.pb',
      vehicleUpdates:
        'https://www.metrostlouis.org/RealTimeData/StlRealTimeVehicles.pb',
      exclude: ['directions'],
      timezone: 'America/Chicago',
      excludeList: ['MLR,MetroLink Red Line', 'MetroLink Blue Line'],
    },
  ]

  // download and extract all gtfs files
  await clearGtfsRecords()
  for (const agency of allAgencies) {
    const fileName = `.zip/${agency.id}.zip`
    const outDir = `.zip/csv/${agency.id}`
    await downloadFile(agency.url, fileName)
    extractZip(fileName, outDir)
    const files = listDir(outDir).filter(
      (fileName) => !agency.exclude.includes(fileName.split('.')[0]),
    )
    await agencyFileUpload(agency, files)
    console.log('fin')
  }
}

loadAgencies()
