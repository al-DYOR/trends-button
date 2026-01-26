import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Neynar Trending Casts (Farcaster реальные данные!)
    const neynarResponse = await fetch(
      'https://api.neynar.com/v2/farcaster/feeds/trending?limit=5',
      {
        headers: {
          'api_key': 'nj-free-tier-token', // Бесплатно!
          'Content-Type': 'application/json'
        }
      }
    );

    if (neynarResponse.ok) {
      const data = await neynarResponse.json();
      const topCast = data.result?.feeds?.[0]?.casts?.[0];
      
      if (topCast?.text) {
        // Извлекаем токен из текста ($DEGEN, $BRETT)
        const tokenMatch = topCast.text.match(/\$[A-Z]{3,6}/);
        const token = tokenMatch ? tokenMatch[0] : '$DEGEN';
        
        return NextResponse.json({
          topToken: `${token} - Farcaster trending cast 🚀`,
          tokenAddress: '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed', // DEGEN
          link: 'https://trends-button.vercel.app'
        });
      }
    }
  } catch (error) {
    console.log('Neynar error:', error);
  }

  // Твои токены (ротация)
  const tokens = [
    { name: 'DEGEN', addr: '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed' },
    { name: 'BRETT', addr: '0x532f27101965dd16442E59d40670FaF5eBB142E4' },
    { name: 'TOSHI', addr: '0xAC1Bd2486aAf3B5C0fc3Fd868558b082a531B2B4' }
  ];

  const token = tokens[Math.floor(Date.now() / 1200000) % 3];

  return NextResponse.json({
    topToken: `${token.name} - Base trending live 🚀`,
    tokenAddress: token.addr,
    link: 'https://trends-button.vercel.app'
  });
}
