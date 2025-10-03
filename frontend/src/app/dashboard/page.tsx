'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Wallet,
  Landmark,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardDescription, GlassCardContent } from "@/components/ui/glass-card";

const chartData = [
  { month: "Jan", value: 110000 },
  { month: "Feb", value: 120000 },
  { month: "Mar", value: 105000 },
  { month: "Apr", value: 108000 },
  { month: "May", value: 122000 },
  { month: "Jun", value: 125000 },
];

const chartConfig = {
  value: {
    label: "Portfolio Value",
    color: "#8884d8",
  },
} satisfies ChartConfig;

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div className="container mx-auto py-8 space-y-8">
        <h1 className="text-3xl font-bold drop-shadow-sm">Dashboard</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <GlassCard>
          <GlassCardHeader className="flex flex-row items-center justify-between pb-2">
            <GlassCardTitle className="text-sm font-medium">Total Value</GlassCardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground drop-shadow-sm" />
          </GlassCardHeader>
          <GlassCardContent>
            <div className="text-2xl font-bold drop-shadow-sm">$125,000</div>
          </GlassCardContent>
        </GlassCard>
        <GlassCard>
          <GlassCardHeader className="flex flex-row items-center justify-between pb-2">
            <GlassCardTitle className="text-sm font-medium">Total Returns</GlassCardTitle>
            <TrendingUp className="h-4 w-4 text-green-500 drop-shadow-sm" />
          </GlassCardHeader>
          <GlassCardContent>
            <div className="text-2xl font-bold text-green-500 drop-shadow-sm">+$5,000</div>
          </GlassCardContent>
        </GlassCard>
        <GlassCard>
          <GlassCardHeader className="flex flex-row items-center justify-between pb-2">
            <GlassCardTitle className="text-sm font-medium">Lifetime Earnings</GlassCardTitle>
            <Landmark className="h-4 w-4 text-muted-foreground drop-shadow-sm" />
          </GlassCardHeader>
          <GlassCardContent>
            <div className="text-2xl font-bold drop-shadow-sm">$1,200</div>
            <p className="text-xs text-muted-foreground drop-shadow-sm">from rent</p>
          </GlassCardContent>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Portfolio Overview Chart */}
          <GlassCard>
            <GlassCardHeader>
              <GlassCardTitle>Portfolio Overview</GlassCardTitle>
              <GlassCardDescription>Your portfolio value over the last 6 months.</GlassCardDescription>
            </GlassCardHeader>
            <GlassCardContent>
              <ChartContainer config={chartConfig} className="h-80 w-full">
                <BarChart data={chartData} margin={{ left: 12, right: 12 }}>
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => `${Number(value) / 1000}k`}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar
                    dataKey="value"
                    fill={chartConfig.value.color}
                    radius={4}
                  />
                </BarChart>
              </ChartContainer>
            </GlassCardContent>
          </GlassCard>

          {/* My Holdings Table */}
          <GlassCard>
            <GlassCardHeader>
              <GlassCardTitle>My Holdings</GlassCardTitle>
              <GlassCardDescription>
                A list of properties you have invested in.
              </GlassCardDescription>
            </GlassCardHeader>
            <GlassCardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Fractions</TableHead>
                    <TableHead>Current Value</TableHead>
                    <TableHead>Income Earned</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="hover:bg-muted/50 cursor-pointer">
                    <TableCell>Miami Beachfront Condo</TableCell>
                    <TableCell>10</TableCell>
                    <TableCell>$12,000</TableCell>
                    <TableCell className="text-green-500">$1,000</TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-muted/50 cursor-pointer">
                    <TableCell>Downtown LA Loft</TableCell>
                    <TableCell>5</TableCell>
                    <TableCell>$6,000</TableCell>
                    <TableCell className="text-green-500">$250</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </GlassCardContent>
          </GlassCard>
        </div>

        <div className="space-y-8">
          {/* AIRA Score */}
          <GlassCard>
            <GlassCardHeader>
              <GlassCardTitle>AIRA Score</GlassCardTitle>
              <GlassCardDescription>Your on-chain credit score.</GlassCardDescription>
            </GlassCardHeader>
            <GlassCardContent className="text-center">
              <div className="flex items-center justify-center gap-2 text-5xl font-bold text-primary mb-2">
                <ShieldCheck className="h-10 w-10 drop-shadow-sm" />
                <span className="drop-shadow-sm">750</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4 drop-shadow-sm">Excellent</p>
              <Button variant="outline" size="sm" className="backdrop-blur-sm bg-white/20 hover:bg-white/30 border border-white/30">See Factors</Button>
            </GlassCardContent>
          </GlassCard>

          {/* Transaction History */}
          <GlassCard>
            <GlassCardHeader>
              <GlassCardTitle>Transaction History</GlassCardTitle>
              <GlassCardDescription>Recent transactions.</GlassCardDescription>
            </GlassCardHeader>
            <GlassCardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Buy</TableCell>
                    <TableCell>+5 Fractions</TableCell>
                    <TableCell>2 days ago</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Rent</TableCell>
                    <TableCell>+$50.25</TableCell>
                    <TableCell>5 days ago</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Sell</TableCell>
                    <TableCell>-2 Fractions</TableCell>
                    <TableCell>1 month ago</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </GlassCardContent>
          </GlassCard>
        </div>
      </div>
      </div>
    </AuthGuard>
  );
}