import { Card, CardContent } from '@/components/ui/card';
import dayjs from 'dayjs';
import { Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';

const DateTimeWidget = () => {
  const [now, setNow] = useState(dayjs());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(dayjs());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardContent className="flex min-h-[50px] flex-col items-center justify-center p-2 text-center">
        <div className="mb-2 flex items-center gap-2 text-gray-500">
          <Calendar size={18} />
          <span className="text-xl">{now.format('DD MMMM YYYY')}</span>
        </div>

        <div className="font-mono text-5xl font-bold tracking-tight md:text-4xl">{now.format('HH:mm:ss')}</div>
      </CardContent>
    </Card>
  );
};

export default DateTimeWidget;
