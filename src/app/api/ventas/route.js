import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";

const TIPOS_VALIDOS = [
  "horno",
  "freidora",
  "anafes",
  "camaras de fermentacion",
  "articulo de acero inox",
];

export async function POST(req) {
  try {
    const data = await req.json();

    const cantidad = Number(data?.cantidad);
    const precioUnidad = Number(data?.precioUnidad);
    const nombreProducto = String(data?.nombreProducto || "").trim();
    const vendidoA = String(data?.vendidoA || "").trim();
    const direccionLugar = String(data?.direccionLugar || "").trim();
    const tipoVenta = String(data?.tipoVenta || "").trim().toLowerCase();

    if (!TIPOS_VALIDOS.includes(tipoVenta)) {
      return NextResponse.json({ error: "Tipo de venta inválido." }, { status: 400 });
    }
    if (!nombreProducto) {
      return NextResponse.json({ error: "El nombre del producto es obligatorio." }, { status: 400 });
    }
    if (!vendidoA) {
      return NextResponse.json({ error: "Indicá a quién se lo vendiste." }, { status: 400 });
    }
    if (!direccionLugar) {
      return NextResponse.json({ error: "La dirección del lugar es obligatoria." }, { status: 400 });
    }
    if (!Number.isFinite(cantidad) || cantidad <= 0) {
      return NextResponse.json({ error: "La cantidad debe ser mayor a 0." }, { status: 400 });
    }
    if (!Number.isFinite(precioUnidad) || precioUnidad < 0) {
      return NextResponse.json({ error: "El precio por unidad es inválido." }, { status: 400 });
    }
    if (!data?.fechaVenta) {
      return NextResponse.json({ error: "La fecha de venta es obligatoria." }, { status: 400 });
    }

    const venta = {
      tipoVenta,
      nombreProducto,
      vendidoA,
      direccionLugar,
      cantidad,
      precioUnidad,
      total: Number.isFinite(Number(data?.total))
        ? Number(data.total)
        : Number((cantidad * precioUnidad).toFixed(2)),
      sena: Boolean(data?.sena),
      ventaDesdeStock: Boolean(data?.ventaDesdeStock),
      fechaVenta: data.fechaVenta,
      createdAt: data?.createdAt ? new Date(data.createdAt) : new Date(),
    };

    const client = await clientPromise;
    const db = client.db("jlapp");
    const result = await db.collection("ventas").insertOne(venta);

    return NextResponse.json({
      ok: true,
      message: "Venta registrada",
      id: result.insertedId,
    });
  } catch (error) {
    console.error("Error al guardar venta:", error);
    return NextResponse.json({ error: "Error al guardar venta." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("jlapp");
    const ventas = await db.collection("ventas").find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(ventas);
  } catch (error) {
    console.error("Error al obtener ventas:", error);
    return NextResponse.json({ error: "Error al obtener ventas." }, { status: 500 });
  }
}
