import { NextResponse } from 'next/server';

export async function GET() {
  const duneQueryId = '6597744'; // Твой рабочий query ✅
  
  try {
    const response = await fetch(
      `https://api.dune.com/api/v1/query/${duneQueryId}/results?limit=1`,
      {
        headers: {
          'X-Dune-API-Key': process.env.DUNE_API_KEY!, // ← API КЛЮЧ!
          'Accept': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      console.error('Dune status:', response.status);
      throw new Error('Dune API failed');
    }
    
    const data = await response.json();
    const result = data.result.rows[0];
    
    // ТВОЙ ТЕКСТ КАСТА!
    return NextResponse.json({
      topTrend: result.topTrend || result.text || 'Farcaster live 🚀',
      link: 'https://trends-button.vercel.app',
      postUrl: 'https://trends-button.vercel.app'
    });
    
  } catch (error) {
    console.error('Dune error:', error);
    return NextResponse.json({
      topTrend: 'Farcaster: реальные обсуждения 🚀', // ← Пока без API key
      link: 'https://trends-button.vercel.app',
      postUrl: 'https://trends-button.vercel.app'
    });
  }
}
