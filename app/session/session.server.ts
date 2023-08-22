import { createCookieSessionStorage } from "@remix-run/node";

export const COOKIE_KEY = 'COOKIE_KEY_NOT_SAFE';

type SessionData = {
  mapSettings: SessionMapType;
};

type SessionFlashData = {
  error: string;
};

export type SessionMapType = {
  agencies: { id: string; name: string }[];
  bounds: null | [[number, number], [number, number]];
  loadedBounds: null | number[][];
  routes: { tc_agency_id: string; route_id: string }[];
};

export const userStorage = createCookieSessionStorage<
  SessionData,
  SessionFlashData
>({
  cookie: {
    name: COOKIE_KEY,
    secrets: ['SESSION_SECRET'],
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export const emptyMapFiltereFilter: SessionMapType = {
  agencies: [],
  bounds: null,
  loadedBounds: null,
  routes: [],
};

export async function getUserSession(request: Request) {
  const session = await userStorage.getSession(request.headers.get("Cookie"));
  const commit = () => userStorage.commitSession(session);
  const destroy = async () => await userStorage.destroySession(session);
  const mapSettings: SessionMapType =
    session.get("mapSettings") || emptyMapFiltereFilter;

  const setMapSettings = async (filters: SessionMapType) => {
    session.set("mapSettings", filters);
    return await commit();
  };

  return {
    session,
    commit,
    destroy,
    setMapSettings,
    mapSettings,
  };
}