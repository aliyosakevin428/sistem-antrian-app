import { ActionItem } from '@/types';
import { type ClassValue, clsx } from 'clsx';
import dayjs from 'dayjs';
import { ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const em = (e: { [key: string]: string }) => {
  return Object.entries(e)
    .map(([, v]) => v)
    .join(', ');
};

export const goBack = () => {
  window.history.back();
};

export const backAction = (): ActionItem => {
  return {
    title: 'Kembali',
    icon: ChevronLeft,
    onClick: () => {
      goBack();
    },
  };
};

export function strLimit(text: string = '', limit: number = 50, end: string = '...'): string {
  if (text.length <= limit) return text;
  return text.slice(0, limit - end.length) + end;
}

export function dateDFY(date: string | Date) {
  return dayjs(date).format('DD MMMM YYYY');
}

export function handlePasteScreenshot(callback: (file: File) => void) {
  const onPaste = (e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.startsWith('image')) {
        const file = item.getAsFile();
        if (file) {
          callback(file);
        }
      }
    }
  };

  window.addEventListener('paste', onPaste);
  return () => window.removeEventListener('paste', onPaste); // biar bisa cleanup
}

// cara pakai handlePasteScreenShot

// useEffect(() => {
//   const cleanup = handlePasteScreenshot((file) => {
//     router.post(
//       route('article.upload-media', article.id),
//       {
//         file,
//       },
//       {
//         preserveScroll: true,
//         onSuccess: () => toast.success('upload completed'),
//         onError: (e) => toast.error(em(e)),
//       },
//     );
//   });

//   return cleanup;
// }, [article.id]);

export function generateSlug(text: string): string {
  const slugBase = text.replace(/\//g, '');
  return slugBase.toLowerCase().replace(/\s+/g, '-');
}

export function generatePassword(): string {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const digits = '0123456789';

  const randomChars = (charset: string, length: number): string => {
    return Array.from({ length }, () => charset.charAt(Math.floor(Math.random() * charset.length))).join('');
  };

  const part1 = randomChars(letters, 4); // \w{4}
  const part2 = randomChars(digits, 4); // \d{4}

  return part1 + part2;
}

export function groupBy<T, K extends keyof T>(array: T[], key: K): Record<string, T[]> {
  return array.reduce(
    (acc, item) => {
      const groupKey = String(item[key]);
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(item);
      return acc;
    },
    {} as Record<string, T[]>,
  );
}

export function copyMarkdownImage(alt: string, url: string) {
  const markdown = `![${alt}](${url})`;

  navigator.clipboard
    .writeText(markdown)
    .then(() => toast.success(`${alt} copied to clipboard`))
    .catch((err) => toast.error(err));
}

export function capitalizeWords(str: string): string {
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function formatRupiah(angka: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(angka);
}

export const formatQueueNumber = (num: number, length = 3) => num.toString().padStart(length, '0');
