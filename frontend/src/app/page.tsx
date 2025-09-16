"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { properties } from "@/lib/properties-data";
import {
  Search,
  Wallet,
  TrendingUp,
  BrainCircuit,
  Database,
  Lock,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { useEffect, useRef } from "react";

declare const VANTA: any;

export default function Home() {
  const featuredProperties = properties.slice(0, 3);
  const vantaRef = useRef(null);

  useEffect(() => {
    let vantaEffect: any;
    const initializeVanta = () => {
      if (vantaRef.current && typeof window !== 'undefined' && (window as any).VANTA) {
        vantaEffect = (window as any).VANTA.WAVES({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0x40405,
          waveSpeed: 0.75
        });
      } else {
        setTimeout(initializeVanta, 100);
      }
    };

    initializeVanta();

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, []);

  // Animation variants
    const fadeInUp: Variants = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeInOut" },
    viewport: { once: true },
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
    viewport: { once: true },
  };

  return (
    <div className="relative min-h-screen">
      <div ref={vantaRef} className="absolute inset-0 z-0"></div>
      <div className="flex flex-col relative z-10">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center gap-6 py-24 md:py-32">
          <motion.h1
            className="text-4xl md:text-5xl font-bold max-w-3xl"
            {...fadeInUp}
          >
            The New Way to Own Real Estate
          </motion.h1>
          <motion.p
            className="text-lg text-muted-foreground max-w-xl"
            {...fadeInUp}
            transition={{ ...fadeInUp.transition, delay: 0.2 }}
          >
            AIRA makes investing in real estate as simple, liquid, and transparent
            as trading stocks, powered by AI-driven insights.
          </motion.p>
          <motion.div
            {...fadeInUp}
            transition={{ ...fadeInUp.transition, delay: 0.4 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/properties">
              <Button size="lg">Explore Properties</Button>
            </Link>
          </motion.div>
        </section>

        {/* How It Works Section */}
        <motion.section
          className="py-24 bg-muted/50"
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
        >
          <div className="container mx-auto">
            <motion.div className="text-center mb-12" variants={fadeInUp}>
              <h2 className="text-3xl font-bold">How It Works</h2>
              <p className="text-muted-foreground">
                Start investing in three simple steps.
              </p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-12 text-center">
              <motion.div
                className="flex flex-col items-center gap-4 p-6 rounded-lg transition-transform hover:scale-105 hover:bg-background/50"
                variants={fadeInUp}
              >
                <div className="bg-primary/10 text-primary p-4 rounded-full">
                  <Search className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold">Browse Properties</h3>
                <p className="text-muted-foreground">
                  Explore a curated list of AI-vetted investment properties, complete with detailed financials and AI-powered insights.
                </p>
              </motion.div>
              <motion.div
                className="flex flex-col items-center gap-4 p-6 rounded-lg transition-transform hover:scale-105 hover:bg-background/50"
                variants={fadeInUp}
              >
                <div className="bg-primary/10 text-primary p-4 rounded-full">
                  <Wallet className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold">Buy Fractions</h3>
                <p className="text-muted-foreground">
                  Purchase fractional ownership instantly and securely with crypto, leveraging blockchain for transparency and liquidity.
                </p>
              </motion.div>
              <motion.div
                className="flex flex-col items-center gap-4 p-6 rounded-lg transition-transform hover:scale-105 hover:bg-background/50"
                variants={fadeInUp}
              >
                <div className="bg-primary/10 text-primary p-4 rounded-full">
                  <TrendingUp className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold">Earn Rental Income</h3>
                <p className="text-muted-foreground">
                  Receive your share of rental income automatically via smart contracts, ensuring transparent and timely distributions.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Featured Properties Section */}
        <motion.section
          className="py-24"
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
        >
          <div className="container mx-auto">
            <motion.div className="text-center mb-12" variants={fadeInUp}>
              <h2 className="text-3xl font-bold">Featured Properties</h2>
              <p className="text-muted-foreground">
                Get a glimpse of our high-yield investment opportunities.
              </p>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property) => (
                <motion.div key={property.id} variants={fadeInUp}>
                  <PropertyCard {...property} />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Trust & Data Section */}
        <motion.section
          className="py-24 bg-muted/50"
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
        >
          <div className="container mx-auto text-center">
            <motion.div variants={fadeInUp}>
              <h2 className="text-3xl font-bold mb-4">Powered by AI & Data</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
                Our proprietary AI engine analyzes vast datasets, including market trends, property specifics, and historical performance, to provide you with institutional-grade analytics for smarter, data-driven investment decisions.
              </p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-12">
              <motion.div
                className="flex flex-col items-center gap-2"
                variants={fadeInUp}
              >
                <BrainCircuit className="h-10 w-10 text-primary" />
                <span className="text-2xl font-bold">10,000+</span>
                <span className="text-muted-foreground">Comprehensive analysis for every asset.</span>
              </motion.div>
              <motion.div
                className="flex flex-col items-center gap-2"
                variants={fadeInUp}
              >
                <Database className="h-10 w-10 text-primary" />
                <span className="text-2xl font-bold">98%</span>
                <span className="text-muted-foreground">Ensuring precise and reliable property valuations.</span>
              </motion.div>
              <motion.div
                className="flex flex-col items-center gap-2"
                variants={fadeInUp}
              >
                <Lock className="h-10 w-10 text-primary" />
                <span className="text-2xl font-bold">Immutable</span>
                <span className="text-muted-foreground">Secure and verifiable ownership records on the blockchain.</span>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
