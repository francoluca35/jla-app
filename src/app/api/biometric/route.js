import clientPromise from "../../../../lib/mongodb";

const MAX_SLOTS = 3;

function buildConfig(deviceData = {}) {
  const credentialIds = Array.isArray(deviceData?.credentialIds)
    ? deviceData.credentialIds.filter(Boolean).slice(0, MAX_SLOTS)
    : [];
  const slots = [false, false, false];
  credentialIds.forEach((_, index) => {
    if (index < MAX_SLOTS) slots[index] = true;
  });

  return {
    prompted: Boolean(deviceData?.prompted),
    slots,
    credentialIds,
  };
}

export async function POST(req) {
  try {
    const { action, username, deviceId, credentialId } = await req.json();

    if (!action || !username || !deviceId) {
      return new Response(
        JSON.stringify({ error: "Faltan datos requeridos (action, username o deviceId)." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const client = await clientPromise;
    const db = client.db("jlapp");
    const users = db.collection("users");
    const user = await users.findOne({ username });

    if (!user) {
      return new Response(JSON.stringify({ error: "Usuario no encontrado." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const biometricDevices = user.biometricDevices || {};
    const deviceData = biometricDevices[deviceId] || {};

    if (action === "status") {
      return new Response(JSON.stringify({ config: buildConfig(deviceData) }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (action === "mark_prompted") {
      await users.updateOne(
        { username },
        { $set: { [`biometricDevices.${deviceId}.prompted`]: true } }
      );
      const refreshed = await users.findOne({ username });
      return new Response(
        JSON.stringify({
          config: buildConfig(refreshed?.biometricDevices?.[deviceId]),
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    if (action === "register") {
      if (!credentialId) {
        return new Response(JSON.stringify({ error: "Falta credentialId." }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const currentIds = Array.isArray(deviceData.credentialIds)
        ? deviceData.credentialIds.filter(Boolean)
        : [];
      if (currentIds.includes(credentialId)) {
        return new Response(JSON.stringify({ config: buildConfig(deviceData) }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      if (currentIds.length >= MAX_SLOTS) {
        return new Response(JSON.stringify({ error: "Ya hay 3 huellas configuradas." }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const updatedIds = [...currentIds, credentialId];
      await users.updateOne(
        { username },
        {
          $set: {
            [`biometricDevices.${deviceId}.credentialIds`]: updatedIds,
            [`biometricDevices.${deviceId}.prompted`]: true,
            [`biometricDevices.${deviceId}.updatedAt`]: new Date().toISOString(),
          },
        }
      );
      return new Response(
        JSON.stringify({
          config: buildConfig({
            prompted: true,
            credentialIds: updatedIds,
          }),
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    if (action === "login_with_credential") {
      if (!credentialId) {
        return new Response(JSON.stringify({ error: "Falta credentialId." }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const currentIds = Array.isArray(deviceData.credentialIds)
        ? deviceData.credentialIds.filter(Boolean)
        : [];
      if (!currentIds.includes(credentialId)) {
        return new Response(JSON.stringify({ error: "Huella no registrada en este dispositivo." }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(
        JSON.stringify({ username: user.username, role: user.role }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    if (action === "clear") {
      await users.updateOne(
        { username },
        { $unset: { [`biometricDevices.${deviceId}`]: "" } }
      );
      return new Response(
        JSON.stringify({
          config: { prompted: false, slots: [false, false, false], credentialIds: [] },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ error: "Acción no válida." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error en /api/biometric:", error);
    return new Response(JSON.stringify({ error: "Error interno del servidor." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
