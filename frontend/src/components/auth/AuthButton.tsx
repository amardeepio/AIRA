'use client';

import { useAccount, useSignMessage, useChainId } from 'wagmi';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { SiweMessage } from 'siwe';
import { useEffect, useState } from 'react';

export function AuthButton() {
  const { address, status } = useAccount();
  const chainId = useChainId();
  const { login, logout, isAuthenticated, isAuthLoading } = useAuth();
  const { signMessageAsync } = useSignMessage();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!address || !chainId) return;
    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const nonceRes = await fetch(`${apiUrl}/api/auth/nonce`);
      const { nonce } = await nonceRes.json();

      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in with Ethereum to the AIRA app.',
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce,
      });

      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });

      const loginRes = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.prepareMessage(), signature }),
      });

      if (!loginRes.ok) {
        throw new Error('Failed to log in');
      }

      const { access_token } = await loginRes.json();
      login(access_token);
    } catch (error) {
      console.error('Login failed:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }
    if (status === 'connected' && address && !isAuthenticated && !isLoading) {
      handleLogin();
    }
    if (status === 'disconnected' && isAuthenticated) {
      logout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, address, isAuthenticated, isAuthLoading]);

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated');

        if (isAuthLoading) {
          return <Button disabled>Loading...</Button>;
        }

        if (!connected) {
          return (
            <Button onClick={openConnectModal} type="button">
              Connect Wallet
            </Button>
          );
        }

        if (chain.unsupported) {
          return (
            <Button onClick={openChainModal} type="button" variant="destructive">
              Wrong network
            </Button>
          );
        }

        if (!isAuthenticated) {
          return (
            <Button disabled>
              {isLoading ? 'Verifying...' : 'Verification Required'}
            </Button>
          );
        }

        return (
          <Button
            onClick={openAccountModal}
            type="button"
            variant="secondary"
            className="flex items-center gap-2"
          >
            {chain.hasIcon && (
              <div
                style={{ background: chain.iconBackground }}
                className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center"
              >
                {chain.iconUrl && (
                  <img
                    alt={chain.name ?? 'Chain icon'}
                    src={chain.iconUrl}
                    className="w-full h-full"
                  />
                )}
              </div>
            )}
            {account.displayName}
          </Button>
        );
      }}
    </ConnectButton.Custom>
  );
}