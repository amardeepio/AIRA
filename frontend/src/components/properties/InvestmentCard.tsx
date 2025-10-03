'use client';

'use client';

import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type Property } from "@/lib/properties-data";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '../ui/glass-card';

interface InvestmentCardProps {
  property: Property;
}

export function InvestmentCard({ property }: InvestmentCardProps) {
  const [shares, setShares] = useState('');
  const [usdcAmount, setUsdcAmount] = useState('');

  const pricePerShare = useMemo(() => {
    if (!property.price || !property.totalShares) return 0;
    const priceNumber = parseFloat(property.price.replace(/[^\d.]/g, ""));
    return priceNumber / property.totalShares;
  }, [property.price, property.totalShares]);

  const handleSharesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sharesValue = e.target.value;
    setShares(sharesValue);
    if (sharesValue === '' || parseFloat(sharesValue) < 0) {
      setUsdcAmount('');
    } else {
      const usdc = parseFloat(sharesValue) * pricePerShare;
      setUsdcAmount(usdc.toFixed(2));
    }
  };

  const handleUsdcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const usdcValue = e.target.value;
    setUsdcAmount(usdcValue);
    if (usdcValue === '' || parseFloat(usdcValue) < 0) {
      setShares('');
    } else {
      const sharesCalc = parseFloat(usdcValue) / pricePerShare;
      setShares(sharesCalc.toFixed(5)); // Allow for fractional shares
    }
  };

  const handleBuyClick = () => {
    console.log(`Buying ${shares} shares for ${usdcAmount} USDC for property ${property.id}`);
    // TODO: Implement smart contract interaction
  };

  return (
    <GlassCard>
      <GlassCardHeader className="border-b border-white/20">
        <GlassCardTitle>Invest in this Property</GlassCardTitle>
      </GlassCardHeader>
      <GlassCardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <div className="flex-grow w-full">
            <label htmlFor="shares" className="text-sm font-medium mb-2 block">
              Number of Shares
            </label>
            <Input 
              id="shares" 
              type="number" 
              placeholder="0" 
              value={shares} 
              onChange={handleSharesChange} 
              min="0" 
              className="backdrop-blur-sm bg-white/5 border border-white/20"
            />
          </div>
          <div className="flex-grow w-full">
            <label htmlFor="usdc" className="text-sm font-medium mb-2 block">
              USDC Amount
            </label>
            <Input 
              id="usdc" 
              type="number" 
              placeholder="0.00" 
              value={usdcAmount} 
              onChange={handleUsdcChange} 
              min="0" 
              className="backdrop-blur-sm bg-white/5 border border-white/20"
            />
          </div>
        </div>
        <Button 
          size="lg" 
          className="w-full backdrop-blur-sm bg-white/20 hover:bg-white/30 border border-white/30 transition-all duration-300 hover:scale-[1.02]"
          onClick={handleBuyClick} 
          disabled={!shares || !usdcAmount || parseFloat(shares) <= 0}
        >
          Buy Shares
        </Button>
      </GlassCardContent>
    </GlassCard>
  );
}
