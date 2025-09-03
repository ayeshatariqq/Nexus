import React from 'react';
import { useWallet } from '../../context/WalletContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Transaction } from '../../types';

const header = ['Date', 'Type', 'Amount', 'Sender', 'Receiver', 'Status', 'Note'];

const format = (n: number) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const TransactionTable: React.FC<{ filterMine?: boolean }> = ({ filterMine = true }) => {
  const { transactions, currentUserId } = useWallet();

  const rows = transactions.filter((t) => {
    if (!filterMine) return true;
    return t.senderId === currentUserId || t.receiverId === currentUserId || (t.type === 'DEPOSIT' && t.receiverId === currentUserId) || (t.type === 'WITHDRAW' && t.senderId === currentUserId);
  });

  const badge = (status: Transaction['status']) =>
    status === 'COMPLETED' ? <Badge variant="success">Completed</Badge>
      : status === 'FAILED' ? <Badge variant="danger">Failed</Badge>
      : <Badge variant="warning">Pending</Badge>;

  return (
    <Card className="p-0 overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left bg-gray-50">
            {header.map((h) => (
              <th key={h} className="px-4 py-2 font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td className="px-4 py-6 text-gray-500" colSpan={header.length}>No transactions yet.</td></tr>
          ) : rows.map((t) => (
            <tr key={t.id} className="border-t">
              <td className="px-4 py-2">{new Date(t.createdAt).toLocaleString()}</td>
              <td className="px-4 py-2">{t.type}</td>
              <td className="px-4 py-2">{t.currency} {format(t.amount)}</td>
              <td className="px-4 py-2">{t.senderId ?? '—'}</td>
              <td className="px-4 py-2">{t.receiverId ?? '—'}</td>
              <td className="px-4 py-2">{badge(t.status)}</td>
              <td className="px-4 py-2">{t.note ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};

export default TransactionTable;
