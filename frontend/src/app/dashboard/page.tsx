'use client';

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
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$125,000</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">+$5,000</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Lifetime Earnings</CardTitle>
            <Landmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,200</div>
            <p className="text-xs text-muted-foreground">from rent</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Portfolio Overview Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Overview</CardTitle>
              <CardDescription>Your portfolio value over the last 6 months.</CardDescription>
            </CardHeader>
            <CardContent>
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
                    tickFormatter={(value) => `$${Number(value) / 1000}k`}
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
            </CardContent>
          </Card>

          {/* My Holdings Table */}
          <Card>
            <CardHeader>
              <CardTitle>My Holdings</CardTitle>
              <CardDescription>
                A list of properties you have invested in.
              </CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {/* AIRA Score */}
          <Card>
            <CardHeader>
              <CardTitle>AIRA Score</CardTitle>
              <CardDescription>Your on-chain credit score.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex items-center justify-center gap-2 text-5xl font-bold text-primary mb-2">
                <ShieldCheck className="h-10 w-10" />
                <span>750</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">Excellent</p>
              <Button variant="outline" size="sm">See Factors</Button>
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Recent transactions.</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}