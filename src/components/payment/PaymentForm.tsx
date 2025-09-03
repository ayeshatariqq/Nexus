import React, { useState } from 'react';
import { useWallet } from '../../context/WalletContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

type Tab = 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER';

const PaymentForm: React.FC = () => {
  const { deposit, withdraw, transfer } = useWallet();
  const [tab, setTab] = useState<Tab>('DEPOSIT');
  const [amount, setAmount] = useState<string>('');
  const [toUserId, setToUserId] = useState<string>('');

  const amt = Number(amount);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (amt <= 0 || isNaN(amt)) return;

    if (tab === 'DEPOSIT') deposit(amt);
    else if (tab === 'WITHDRAW') withdraw(amt);
    else if (tab === 'TRANSFER') transfer(toUserId.trim(), amt);

    setAmount('');
    setToUserId('');
  }

  return (
    <Card className="p-4">
      <div className="flex gap-2 mb-4">
        {(['DEPOSIT', 'WITHDRAW', 'TRANSFER'] as Tab[]).map((t) => (
          <Button key={t} variant={t === tab ? 'primary' : 'outline'} onClick={() => setTab(t)}>
            {t}
          </Button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="grid gap-3 max-w-md">
        {tab === 'TRANSFER' && (
          <div>
            <label className="block text-sm mb-1">Receiver User ID</label>
            <Input placeholder="e.g. entrepreneur-1" value={toUserId} onChange={(e) => setToUserId(e.target.value)} />
          </div>
        )}

        <div>
          <label className="block text-sm mb-1">Amount (USD)</label>
          <Input type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>

        <div className="flex gap-2">
          <Button type="submit">Submit</Button>
          <Button type="button" variant="outline" onClick={() => { setAmount(''); setToUserId(''); }}>
            Reset
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default PaymentForm;
