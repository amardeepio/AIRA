/* eslint-disable react/no-unescaped-entities */
'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { type Property } from '@/lib/properties-data';
import { ArrowRight, ArrowLeft, Zap, Shield, TrendingUp, Cpu, Lightbulb, ShieldCheck, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import MatrixRain from '@/components/ui/MatrixRain';

const goals = [
  { name: 'High Growth', description: 'Focus on properties with the highest potential for appreciation.', icon: TrendingUp },
  { name: 'Stable Income', description: 'Prioritize properties with consistent rental yield.', icon: Shield },
  { name: 'Quick Flip', description: 'Find undervalued properties for short-term gains.', icon: Zap },
];

const analysisSteps = [
    "Connecting to the AI core...",
    "Analyzing market data with AIRA's Advanced AI Engine...",
    "Scoring properties against your budget...",
    "Cross-referencing on-chain data for hidden opportunities...",
    "Building your personalized portfolio...",
];

interface RecommendedProperty extends Property {
    reason: string;
}

interface AdvisorResults {
    portfolioTitle: string;
    portfolioAnalysis: string;
    riskScore: 'Low' | 'Medium' | 'High';
    riskAnalysis: string;
    recommendations: RecommendedProperty[];
}

function RecommendedPropertyCard({ property }: { property: RecommendedProperty }) {
    return (
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
            <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50">
                <div className="relative">
                    <img src={property.imageUrl} alt={property.name} className="w-full h-48 object-cover" />
                    <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                        {property.location}
                    </div>
                </div>
                <CardHeader>
                    <CardTitle>{property.name}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground pt-1">
                        <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            <span>{property.yield} Est. Yield</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Zap className="w-4 h-4 text-blue-500" />
                            <span>{property.sharesAvailable.toLocaleString()} Shares Left</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-lg">
                        <div className="flex items-start gap-3">
                            <Lightbulb className="w-5 h-5 mt-1 text-primary shrink-0" />
                            <div>
                                <h4 className="font-semibold text-primary">AIRA's Insight</h4>
                                <p className="text-sm text-muted-foreground italic">{property.reason}</p>
                            </div>
                        </div>
                    </div>
                    <Link href={`/properties/${property.id}`} className="w-full">
                        <Button className="w-full">
                            View & Invest <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </motion.div>
    )
}

function RiskScoreCard({ score, analysis }: { score: 'Low' | 'Medium' | 'High', analysis: string }) {
    const scoreInfo = {
        Low: { icon: ShieldCheck, color: 'text-green-500', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/20' },
        Medium: { icon: Shield, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500/20' },
        High: { icon: ShieldAlert, color: 'text-red-500', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/20' },
    };
    const { icon: Icon, color, bgColor, borderColor } = scoreInfo[score];

    return (
        <Card className={`${bgColor} ${borderColor}`}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Icon className={`w-6 h-6 ${color}`} />
                    <span>AI-Assessed Risk: <span className={color}>{score}</span></span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{analysis}</p>
            </CardContent>
        </Card>
    )
}

export default function AdvisorPage() {
    const { token } = useAuth();
    const [step, setStep] = useState(1);
    const [goal, setGoal] = useState('');
    const [budget, setBudget] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<AdvisorResults | null>(null);

    const [progress, setProgress] = useState(0);
    const [loadingText, setLoadingText] = useState(analysisSteps[0]);
    const timeoutIds = useRef<NodeJS.Timeout[]>([]);

    const handleGoalSelect = (selectedGoal: string) => {
        setGoal(selectedGoal);
        setStep(2);
    };

    useEffect(() => {
        if (isLoading) {
            timeoutIds.current.forEach(clearTimeout);
            timeoutIds.current = [];

            const sequence = [
                { progress: 10, delay: 5000 }, { progress: 30, delay: 15000 },
                { progress: 40, delay: 10000 }, { progress: 50, delay: 10000 },
                { progress: 60, delay: 10000 }, { progress: 70, delay: 10000 },
                { progress: 80, delay: 10000 }, { progress: 90, delay: 10000 },
            ];

            let cumulativeDelay = 0;
            sequence.forEach(step => {
                cumulativeDelay += step.delay;
                const id = setTimeout(() => { if (isLoading) setProgress(step.progress); }, cumulativeDelay);
                timeoutIds.current.push(id);
            });

            let textIndex = 0;
            const textInterval = setInterval(() => {
                textIndex = (textIndex + 1) % analysisSteps.length;
                setLoadingText(analysisSteps[textIndex]);
            }, 4000);
            timeoutIds.current.push(textInterval as unknown as NodeJS.Timeout);

        } else {
            timeoutIds.current.forEach(clearTimeout);
        }

        return () => { timeoutIds.current.forEach(clearTimeout); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading]);

    const getRecommendations = async () => {
        setResults(null);
        setProgress(0);
        setLoadingText(analysisSteps[0]);
        setStep(3);
        setIsLoading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const response = await fetch(`${apiUrl}/api/advisor`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ goal, budget: parseInt(budget) }),
            });
            const data = await response.json();
            setResults(data);
        } catch (error) {
            console.error("Failed to get recommendations:", error);
        } finally {
            setProgress(100);
            setTimeout(() => setIsLoading(false), 500);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                        <h2 className="text-2xl font-semibold mb-8">What is your primary investment goal?</h2>
                        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                            {goals.map((g) => (
                                <motion.div key={g.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Card onClick={() => handleGoalSelect(g.name)} className="cursor-pointer h-full">
                                        <CardHeader className="items-center">
                                            <g.icon className="w-10 h-10 mb-2 text-primary" />
                                            <CardTitle>{g.name}</CardTitle>
                                        </CardHeader>
                                        <CardContent><p className="text-muted-foreground text-sm">{g.description}</p></CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="text-center max-w-md mx-auto">
                        <h2 className="text-2xl font-semibold mb-2">What's your budget?</h2>
                        <p className="text-muted-foreground mb-8">This will help tailor the recommendations to your range.</p>
                        <select value={budget} onChange={(e) => setBudget(e.target.value)} className="bg-background border border-input rounded-md p-3 text-lg h-12 mb-8 text-center w-full">
                            <option value="" disabled>Select your budget</option>
                            <option value="1000">$0 - $1,000</option>
                            <option value="5000">$1,000 - $5,000</option>
                            <option value="10000">$5,000 - $10,000</option>
                            <option value="100000">$10,000+</option>
                        </select>
                        <div className="flex gap-4 justify-center">
                            <Button variant="outline" onClick={() => setStep(1)}><ArrowLeft className="mr-2" /> Back</Button>
                            <Button onClick={getRecommendations} disabled={!budget}>Get Recommendations <ArrowRight className="ml-2" /></Button>
                        </div>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full">
                        {isLoading ? (
                            <div className="fixed inset-0 z-20">
                                <MatrixRain />
                                <div className="relative z-10 flex flex-col items-center justify-center h-full text-center space-y-6 max-w-lg mx-auto p-4">
                                    <Cpu className="w-12 h-12 mx-auto text-primary animate-pulse" />
                                    <h2 className="text-2xl font-semibold text-white drop-shadow-lg">Engaging AIRA's Advanced AI Engine...</h2>
                                    <p className="text-gray-300 h-10 drop-shadow-md">{loadingText}</p>
                                    <div className="relative w-full">
                                        <Progress value={progress} className="w-full transition-all duration-500 ease-linear h-6" />
                                        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white text-shadow-sm">
                                            {Math.round(progress)}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : results && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-12">
                                <Card className="bg-background/50">
                                    <CardHeader className="text-center">
                                        <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
                                            <Cpu className="w-8 h-8" />
                                        </div>
                                        <CardTitle className="text-3xl font-bold">{results.portfolioTitle}</CardTitle>
                                        <CardDescription className="text-base max-w-3xl mx-auto pt-2">
                                            {results.portfolioAnalysis}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="border-t pt-4 mt-4 text-center">
                                            <p className="text-sm text-muted-foreground">Based on your goal of <span className="font-semibold text-primary">{goal}</span> and budget of <span className="font-semibold text-primary">${parseInt(budget).toLocaleString()}</span>.</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <RiskScoreCard score={results.riskScore} analysis={results.riskAnalysis} />

                                <div>
                                    <h3 className="text-2xl font-semibold text-center mb-8">Top Recommendations</h3>
                                    <motion.div 
                                        className="grid md:grid-cols-2 gap-8"
                                        variants={{ show: { transition: { staggerChildren: 0.2 } } }}
                                        initial="hidden"
                                        animate="show"
                                    >
                                        {results.recommendations.map(prop => (
                                            <RecommendedPropertyCard key={prop.id} property={prop} />
                                        ))}
                                    </motion.div>
                                </div>

                                <div className="text-center">
                                    <Button variant="outline" onClick={() => { setResults(null); setStep(1); setProgress(0); }}>
                                        <ArrowLeft className="mr-2 w-4 h-4" />
                                        Start a New Analysis
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                );
        }
    };

    return (
        <AuthGuard>
            <div className="container mx-auto py-12">
            <div className="max-w-5xl mx-auto">
                <AnimatePresence mode="wait">
                    <motion.div key={step} className="min-h-[400px] flex flex-col justify-center">
                        {renderStep()}
                    </motion.div>
                </AnimatePresence>
            </div>
            </div>
        </AuthGuard>
    );
}