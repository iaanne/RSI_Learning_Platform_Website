import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Kita matikan dulu fungsi lempar-melempar ke login 
  // Biar kamu bebas akses /dashboard/siswa, /dashboard/guru, dll.
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Jalankan middleware untuk semua rute kecuali file statis
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};