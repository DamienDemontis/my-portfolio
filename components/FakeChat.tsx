'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { Badge } from './ui/Badge';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  translationKey?: string; // For dynamic language switching
  timestamp: Date;
  isCompleted: boolean; // Track if message animation is completed
}

interface FakeChatProps {
  onComplete?: () => void;
}

export function FakeChat({ onComplete }: FakeChatProps) {
  const t = useTranslations();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [shouldAccelerate, setShouldAccelerate] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<string>('');
  
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const typingIntervalRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);

  // Define conversation flow with translation keys for dynamic switching
  const conversationFlow = [
    {
      role: 'user' as const,
      translationKey: 'hero.greeting',
      delay: 1000,
    },
    {
      role: 'assistant' as const,
      translationKey: 'fake-responses.who-is-damien',
      delay: 2000,
      typingSpeed: 30,
    },
    {
      role: 'user' as const,
      translationKey: 'fake-questions.experience',
      delay: 3000,
    },
    {
      role: 'assistant' as const,
      translationKey: 'fake-responses.experience',
      delay: 2000,
      typingSpeed: 25,
    },
    {
      role: 'user' as const,
      translationKey: 'fake-questions.skills',
      delay: 3000,
    },
    {
      role: 'assistant' as const,
      translationKey: 'fake-responses.skills',
      delay: 2000,
      typingSpeed: 30,
    },
    {
      role: 'user' as const,
      translationKey: 'fake-questions.projects',
      delay: 3000,
    },
    {
      role: 'assistant' as const,
      translationKey: 'fake-responses.projects',
      delay: 2000,
      typingSpeed: 25,
    },
    {
      role: 'user' as const,
      translationKey: 'fake-questions.contact',
      delay: 3000,
    },
    {
      role: 'assistant' as const,
      translationKey: 'fake-responses.contact',
      delay: 2000,
      typingSpeed: 30,
    },
  ];

  // Detect scroll behavior
  const handleScroll = useCallback(() => {
    setIsUserScrolling(true);
    setShouldAccelerate(true);
    
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      setIsUserScrolling(false);
    }, 1000);
  }, []);

  // Setup scroll listener
  useEffect(() => {
    const handleGlobalScroll = () => handleScroll();
    window.addEventListener('scroll', handleGlobalScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleGlobalScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleScroll]);

  // Update existing messages when locale changes
  useEffect(() => {
    const currentLoc = document.documentElement.lang || 'fr';
    if (currentLocale && currentLocale !== currentLoc) {
      // Update existing messages with new translations
      setMessages(prevMessages => 
        prevMessages.map(msg => {
          if (msg.translationKey) {
            const newContent = msg.translationKey.includes('fake-responses') 
              ? t(msg.translationKey as any)
              : t(msg.translationKey as any);
            return { ...msg, content: newContent };
          }
          return msg;
        })
      );
    }
    setCurrentLocale(currentLoc);
  }, [t, currentLocale]);

  // Fast-complete current typing animation when scrolling
  const completeCurrentMessage = useCallback(() => {
    if (isTyping && currentMessageIndex < conversationFlow.length) {
      const currentStep = conversationFlow[currentMessageIndex];
      if (currentStep.role === 'assistant') {
        // Clear current typing interval
        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current);
        }
        
        // Complete the message immediately
        const content = currentStep.translationKey 
          ? t(currentStep.translationKey as any)
          : currentStep.content || '';
        
        const newMessage: Message = {
          id: `msg-${currentMessageIndex}`,
          role: 'assistant',
          content,
          translationKey: currentStep.translationKey,
          timestamp: new Date(),
          isCompleted: true,
        };
        
        setMessages(prev => [...prev, newMessage]);
        setTypingText('');
        setIsTyping(false);
        setCurrentMessageIndex(prev => prev + 1);
      }
    }
  }, [isTyping, currentMessageIndex, t]);

  // Trigger acceleration when user scrolls
  useEffect(() => {
    if (shouldAccelerate && isTyping) {
      completeCurrentMessage();
      setShouldAccelerate(false);
    }
  }, [shouldAccelerate, isTyping, completeCurrentMessage]);

  // Main conversation flow
  useEffect(() => {
    if (currentMessageIndex >= conversationFlow.length) {
      setShowScrollHint(true);
      onComplete?.();
      return;
    }

    const currentStep = conversationFlow[currentMessageIndex];
    const delay = shouldAccelerate || isUserScrolling ? 100 : currentStep.delay;
    
    const timer = setTimeout(() => {
      if (currentStep.role === 'user') {
        const content = currentStep.translationKey 
          ? t(currentStep.translationKey as any)
          : currentStep.content || '';
        
        const newMessage: Message = {
          id: `msg-${currentMessageIndex}`,
          role: currentStep.role,
          content,
          translationKey: currentStep.translationKey,
          timestamp: new Date(),
          isCompleted: true,
        };
        setMessages(prev => [...prev, newMessage]);
        setCurrentMessageIndex(prev => prev + 1);
      } else {
        setIsTyping(true);
        const content = currentStep.translationKey 
          ? t(currentStep.translationKey as any)
          : currentStep.content || '';
        
        const speed = shouldAccelerate || isUserScrolling ? 5 : (currentStep.typingSpeed || 30);
        typeMessage(content, speed, currentStep.translationKey);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [currentMessageIndex, t, onComplete, shouldAccelerate, isUserScrolling]);

  const typeMessage = (content: string, speed: number, translationKey?: string) => {
    let index = 0;
    setTypingText('');
    
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }
    
    typingIntervalRef.current = setInterval(() => {
      if (index < content.length) {
        setTypingText(prev => prev + content[index]);
        index++;
      } else {
        clearInterval(typingIntervalRef.current!);
        setIsTyping(false);
        
        const newMessage: Message = {
          id: `msg-${currentMessageIndex}`,
          role: 'assistant',
          content,
          translationKey,
          timestamp: new Date(),
          isCompleted: true,
        };
        
        setMessages(prev => [...prev, newMessage]);
        setTypingText('');
        setCurrentMessageIndex(prev => prev + 1);
      }
    }, speed);
  };

  const renderMarkdown = (content: string) => {
    const html = marked(content);
    const cleanHtml = DOMPurify.sanitize(html);
    return { __html: cleanHtml };
  };

  const extractTechnologies = (content: string): string[] => {
    const techPattern = /(?:JavaScript|TypeScript|Python|React|Vue\.js|Nuxt\.js|Django|Node\.js|Docker|Kubernetes|Jenkins|OpenCV|Torch|MongoDB|SQL|C\+\+|Java|PHP|Unity|SFML|Stripe|Firebase|Firestore|GitLab|Linux|Haskell|Assembly)/g;
    return Array.from(new Set(content.match(techPattern) || []));
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`chat-bubble ${message.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'}`}>
                  {message.role === 'assistant' ? (
                    <div className="space-y-3">
                      <div 
                        className="prose-custom"
                        dangerouslySetInnerHTML={renderMarkdown(message.content)}
                      />
                      {extractTechnologies(message.content).length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {extractTechnologies(message.content).slice(0, 8).map((tech) => (
                            <Badge key={tech} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm font-medium">{message.content}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="chat-bubble chat-bubble-assistant">
                <div className="space-y-3">
                  <div 
                    className="prose-custom"
                    dangerouslySetInnerHTML={renderMarkdown(typingText)}
                  />
                  {extractTechnologies(typingText).length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {extractTechnologies(typingText).slice(0, 8).map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex space-x-1 items-center mt-2">
                    <div className="typing-indicator"></div>
                    <div className="typing-indicator"></div>
                    <div className="typing-indicator"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Scroll acceleration hint */}
          {isTyping && !isUserScrolling && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="text-center mt-4"
            >
              <p className="text-xs text-muted-foreground">
                💡 Scroll to speed up the conversation
              </p>
            </motion.div>
          )}
        </div>

        {showScrollHint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-center mt-12 py-8"
          >
            <p className="text-muted-foreground text-lg mb-4">
              {t('hero.scroll-hint')}
            </p>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-6 h-6 mx-auto border-2 border-primary rounded-full flex items-center justify-center"
            >
              <div className="w-1 h-1 bg-primary rounded-full"></div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 