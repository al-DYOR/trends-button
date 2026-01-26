import { NextResponse } from 'next/server';

export async function GET() {
  // Ротация реальных Farcaster тем (НЕ токены!)
  const farcasterTopics = [
    'Frames are the new meta',
    'Miniapps going viral on Base',
    'Degen channel daily discussion',
    'Powerbadge accumulation phase', 
    'Farcaster x Base summer',
    'Channel wars heating up',
    'Warpcast notifications broken?',
    '/degen tuesday thread'
  ];

  const topic = farcasterTopics[Math.floor(Date.now() / 1800000) % farcasterTopics.length];

  return NextResponse.json({
    topTrend: topic + ' 🚀',
    link: 'https://trends-button.vercel.app',
    postUrl: 'https://trends-button.vercel.app'
  });
}
