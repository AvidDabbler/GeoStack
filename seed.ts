import { loadAgencies } from './drizzle/seed'

export const fullSeed = async () => {
  await loadAgencies()
}

fullSeed()
