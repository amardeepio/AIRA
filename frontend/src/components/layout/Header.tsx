'use client';

import Link from "next/link";
import { Building, LayoutDashboard, Menu, X } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-between p-4">
        <Link
          href="/"
          className="font-bold text-xl flex items-center gap-2 transition-colors hover:text-primary"
        >
          <Image src="/logo/aira.png" alt="AIRA Logo" width={32} height={32} />
          AIRA
        </Link>
        <nav className="hidden md:flex items-center gap-4">
          <Link
            href="/properties"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "flex items-center gap-2"
            )}
          >
            <Building size={16} />
            Properties
          </Link>
          <Link
            href="/dashboard"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "flex items-center gap-2"
            )}
          >
            <LayoutDashboard size={16} />
            Dashboard
          </Link>
          <Link
            href="/properties/new"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "flex items-center gap-2"
            )}
          >
            List Property
          </Link>
          <ConnectButton />
        </nav>
        <div className="flex items-center gap-4 md:hidden">
          <ConnectButton />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <nav className="md:hidden container pb-4 flex flex-col gap-4">
          <Link
            href="/properties"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "flex items-center gap-2 w-full"
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            <Building size={16} />
            Properties
          </Link>
          <Link
            href="/dashboard"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "flex items-center gap-2 w-full"
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            <LayoutDashboard size={16} />
            Dashboard
          </Link>
          <Link
            href="/properties/new"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "flex items-center gap-2 w-full"
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            List Property
          </Link>
        </nav>
      )}
    </header>
  );
}