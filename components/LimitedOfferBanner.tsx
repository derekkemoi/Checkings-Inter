'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Gift, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { BASE_PRICE_USD, CURRENCY_SYMBOLS } from '@/lib/constants';

export default function LimitedOfferBanner() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);
  const { user, loading } = useAuthStore();

  const offerPrice = `${CURRENCY_SYMBOLS.USD}${BASE_PRICE_USD.toFixed(2)}`;

  const ctaRoute = useMemo(() => {
    if (loading) return '/register';
    if (!user) return '/register';
    if (!user.purposes || user.purposes.length === 0) return '/purpose';
    if (!user.paymentMade) return '/payment';
    return '/dashboard';
  }, [user, loading]);

  useEffect(() => {
    setMounted(true);

    const calculateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setHours(24, 0, 0, 0);
      const difference = tomorrow.getTime() - now.getTime();

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed top-16 left-0 right-0 z-40 overflow-hidden bg-gradient-to-r from-red-50 via-white to-green-50 border-b-2 border-red-200 shadow-md">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-2 left-[10%] w-3 h-3 bg-red-400 rounded-full animate-twinkle opacity-60" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-4 left-[25%] w-2 h-2 bg-yellow-400 rounded-full animate-twinkle opacity-70" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-1 left-[45%] w-3 h-3 bg-green-400 rounded-full animate-twinkle opacity-60" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-5 left-[60%] w-2 h-2 bg-red-400 rounded-full animate-twinkle opacity-70" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-2 left-[80%] w-3 h-3 bg-yellow-400 rounded-full animate-twinkle opacity-60" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-4 left-[95%] w-2 h-2 bg-green-400 rounded-full animate-twinkle opacity-70" style={{ animationDelay: '2.5s' }}></div>

        <div className="absolute top-1 right-[15%] text-2xl animate-float opacity-40" style={{ animationDelay: '0s' }}>🎄</div>
        <div className="absolute top-3 right-[75%] text-xl animate-float opacity-40" style={{ animationDelay: '1s' }}>✨</div>
        <div className="absolute top-2 right-[40%] text-2xl animate-float opacity-40" style={{ animationDelay: '2s' }}>🎁</div>
      </div>

      <div className="relative py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-shrink-0">
            <Gift className="w-5 h-5 text-red-600 animate-bounce" style={{ animationDuration: '2s' }} />
            <span className="text-sm font-bold text-red-600 uppercase tracking-wide">Christmas Special</span>
          </div>

          <div className="flex-1 overflow-hidden">
            <div className="animate-marquee whitespace-nowrap">
              <span className="inline-block text-base md:text-lg font-semibold text-gray-800 mx-8">
                🎅 Limited Time Christmas Offer! Get Your Full CRB Report for Only <span className="text-red-600 font-bold">{offerPrice}</span> – Save 60%!
              </span>
              <span className="inline-block text-base md:text-lg font-semibold text-gray-800 mx-8">
                🎄 Christmas Special: Complete Credit Report Just <span className="text-green-600 font-bold">{offerPrice}</span> – Limited Time Only!
              </span>
              <span className="inline-block text-base md:text-lg font-semibold text-gray-800 mx-8">
                ⭐ Holiday Deal: Full CRB Status Check for Only <span className="text-red-600 font-bold">{offerPrice}</span> – Don't Miss Out!
              </span>
              <span className="inline-block text-base md:text-lg font-semibold text-gray-800 mx-8">
                🎅 Limited Time Christmas Offer! Get Your Full CRB Report for Only <span className="text-red-600 font-bold">{offerPrice}</span> – Save 60%!
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-red-200 shadow-sm">
              <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
              <div className="text-sm">
                <span className="font-medium text-gray-700">Offer Ends In:</span>
                <div className="flex items-center gap-1 font-bold text-red-600 tabular-nums">
                  <span className="bg-red-100 px-2 py-0.5 rounded">{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span>:</span>
                  <span className="bg-red-100 px-2 py-0.5 rounded">{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span>:</span>
                  <span className="bg-red-100 px-2 py-0.5 rounded">{String(timeLeft.seconds).padStart(2, '0')}</span>
                </div>
              </div>
            </div>

            <Link href={ctaRoute}>
              <Button
                size="sm"
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-green-500"
              >
                Claim Offer Now
              </Button>
            </Link>
          </div>
        </div>

        <div className="sm:hidden mt-2 flex items-center justify-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-red-200 shadow-sm max-w-xs mx-auto">
          <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
          <div className="text-xs">
            <span className="font-medium text-gray-700">Ends In:</span>
            <div className="flex items-center gap-1 font-bold text-red-600 tabular-nums">
              <span className="bg-red-100 px-1.5 py-0.5 rounded text-xs">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="text-xs">:</span>
              <span className="bg-red-100 px-1.5 py-0.5 rounded text-xs">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="text-xs">:</span>
              <span className="bg-red-100 px-1.5 py-0.5 rounded text-xs">{String(timeLeft.seconds).padStart(2, '0')}</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-marquee {
          display: inline-block;
          animation: marquee 30s linear infinite;
        }

        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
