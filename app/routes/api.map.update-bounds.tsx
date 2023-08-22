import { ActionArgs, json } from "@remix-run/server-runtime";
import { zBoundsUpdate } from "~/components/Mapbox";
import { getUserSession } from "~/session/session.server";

export async function action({ request }: ActionArgs) {
  const formData = await request.formData()
  const { mapSettings, setMapSettings } = await getUserSession(request);

  try {
    const bounds = zBoundsUpdate.parse(formData.get("bounds"));

    const headings = {
      headers: {
        "Set-Cookie": await setMapSettings({
          ...mapSettings,
          bounds,
        }),
      },
    };

    return json({ action }, headings);
  } catch (error) {
    throw json(
      {
        error,
      },
    );
  }
}
