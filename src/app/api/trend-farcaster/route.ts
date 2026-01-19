// Комментарий: Роут для топ-темы в Farcaster / Base (за последние 24 часа)

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Комментарий: Заглушка для Farcaster/Base трендов
    const topTrend = 'DEGEN + CLANKER meme coins';

    return NextResponse.json({ topTrend });
  } catch (error) {
    console.error('Farcaster trend error:', error);
    return NextResponse.json({ error: 'Failed to fetch Farcaster/Base trend' }, { status: 500 });
  }
}
