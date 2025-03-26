import { NextResponse } from "next/server";
import Admin from "@/models/mongo/Administrador";
import { connectDB } from "@/lib/mongo";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  await connectDB();
  const { nickname, password } = await req.json();

  const admin = await Admin.findOne({ nickname });
  if (!admin) return NextResponse.json({ error: "Admin no encontrado" }, { status: 401 });

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });

  // Crear token JWT
  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET!, { expiresIn: "1h" });

  return NextResponse.json({ token });
}
