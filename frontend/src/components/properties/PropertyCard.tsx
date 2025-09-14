
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, TrendingUp } from "lucide-react";
import { Property } from "@/lib/properties-data";
import Link from "next/link";
import { cn } from '@/lib/utils';

export function PropertyCard(property: Property) {
  const { name, location, price, yield: estYield, imageUrl, id } = property;
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => setImageLoading(false);
  }, [imageUrl]);

  return (
    <Link href={`/properties/${id}`} className="group [perspective:1000px]">
      <Card className="transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(7deg)_rotateX(3deg)_scale(1.05)] group-hover:shadow-2xl group-hover:shadow-primary/20 cursor-pointer h-full flex flex-col">
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <CardDescription>{location}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="relative h-48 w-full mb-4">
            {imageLoading && (
              <div className="absolute inset-0 bg-muted/50 rounded-md animate-pulse"></div>
            )}
            <img
              src={imageUrl}
              alt={name}
              className={cn(
                "rounded-md h-48 w-full object-cover transition-opacity duration-300",
                imageLoading ? 'opacity-0' : 'opacity-100'
              )}
              onLoad={() => setImageLoading(false)} // Fallback for when useEffect doesn't fire as expected
            />
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <DollarSign size={16} />
              <div>
                <p className="font-bold text-lg">{price}</p>
                <p className="text-sm text-muted-foreground">AIRA Valuation</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={16} />
              <div>
                <p className="font-bold text-lg">{estYield}</p>
                <p className="text-sm text-muted-foreground">Est. Yield</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
