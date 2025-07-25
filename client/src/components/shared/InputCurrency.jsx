import React from 'react';
import { Input } from '@/components/ui/input';
import clsx from 'clsx';

export default function InputCurrency({
  symbol = '₹',
  id,
  value,
  onChange,
  className = '',
  ...props
}) {
  return (
    <div className="relative w-full">
      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
        {symbol}
      </span>
      <Input
        id={id}
        type="number"
        value={value}
        onChange={onChange}
        className={clsx('pl-6 text-right', className)}
        {...props}
      />
    </div>
  );
}
