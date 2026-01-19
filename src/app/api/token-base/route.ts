// Комментарий: Роут для перспективного токена на Base/ETH (упоминания за последние 2 часа)

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Комментарий: Заглушка для Base/ETH токенов
    const topToken = '$CHZ – trending on Base';

    return NextResponse.json({ topToken });
  } catch (error) {
    console.error('Base token error:', error);
    return NextResponse.json({ error: 'Failed to fetch Base/ETH token trend' }, { status: 500 });
  }
}
