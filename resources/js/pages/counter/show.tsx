import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { backAction } from '@/lib/utils';
import { Counter } from '@/types/counter';
import { Edit } from 'lucide-react';
import { FC, useState } from 'react';
import CounterFormSheet from './components/counter-form-sheet';
import CounterItemCard from './components/counter-item-card';

type Props = {
  counter: Counter;
};

const ShowCounter: FC<Props> = ({ counter }) => {
  const [openEditSheet, setOpenEditSheet] = useState(false);

  console.log(counter.services);

  return (
    <AppLayout
      title="Detail Counter"
      description="Detail counter"
      actions={[
        backAction(),
        {
          title: 'Edit counter',
          onClick: () => setOpenEditSheet(true),
          icon: Edit,
        },
      ]}
    >
      <CounterFormSheet
        open={openEditSheet}
        onOpenChange={setOpenEditSheet}
        purpose="edit"
        counter={counter}
        onSuccess={() => setOpenEditSheet(false)}
        withChildren={false}
      />

      <Card className="mb-6 border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Status Monitoring</CardTitle>
          <CardDescription>Monitoring operasional loket</CardDescription>
        </CardHeader>

        <div className="grid gap-6 px-6 pb-6 md:grid-cols-2">
          {/* STATUS */}
          <div className="rounded-xl border bg-muted/30 p-5">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">Status Operasional</p>

            <div className="mt-2 flex items-center justify-between">
              <span className="text-2xl font-bold">{counter.is_active ? 'Active' : 'Break'}</span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  counter.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
              >
                {counter.is_active ? 'Beroperasi' : 'Istirahat'}
              </span>
            </div>

            {counter.is_active && counter.operational_started_at && (
              <p className="mt-3 text-sm text-muted-foreground">
                Beroperasi sejak{' '}
                <span className="font-medium text-foreground">
                  {new Date(counter.operational_started_at).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </p>
            )}

            {!counter.is_active && counter.break_started_at && (
              <p className="mt-3 text-sm text-muted-foreground">
                Istirahat sejak{' '}
                <span className="font-medium text-foreground">
                  {new Date(counter.break_started_at).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </p>
            )}
          </div>

          {/* STATISTIK */}
          <div className="rounded-xl border bg-muted/30 p-5">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">Statistik Hari Ini</p>

            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Antrian Menunggu</span>
                <span className="text-xl font-semibold">{counter.waiting}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Dilayani Hari Ini</span>
                <span className="text-xl font-semibold">{counter.today_served}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <CounterItemCard counter={counter} />
    </AppLayout>
  );
};

export default ShowCounter;
