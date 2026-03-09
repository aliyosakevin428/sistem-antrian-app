import { Button } from '@/components/ui/button';
import { useAppearance } from '@/hooks/use-appearance';
import { useQueueAnnouncement } from '@/hooks/useQueueAnnouncement';
import { QueueCalls } from '@/types/queue_calls';
import { router, usePage } from '@inertiajs/react';
import { Maximize, Minimize } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import WelcomeLayout from './layouts/welcome-layout';

type PageProps = {
  activeCalls: QueueCalls[];
  recentCalls: QueueCalls[];
};

export default function Welcome() {
  const { activeCalls, recentCalls } = usePage<PageProps>().props;
  const { announce } = useQueueAnnouncement();
  const { appearance } = useAppearance();

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const [welcomeIsDark, setWelcomeIsDark] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const displayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const isDark = appearance === 'dark' || (appearance === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    setWelcomeIsDark(!isDark);
  }, [appearance]);

  useEffect(() => {
    if (!activeCalls.length) return;
    activeCalls.forEach((call) => {
      const uniqueKey = `${call.queue.id}-${call.called_at}`;
      const text = `Nomor antrian ${call.queue.queue_number}, Silakan menuju ${call.counter.name}`;
      announce(uniqueKey, text);
    });
  }, [activeCalls, announce]);

  useEffect(() => {
    const interval = setInterval(() => {
      router.reload({ only: ['activeCalls', 'recentCalls'] });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      displayRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleMouseMove = () => {
      setShowButton(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setShowButton(false), 3000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    timeoutRef.current = setTimeout(() => setShowButton(false), 3000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <WelcomeLayout>
      <div
        className={`min-h-screen transition-colors duration-500 ${welcomeIsDark ? 'bg-foreground text-background' : 'bg-background text-foreground'}`}
      >
        <div
          ref={displayRef}
          className={`relative transition-all duration-500 ${isFullScreen ? 'flex h-screen w-screen flex-col p-12' : 'mx-auto max-w-7xl p-10'}`}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullScreen}
            className={`absolute top-6 right-6 z-50 transition-opacity duration-300 ${welcomeIsDark ? 'text-background hover:bg-background/10' : 'text-foreground hover:bg-foreground/10'} ${showButton ? 'opacity-100' : 'opacity-0'}`}
          >
            {isFullScreen ? <Minimize className="h-6 w-6" /> : <Maximize className="h-6 w-6" />}
          </Button>

          <div className="mb-8 text-center">
            <h1
              className={`font-bold tracking-widest ${welcomeIsDark ? 'text-background' : 'text-foreground'} ${isFullScreen ? 'text-5xl' : 'text-4xl'}`}
            >
              NOMOR ANTRIAN
            </h1>
            <div className="mx-auto mt-3 h-1 w-24 rounded-full bg-accent" />
          </div>

          <div className={`grid flex-1 gap-10 ${isFullScreen ? 'grid-cols-2 grid-rows-2' : 'md:grid-cols-2'}`}>
            {activeCalls.slice(0, 4).map((call) => (
              <div
                key={call.id}
                className={`flex flex-col items-center justify-center rounded-3xl border shadow-xl ${
                  welcomeIsDark
                    ? 'border-background/20 bg-gradient-to-br from-background/10 to-background/5'
                    : 'border-border bg-gradient-to-br from-card to-background'
                }`}
              >
                <div
                  className={`leading-none font-extrabold tracking-wider ${welcomeIsDark ? 'text-background' : 'text-foreground'} ${isFullScreen ? 'text-[120px]' : 'text-[90px]'}`}
                >
                  {call.queue.queue_number}
                </div>

                <div
                  className={`mt-6 font-semibold ${welcomeIsDark ? 'text-background/70' : 'text-muted-foreground'} ${isFullScreen ? 'text-3xl' : 'text-2xl'}`}
                >
                  {call.counter.name}
                </div>

                <div className={`mt-3 ${welcomeIsDark ? 'text-background/50' : 'text-muted-foreground'} ${isFullScreen ? 'text-xl' : 'text-lg'}`}>
                  Panggilan ke {call.call_number.toString().padStart(2, '0')}
                </div>
              </div>
            ))}
          </div>

          <div className={`mt-8 ${isFullScreen ? 'grid grid-cols-4 gap-6 text-xl' : 'mx-auto max-w-4xl space-y-3 text-lg'}`}>
            {recentCalls.slice(0, 4).map((call) => (
              <div
                key={call.id}
                className={`flex justify-between rounded-xl border px-6 py-3 ${
                  welcomeIsDark ? 'border-background/20 bg-background/10' : 'border-border bg-card/60'
                }`}
              >
                <span className={`font-semibold ${welcomeIsDark ? 'text-background' : 'text-foreground'}`}>{call.queue.queue_number}</span>
                <span className={welcomeIsDark ? 'text-background/70' : 'text-muted-foreground'}>{call.counter.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </WelcomeLayout>
  );
}
