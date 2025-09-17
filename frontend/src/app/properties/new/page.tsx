'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { DollarSign, Home, Hash, MapPin, Image as ImageIcon, CheckCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { marketplaceAddress, marketplaceAbi, propertyTokenAddress, propertyTokenAbi } from '@/lib/contracts';
import { parseEther, decodeEventLog, Log } from 'viem';

export default function ListPropertyPage() {
  const [propertyName, setPropertyName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [totalShares, setTotalShares] = useState('');
  const [pricePerShare, setPricePerShare] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string; propertyId?: string } | null>(null);
  const [mintHash, setMintHash] = useState<`0x${string}` | undefined>(undefined);
  const [ipfsHash, setIpfsHash] = useState<string | null>(null);

  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const { data: receipt, isLoading: isConfirming } = useWaitForTransactionReceipt({ hash: mintHash });

  const resetForm = () => {
    setPropertyName('');
    setDescription('');
    setLocation('');
    setImageFile(null);
    setTotalShares('');
    setPricePerShare('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile || !address) return;

    setLoading(true);
    setStatus(null);
    setUploadProgress(10);

    const formData = new FormData();
    formData.append('propertyName', propertyName);
    formData.append('description', description);
    formData.append('location', location);
    formData.append('totalShares', totalShares);
    formData.append('pricePerShare', pricePerShare);
    formData.append('image', imageFile);

    try {
      // Step 1: Upload image to IPFS via backend
      setStatus({ type: 'success', message: 'Uploading image to IPFS...' });
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/properties/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to upload to IPFS' }));
        throw new Error(errorData.message || 'Failed to upload to IPFS');
      }
      
      setUploadProgress(50);
      const { ipfsHash: hash } = await response.json();
      setIpfsHash(hash);

      // Step 2: Mint the property NFT
      setStatus({ type: 'success', message: 'Minting property token...' });
      const mintTxHash = await writeContractAsync({
        address: propertyTokenAddress,
        abi: propertyTokenAbi,
        functionName: 'mintProperty',
        args: [address, BigInt(totalShares), `ipfs://${hash}`],
      });
      setMintHash(mintTxHash);

    } catch (error) {
      setStatus({ type: 'error', message: error instanceof Error ? error.message : 'Error listing property. Please try again.' });
      console.error(error);
      setLoading(false);
      setUploadProgress(0);
    }
  };

  useEffect(() => {
    if (receipt && ipfsHash) {
      const transferSingleLog = receipt.logs.find(
        (log: Log) => log.topics[0] === '0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62' // TransferSingle signature
      );

      if (!transferSingleLog) {
        setStatus({ type: 'error', message: 'Could not determine token ID from mint transaction.' });
        setLoading(false);
        return;
      }

      const event = decodeEventLog({
        abi: propertyTokenAbi,
        eventName: 'TransferSingle',
        data: transferSingleLog.data,
        topics: transferSingleLog.topics,
      });
      const tokenId = (event.args as unknown as { id: bigint }).id;

      const listProperty = async () => {
        try {
          // Step 3: Approve the marketplace
          setStatus({ type: 'success', message: 'Approving marketplace...' });
          setUploadProgress(75);
          await writeContractAsync({
            address: propertyTokenAddress,
            abi: propertyTokenAbi,
            functionName: 'setApprovalForAll',
            args: [marketplaceAddress, true],
          });

          // Step 4: List the property
          setStatus({ type: 'success', message: 'Listing property...' });
          const listHash = await writeContractAsync({
            address: marketplaceAddress,
            abi: marketplaceAbi,
            functionName: 'listProperty',
            args: [tokenId, BigInt(totalShares), parseEther(pricePerShare)],
          });

          // Step 5: Add property to the database
                    // Step 5: Add property to the database
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
          await fetch(`${apiUrl}/api/properties/add`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              createPropertyDto: {
                propertyName,
                description,
                location,
                totalShares,
                pricePerShare,
              },
              ipfsHash: ipfsHash,
              tokenId: tokenId.toString(),
            }),
          });

          setUploadProgress(100);
          setStatus({ 
            type: 'success', 
            message: `Property listed successfully! Transaction Hash: ${listHash}`,
            propertyId: tokenId.toString()
          });
          resetForm();
        } catch (error) {
          setStatus({ type: 'error', message: 'Error listing property. Please try again.' });
          console.error(error);
        } finally {
          setLoading(false);
        }
      }

      listProperty();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receipt, ipfsHash]);


  if (status?.type === 'success' && status.propertyId) {
    return (
      <div className="container mx-auto py-12">
        <div className="max-w-3xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto bg-green-100 rounded-full p-3 w-fit">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <CardTitle className="text-3xl mt-4">Property Listed!</CardTitle>
              <CardDescription>
                Your property has been successfully tokenized and is now available on the marketplace.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground break-all">{status.message}</p>
              <div className="flex gap-4 justify-center">
                <Link href={`/properties/${status.propertyId}`}>
                  <Button>View Property</Button>
                </Link>
                <Button variant="outline" onClick={() => setStatus(null)}>List Another Property</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">List Your Property</CardTitle>
            <CardDescription>
              Fill out the details below to tokenize your property and list it on
              the marketplace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="flex items-center gap-2 font-medium">
                  <Home size={16} /> Property Name
                </label>
                <Input
                  id="name"
                  placeholder="e.g., Miami Beachfront Condo"
                  value={propertyName}
                  onChange={(e) => setPropertyName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="flex items-center gap-2 font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  placeholder="A beautiful 2-bedroom condo with ocean views..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="location" className="flex items-center gap-2 font-medium">
                    <MapPin size={16} /> Location
                  </label>
                  <Input
                    id="location"
                    placeholder="e.g., Miami, FL"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="image" className="flex items-center gap-2 font-medium">
                    <ImageIcon size={16} /> Image
                  </label>
                  <Input
                    id="image"
                    type="file"
                    ref={fileInputRef}
                    accept="image/png, image/jpeg, image/svg+xml, image/gif"
                    onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                    className="hidden"
                    required
                    disabled={loading}
                  />
                  <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={loading}>Choose File</Button>
                  {imageFile && <span className="text-sm text-muted-foreground">{imageFile.name}</span>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="shares" className="flex items-center gap-2 font-medium">
                    <Hash size={16} /> Total Shares
                  </label>
                  <Input
                    id="shares"
                    type="number"
                    placeholder="e.g., 10000"
                    value={totalShares}
                    onChange={(e) => setTotalShares(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="price" className="flex items-center gap-2 font-medium">
                    <DollarSign size={16} /> Price per Share (USDC)
                  </label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="e.g., 120.50"
                    value={pricePerShare}
                    onChange={(e) => setPricePerShare(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {loading && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{status?.message || 'Uploading to IPFS...'}</p>
                  {uploadProgress > 0 && <Progress value={uploadProgress} className="w-full" />}
                </div>
              )}

              {status?.type === 'error' && (
                <div className="flex items-center gap-2 text-sm text-red-500">
                  <AlertTriangle className="h-4 w-4" />
                  {status.message}
                </div>
              )}

              <Button type="submit" size="lg" className="w-full" disabled={loading || !imageFile || !address}>
                {loading || isConfirming ? 'Listing...' : 'List Property'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
