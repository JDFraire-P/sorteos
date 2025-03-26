// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('authToken');
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  // lógica para verificar la validez del token
  const tokenValido = await verificarToken(token);
  if (!tokenValido) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }
  return NextResponse.next();
}

export const config = {
  // Protege la ruta app/api/sorteos/[numerosorteo]/boletos/[numeroboleto]/route.ts
  matcher: ['/api/sorteos/*/boletos/*'],
};
