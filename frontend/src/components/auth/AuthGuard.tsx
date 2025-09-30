'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export function AuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);



  // While waiting for client-side check, or if not authenticated, show a placeholder.
  if (!isClient || !isAuthenticated) {
    return (
      <div className="container mx-auto py-24">
        <div className="max-w-md mx-auto">
          <Card className="text-center p-6">
            <CardHeader className="gap-4">
              <div className="mx-auto bg-yellow-100 dark:bg-yellow-900/30 rounded-full p-3 w-fit">
                <AlertTriangle className="h-10 w-10 text-yellow-500 dark:text-yellow-400" />
              </div>
              <CardTitle className="text-2xl">Access Denied</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                You must connect and verify your wallet to access this page.
              </p>
              <Button onClick={() => router.push('/')}>Go to Homepage</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // If authenticated, render the actual page content.
  return <>{children}</>;
}
