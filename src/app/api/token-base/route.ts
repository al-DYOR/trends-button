import { NextResponse } from 'next/server';

export async function GET() {
  // 1. DUNE 6596636 (ТОП ПРИОРИТЕТ — актуальные данные)
  try {
    const duneResponse = await fetch(
      `https://api.dune.com/api/v1/query/6596636/results?limit=1`,
      { next: { revalidate: 300 } }
    );

    if (duneResponse.ok) {
      const data = await duneResponse.json();
      const result = data.result.rows[0];
      
      if (result?.topic) {
        return NextResponse.json({
          topToken: `${result.topic} - ${result.mentions || 'live'} Farcaster mentions 🚀`,
          tokenAddress: '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed', // DEGEN
          link: 'https://trends-button.vercel.app'
        });
      }
    }
  } catch (duneError) {
    console.log('Dune unavailable → using твои токены');
  }

  // 2. ТОКЕНЫ (ВСЕГДА работают если DUNE нет)
  const yourBaseTokens = [
    { name: 'DEGEN', addr: '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed' },
    { name: 'BRETT', addr: '0x532f27101965dd16442E59d40670FaF5eBB142E4' },
    { name: 'TOSHI', addr: '0xAC1Bd2486aAf3B5C0fc3Fd868558b082a531B2B4' }
  ];

  // РАБОТАЕТ ГАРАНТИРОВАННО — меняется каждый час
  const tokenIndex = Math.floor(Date.now() / 3600000) % yourBaseTokens.length;
  const selectedToken = yourBaseTokens[tokenIndex];

  return NextResponse.json({
    topToken: `${selectedToken.name} - Base trending 🚀`,
    tokenAddress: selectedToken.addr,
    link: 'https://trends-button.vercel.app'
  });
}
