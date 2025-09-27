'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Bot, User, MessageCircle, X, Send, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { type Property } from '@/lib/properties-data';

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
  recommendations?: Property[];
}

function RecommendationCard({ property }: { property: Property }) {
    return (
        <Link href={`/properties/${property.id}`} className="block border rounded-lg p-3 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
                <img src={property.imageUrl} alt={property.name} className="w-12 h-12 rounded-md object-cover" />
                <div className="flex-1">
                    <p className="font-semibold">{property.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <TrendingUp size={12} /> {property.yield} Est. Yield
                    </p>
                </div>
            </div>
        </Link>
    )
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      parts: [{ text: 'Hello! How can I help you with your real estate investments today? You can ask me to recommend properties based on your goals.' }],
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', parts: [{ text: input }] };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          history: messages.slice(-10),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from the server.');
      }

      const data = await response.json();
      const modelMessage: Message = { 
        role: 'model', 
        parts: [{ text: data.response }],
      };
      setMessages((prev) => [...prev, modelMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'model',
        parts: [{ text: 'Sorry, something went wrong. Please try again.' }],
      };
      setMessages((prev) => [...prev, errorMessage]);
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-20 right-4 z-50"
          >
            <Card className="w-96 h-[440px] flex flex-col shadow-2xl gap-0">
              <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
                <CardTitle className="text-lg">Chat with AIRA</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
                  <X size={20} />
                </Button>
              </CardHeader>
              <CardContent className="flex-grow p-4 overflow-y-auto">
                <div className="flex flex-col gap-4">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={cn('flex items-start gap-3', {
                        'justify-end': msg.role === 'user',
                      })}
                    >
                      {msg.role === 'model' && (
                        <div className="bg-primary text-primary-foreground p-2 rounded-full self-start mt-1">
                            <Bot size={16} />
                        </div>
                      )}
                      <div className={cn('flex flex-col gap-2 max-w-[85%]', {'items-end': msg.role === 'user', 'items-start': msg.role === 'model'})}>
                        <div
                            className={cn('p-3 rounded-lg text-sm', {
                            'bg-muted self-start': msg.role === 'model',
                            'bg-primary text-primary-foreground self-end': msg.role === 'user',
                            })}
                        >
                            <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                p: ({node, ...props}) => <p className="m-0" {...props} />,
                                a: ({node, ...props}) => <a className="text-blue-400 hover:underline" {...props} />,
                                ul: ({node, ...props}) => <ul className="list-disc list-inside my-2" {...props} />,
                                ol: ({node, ...props}) => <ol className="list-decimal list-inside my-2" {...props} />,
                                li: ({node, ...props}) => <li className="mb-1" {...props} />,
                                code: ({node, inline, className, children, ...props}) => {
                                const match = /language-(\w+)/.exec(className || '')
                                return !inline && match ? (
                                    <pre className="bg-gray-800 rounded-md p-2 my-2 text-sm overflow-x-auto"><code className={className} {...props}>{children}</code></pre>
                                ) : (
                                    <code className="bg-gray-700 rounded-sm px-1 text-sm" {...props}>{children}</code>
                                )
                                },
                            }}
                            >
                            {msg.parts[0].text}
                            </ReactMarkdown>
                        </div>
                        {msg.recommendations && msg.recommendations.length > 0 && (
                            <div className="flex flex-col gap-2 w-full">
                                {msg.recommendations.map(prop => (
                                    <RecommendationCard key={prop.id} property={prop} />
                                ))}
                            </div>
                        )}
                      </div>
                      {msg.role === 'user' && (
                        <div className="bg-muted text-muted-foreground p-2 rounded-full self-start mt-1">
                            <User size={16} />
                        </div>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                     <div className="bg-muted p-3 rounded-lg max-w-xs self-start flex items-center gap-2">
                        <Bot size={16} />
                        <div className="flex gap-1">
                            <span className="h-2 w-2 rounded-full bg-foreground animate-bounce [animation-delay:-0.3s]" />
                            <span className="h-2 w-2 rounded-full bg-foreground animate-bounce [animation-delay:-0.15s]" />
                            <span className="h-2 w-2 rounded-full bg-foreground animate-bounce" />
                        </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
              <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="relative">
                  <Input
                    placeholder="Type a message..."
                    className="pr-10"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                    disabled={isLoading || !input.trim()}
                  >
                    <Send size={20} />
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, duration: 0.3, type: 'spring', stiffness: 260, damping: 20 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <Button
          size="lg"
          className={cn(
            'rounded-full w-16 h-16 shadow-lg flex items-center justify-center',
            'transition-all duration-300 ease-in-out',
            isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
          )}
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle size={28} />
        </Button>
      </motion.div>
    </>
  );
}