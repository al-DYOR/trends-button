import { NextResponse } from 'next/server';

export async function GET() {
  const duneQueryId = '6597744';
  
  try {
    const response = await fetch(
      `https://api.dune.com/api/v1/query/${duneQueryId}/results?limit=1`,
      {
        headers: {
          'X-Dune-API-Key': process.env.DUNE_API_KEY!,
          'Accept': 'application/json'
        }
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      const result = data.result.rows[0];
      
      // ✅ ССЫЛКА НА КАСТ!
      const castUrl = `https://warpcast.com/~/cast/${result.castHash}`;
      
      return NextResponse.json({
        topTrend: result.topTrend || 'Farcaster live 🚀',
        link: castUrl,  // ← КЛИКАБЕЛЬНАЯ ССЫЛКА!
        postUrl: castUrl
      });
    }
  } catch {}

  return NextResponse.json({
    topTrend: 'Farcaster live trends 🚀',
    link: 'https://warpcast.com',
    postUrl: 'https://warpcast.com'
  });
}
