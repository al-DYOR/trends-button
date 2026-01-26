import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=base-ecosystem&order=market_cap_desc&per_page=10&page=1&sparkline=false'
    );
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      // ФИЛЬТР: НЕ USDC/USDT/стаблкоины + есть Base адрес
      const topMeme = data.find((coin: any) => 
        coin.platforms?.base && 
        !['usd-coin', 'tether', 'dai'].includes(coin.id) &&
        coin.symbol.length < 6
      );
      
      if (topMeme) {
        return NextResponse.json({
          topToken: `${topMeme.symbol.toUpperCase()} - $${topMeme.current_price.toFixed(6)} (+${Math.round(topMeme.price_change_percentage_24h || 0)}%) 🚀`,
          tokenAddress: topMeme.platforms.base,
          link: 'https://trends-button.vercel.app'
        });
      }
    }
  } catch (error) {
    console.log('CoinGecko error');
  }

  // Твои токены
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
