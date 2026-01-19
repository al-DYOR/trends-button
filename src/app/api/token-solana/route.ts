// Комментарий: Роут для перспективного токена на Solana (упоминания за последние 2 часа)

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Комментарий: Заглушка для Solana токенов
    const topToken = '$PsyopAnime – high volume early';

    return NextResponse.json({ topToken });
  } catch (error) {
    console.error('Solana token error:', error);
    return NextResponse.json({ error: 'Failed to fetch Solana token trend' }, { status: 500 });
  }
}
