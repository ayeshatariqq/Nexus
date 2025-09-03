import React, { useState } from 'react';
import { useWallet } from '../../context/WalletContext';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';

interface Props {
  entrepreneurId: string;
  dealTitle?: string;
  buttonLabel?: string;
}

const FundDealButton: React.FC<Props> = ({ entrepreneurId, dealTitle, buttonLabel = 'Fund Deal' }) => {
  const { fundDeal } = useWallet();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState<string>('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const amt = Number(amount);
    if (isNaN(amt) || amt <= 0) return;
    fundDeal({ entrepreneurId, amount: amt, dealTitle });
    setOpen(false);
    setAmount('');
  }

  return (
    <>
      <Button variant="accent" onClick={() => setOpen(true)}>{buttonLabel}</Button>

      {open && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <Card className="p-4 w-full max-w-md z-50">
            <div className="text-lg font-semibold mb-1">Fund Deal</div>
            <div className="text-sm text-gray-500 mb-4">
              {dealTitle ? `Deal: ${dealTitle}` : null} • Receiver: <span className="font-mono">{entrepreneurId}</span>
            </div>
            <form onSubmit={submit} className="grid gap-3">
              <div>
                <label className="block text-sm mb-1">Amount (USD)</label>
                <Input type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit">Confirm Funding</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </>
  );
};

export default FundDealButton;
