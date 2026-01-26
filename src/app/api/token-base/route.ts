import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // CoinGecko Base Ecosystem — РЕАЛЬНЫЕ ДАННЫЕ!
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=base-ecosystem&order=volume_desc&per_page=1&page=1&sparkline=false'
    );
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      const topToken = data[0];
      return NextResponse.json({
        topToken: `${topCoin.symbol.toUpperCase()} - $${topCoin.current_price.toFixed(6)} (+${Math.round(topCoin.price_change_percentage_24h || 0)}%) 🚀`,
        tokenAddress: topCoin.platforms?.base || topCoin.id,
        link: 'https://trends-button.vercel.app'
      });
    }
  } catch (error) {
    console.log('CoinGecko error');
  }

  // Твои токены как backup
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
