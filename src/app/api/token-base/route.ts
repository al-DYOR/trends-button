import { NextResponse } from 'next/server';

export async function GET() {
  // ← ЗАМЕНА ЛЕВОГО 39298472 на 6596636!
  const duneQueryId = '6596636'; 

  try {
    const response = await fetch(
      `https://api.dune.com/api/v1/query/${duneQueryId}/results?limit=1`,
      { 
        next: { revalidate: 300 } // 5 минут
      }
    );

    if (response.ok) {
      const data = await response.json();
      const result = data.result.rows[0];
      
      if (result?.topic) {
        return NextResponse.json({
          topToken: `${result.topic} - ${result.mentions} Farcaster mentions 🚀`,
          tokenAddress: '0x4ed4E862860Bed51D39FEAaFE867bAcf5a40eC6e',
          link: `https://searchcaster.xyz/?q=${encodeURIComponent(result.topic)}`
        });
      }
    }
  } catch (error) {
    console.error('Dune error:', error);
  }

  // Fallback (меняется каждый час)
  const trends = ['$DEGEN', '$BRETT', '$TOSHI'];
  const trend = trends[Math.floor(Date.now() / 3600000) % 3];

  return NextResponse.json({
    topToken: `${trend} - Farcaster trending`,
    tokenAddress: '0x4ed4E862860Bed51D39FEAaFE867bAcf5a40eC6e',
    link: `https://searchcaster.xyz/?q=${encodeURIComponent(trend)}`
  });
}
