import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useViewMode } from '@/hooks/use-view-mode';
import AppLayout from '@/layouts/app-layout';
import { capitalizeWords, strLimit } from '@/lib/utils';
import { SharedData } from '@/types';
import { QueueCalls } from '@/types/queue_calls';
import { usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import { Filter, Grid2X2, TableIcon, Trash2 } from 'lucide-react';
import { FC, useState } from 'react';
import QueueCallsBulkDeleteDialog from './components/queue_calls-bulk-delete-dialog';
import QueueCallsDeleteDialog from './components/queue_calls-delete-dialog';
import QueueCallsFilterSheet from './components/queue_calls-filter-sheet';
import QueueCallsItemCard from './components/queue_calls-item-card';

type Props = {
  queue_calls: QueueCalls[];
  query: { [key: string]: string };
};

const QueueCallsList: FC<Props> = ({ queue_calls, query }) => {
  const { mode, toggle } = useViewMode();
  const [ids, setIds] = useState<number[]>([]);
  const [cari, setCari] = useState('');

  const { permissions } = usePage<SharedData>().props;

  return (
    <AppLayout
      title="Daftar Panggilan Antrian"
      description="Atur panggilan antrian dalam sistem antrian Anda."
      actions={[
        {
          title: capitalizeWords(mode) + ' view',
          icon: mode === 'grid' ? Grid2X2 : TableIcon,
          onClick: toggle,
        },
      ]}
    >
      <div className="flex gap-2">
        <Input placeholder="Search Antrian..." value={cari} onChange={(e) => setCari(e.target.value)} />
        <QueueCallsFilterSheet query={query}>
          <Button>
            <Filter />
            Filter data
            {Object.values(query).filter((val) => val && val !== '').length > 0 && (
              <Badge variant="secondary">{Object.values(query).filter((val) => val && val !== '').length}</Badge>
            )}
          </Button>
        </QueueCallsFilterSheet>
        {ids.length > 0 && (
          <>
            <Button variant={'ghost'} disabled>
              {ids.length} item selected
            </Button>
            {/* <QueueCallsBulkEditSheet queue_callsIds={ids} onSuccess={() => setIds([])}>
              <Button>
                <Edit /> Edit selected
              </Button>
            </QueueCallsBulkEditSheet> */}
            <QueueCallsBulkDeleteDialog queue_callsIds={ids} onSuccess={() => setIds([])}>
              <Button variant={'destructive'}>
                <Trash2 /> Delete selected
              </Button>
            </QueueCallsBulkDeleteDialog>
          </>
        )}
        {/* {permissions?.canAdd && <QueueCallsFormSheet purpose="create" buttonLabel="New queue_calls" />} */}
      </div>
      {mode === 'table' ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant={'ghost'} size={'icon'} asChild>
                  <Label>
                    <Checkbox
                      checked={ids.length === queue_calls.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setIds(queue_calls.map((queue_calls) => queue_calls.id));
                        } else {
                          setIds([]);
                        }
                      }}
                    />
                  </Label>
                </Button>
              </TableHead>
              <TableHead>Nomor Antrian</TableHead>
              <TableHead>Nama Petugas</TableHead>
              <TableHead>Loket</TableHead>
              <TableHead>Panggilan Ke</TableHead>
              <TableHead>Called At</TableHead>
              <TableHead>Finished At</TableHead>
              <TableHead className="text-center">Catatan</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {queue_calls
              .filter((queue_calls) => JSON.stringify(queue_calls).toLowerCase().includes(cari.toLowerCase()))
              .map((queue_calls) => (
                <TableRow key={queue_calls.id}>
                  <TableCell>
                    <Button variant={'ghost'} size={'icon'} asChild>
                      <Label>
                        <Checkbox
                          checked={ids.includes(queue_calls.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setIds([...ids, queue_calls.id]);
                            } else {
                              setIds(ids.filter((id) => id !== queue_calls.id));
                            }
                          }}
                        />
                      </Label>
                    </Button>
                  </TableCell>
                  <TableCell>{queue_calls.queue?.queue_number || '-'}</TableCell>
                  <TableCell>{queue_calls.user?.name || '-'}</TableCell>
                  <TableCell>{queue_calls.counter?.name || '-'}</TableCell>
                  <TableCell>{queue_calls.call_number ? queue_calls.call_number.toString().padStart(2, '0') : '00'}</TableCell>
                  <TableCell>{queue_calls.called_at ? dayjs(queue_calls.called_at).format('DD MMM YYYY - HH:mm') : '-'}</TableCell>
                  <TableCell>{queue_calls.finished_at ? dayjs(queue_calls.finished_at).format('DD MMM YYYY - HH:mm') : '-'}</TableCell>
                  <TableCell className="text-center">{strLimit(queue_calls.notes || '-')}</TableCell>

                  <TableCell>
                    {/* {permissions?.canShow && (
                      <Button variant={'ghost'} size={'icon'}>
                        <Link href={route('queue_calls.show', queue_calls.id)}>
                          <Folder />
                        </Link>
                      </Button>
                    )}
                    {permissions?.canUpdate && (
                      <>
                        <QueueCallsFormSheet purpose="edit" queue_calls={queue_calls} variant="icon" />
                      </>
                    )} */}
                    {permissions?.canDelete && (
                      <QueueCallsDeleteDialog queue_calls={queue_calls}>
                        <Button variant={'ghost'} size={'icon'}>
                          <Trash2 />
                        </Button>
                      </QueueCallsDeleteDialog>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      ) : (
        <div className="grid-responsive grid gap-4">
          {queue_calls
            .filter((queue_calls) => JSON.stringify(queue_calls).toLowerCase().includes(cari.toLowerCase()))
            .map((queue_calls) => (
              <QueueCallsItemCard key={queue_calls.id} queue_calls={queue_calls} />
            ))}
        </div>
      )}
    </AppLayout>
  );
};

export default QueueCallsList;
