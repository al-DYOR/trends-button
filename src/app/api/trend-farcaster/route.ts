import { NextResponse } from 'next/server';

export async function GET() {
  // Farcaster нарративы/новости (НЕ токены)
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=volume_desc&per_page=3&page=1'
    );
    const data = await response.json();
    
    if (data && data.length > 0) {
      // Генерируем нарратив из топ-3 токенов
      const trends = data.slice(0, 3).map((coin: any) => coin.symbol.toUpperCase());
      const narrative = `${trends.join(' + ')} = Farcaster new meta 🚀`;
      
      return NextResponse.json({
        topTrend: narrative,
        link: 'https://trends-button.vercel.app',
        postUrl: 'https://trends-button.vercel.app'
      });
    }
  } catch {}

  // Ротация Farcaster нарративов (каждые 30 мин)
  const narratives = [
    'Frames + Base = new meta 🚀',
    'Miniapps going viral',
    'Degen channel pumping',
    'Powerbadge holders accumulating'
  ];
  
  const trend = narratives[Math.floor(Date.now() / 1800000) % narratives.length];

  return NextResponse.json({
    topTrend: trend,
    link: 'https://trends-button.vercel.app',
    postUrl: 'https://trends-button.vercel.app'
  });
}
