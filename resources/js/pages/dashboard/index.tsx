import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Counter } from '@/types/counter';
import { QueueCalls } from '@/types/queue_calls';
import { router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import CounterStatusWidget from './widget/counter-status-widget';
import DateTimeWidget from './widget/date-time-widget';
import QueueWidget from './widget/queue-widget';
import UserInfoWidget from './widget/user-info-widget';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
];

export default function Dashboard() {
  const {
    auth: { roles },
    counter,
    currentCall,
    waitingCount,
  } = usePage<
    SharedData & {
      counter: Counter | null;
      currentCall: QueueCalls | null;
      waitingCount: number;
    }
  >().props;

  useEffect(() => {
    const interval = setInterval(() => {
      router.reload({
        only: ['counter', 'currentCall', 'waitingCount'],
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AppLayout title="Dashboard" description={`Selamat datang, kamu masuk sebagai ${roles.join(', ')}`} breadcrumbs={breadcrumbs}>
      <div className="grid gap-6 md:grid-cols-2">
        <UserInfoWidget />
        <DateTimeWidget />
      </div>
      <div className="mt-4 grid gap-6 lg:grid-cols-2">
        {counter && (
          <>
            <QueueWidget counter={counter} currentCall={currentCall} waitingCount={waitingCount} />

            <CounterStatusWidget counter={counter} />
          </>
        )}
      </div>
    </AppLayout>
  );
}
