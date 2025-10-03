import Link from 'next/link';
import { Send } from 'lucide-react';
import Image from 'next/image';

const XIcon = () => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 fill-current"
  >
    <title>X</title>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.931ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:justify-around md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Link href="/" className="font-bold text-xl flex items-center gap-2 transition-colors hover:text-primary">
            <Image src="/logo/aira.png" alt="AIRA Logo" width={32} height={32} />
            <p>AIRA</p>
          </Link>
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} AIRA Labs. All rights reserved.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">Follow us</p>
          <Link href="https://t.me/AIRAlabsChannel" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
            <XIcon />
          </Link>
          <Link href="https://t.me/AIRAlabsChannel" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
            <Send className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
