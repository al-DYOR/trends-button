import { NextResponse } from 'next/server';

export async function GET() {
  // НОВЫЙ Query ID после сохранения!
  const duneQueryId = '6597744'; // ← ЗАМЕНИ на новый!
  
  try {
    const response = await fetch(
      `https://api.dune.com/api/v1/query/${duneQueryId}/results?limit=1`
    );
    
    if (response.ok) {
      const data = await response.json();
      const result = data.result.rows[0];
      
      return NextResponse.json({
        topTrend: result.topTrend || 'Farcaster live discussion 🚀',
        link: 'https://trends-button.vercel.app',
        postUrl: 'https://trends-button.vercel.app'
      });
    }
  } catch {}

  return NextResponse.json({
    topTrend: 'Farcaster: altcoins domination? 🐻🔴',
    link: 'https://trends-button.vercel.app',
    postUrl: 'https://trends-button.vercel.app'
  });
}
