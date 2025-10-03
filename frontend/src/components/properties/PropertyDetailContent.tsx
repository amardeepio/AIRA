'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { InvestmentCard } from "@/components/properties/InvestmentCard";
import { DollarSign, TrendingUp, Home, PieChart, FileText, MapPin, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import {
  GlassCard,
  GlassCardContent,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
} from "@/components/ui/glass-card";
import { Property } from "@/lib/properties-data";

interface PropertyDetailContentProps {
  property: Property;
}

export default function PropertyDetailContent({ property }: PropertyDetailContentProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!property) {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-8"
    >
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Link
          href="/properties"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Properties
        </Link>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Image and Investment */}
        <div className="md:col-span-2 space-y-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <GlassCard className="overflow-hidden">
              <GlassCardHeader className="border-b border-white/20">
                <GlassCardTitle className="text-3xl">{property.name}</GlassCardTitle>
                <GlassCardDescription>{property.location}</GlassCardDescription>
              </GlassCardHeader>
              <GlassCardContent>
                <motion.img
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: isVisible ? 1 : 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  src={property.imageUrl}
                  alt={property.name}
                  className="rounded-lg w-full h-auto object-cover mb-4"
                />
                <p className="text-muted-foreground">{property.description}</p>
              </GlassCardContent>
            </GlassCard>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <InvestmentCard property={property} />
          </motion.div>
        </div>

        {/* Right Column - Stats */}
        <div className="space-y-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <GlassCard>
              <GlassCardHeader className="border-b border-white/20">
                <GlassCardTitle>Financials</GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <DollarSign size={18} />
                    <span className="font-medium">AIRA Valuation</span>
                  </div>
                  <span className="font-bold text-lg">{property.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={18} />
                    <span className="font-medium">Est. Yield</span>
                  </div>
                  <span className="font-bold text-lg">{property.yield}</span>
                </div>
              </GlassCardContent>
            </GlassCard>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <GlassCard>
              <GlassCardHeader className="border-b border-white/20">
                <GlassCardTitle>Tokenomics</GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Home size={18} />
                    <span className="font-medium">Total Shares</span>
                  </div>
                  <span className="font-mono">{property.totalShares.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <PieChart size={18} />
                    <span className="font-medium">Shares Available</span>
                  </div>
                  <span className="font-mono">{property.sharesAvailable.toLocaleString()}</span>
                </div>
              </GlassCardContent>
            </GlassCard>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <GlassCard>
              <GlassCardHeader className="border-b border-white/20">
                <GlassCardTitle>Documents & Location</GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start gap-2 backdrop-blur-sm bg-white/10 hover:bg-white/20 border border-white/20">
                  <FileText size={16} /> View Legal Documents
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 backdrop-blur-sm bg-white/10 hover:bg-white/20 border border-white/20">
                  <MapPin size={16} /> View on Map
                </Button>
              </GlassCardContent>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}