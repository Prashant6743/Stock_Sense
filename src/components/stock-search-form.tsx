'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';

const FormSchema = z.object({
  ticker: z.string().min(1, 'Please enter a ticker').max(10, 'Ticker is too long').regex(/^[a-zA-Z0-9.-]+$/, 'Invalid characters in ticker'),
});

interface StockSearchFormProps {
  onSubmit: (ticker: string) => void;
  loading: boolean;
}

export function StockSearchForm({ onSubmit, loading }: StockSearchFormProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ticker: '',
    },
  });

  function handleFormSubmit(data: z.infer<typeof FormSchema>) {
    onSubmit(data.ticker);
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex gap-2 items-start">
        <FormField
          control={form.control}
          name="ticker"
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormControl>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="e.g., AAPL, GOOG, TSLA"
                    className="pl-10 text-base"
                    {...field}
                    autoComplete="off"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading} size="lg">
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            'Analyze'
          )}
        </Button>
      </form>
    </Form>
  );
}
