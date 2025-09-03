import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Transaction, Wallet, Currency } from '../types';
import { useAuth } from './AuthContext'; // if your AuthContext exports a hook like this

type WalletContextValue = {
  currentUserId: string;
  wallet: Wallet | null;
  transactions: Transaction[];
  deposit: (amount: number, currency?: Currency) => void;
  withdraw: (amount: number, currency?: Currency) => void;
  transfer: (toUserId: string, amount: number, currency?: Currency) => void;
  fundDeal: (opts: { entrepreneurId: string; amount: number; dealTitle?: string; currency?: Currency }) => void;
};

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

const LS_WALLETS = 'wallets';
const LS_TRANSACTIONS = 'transactions';

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

function ensureWallet(wallets: Record<string, Wallet>, userId: string): Record<string, Wallet> {
  if (!wallets[userId]) {
    wallets[userId] = { userId, balance: 0, currency: 'USD' };
  }
  return wallets;
}

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try to get current user id from AuthContext; fallback to a demo id
  let authUserId = 'demo-investor';
  try {
    const auth = useAuth?.();
    if (auth?.user?.id) authUserId = auth.user.id as string;
  } catch {
    /* ignore - allow demo fallback */
  }
  const [currentUserId] = useState<string>(authUserId);

  const [wallets, setWallets] = useState<Record<string, Wallet>>(() =>
    load<Record<string, Wallet>>(LS_WALLETS, {})
  );
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    load<Transaction[]>(LS_TRANSACTIONS, [])
  );

  // Ensure the current user's wallet exists
  useEffect(() => {
    setWallets((prev) => {
      const next = { ...prev };
      ensureWallet(next, currentUserId);
      return next;
    });
  }, [currentUserId]);

  useEffect(() => save(LS_WALLETS, wallets), [wallets]);
  useEffect(() => save(LS_TRANSACTIONS, transactions), [transactions]);

  const wallet = wallets[currentUserId] ?? null;

  function addTx(tx: Omit<Transaction, 'id' | 'createdAt' | 'status'> & { status?: Transaction['status'] }) {
    const full: Transaction = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: tx.status ?? 'COMPLETED',
      ...tx,
    };
    setTransactions((prev) => [full, ...prev]);
    return full;
  }

  function deposit(amount: number, currency: Currency = 'USD') {
    if (amount <= 0) return;
    setWallets((prev) => {
      const copy = { ...prev };
      ensureWallet(copy, currentUserId);
      copy[currentUserId] = { ...copy[currentUserId], balance: copy[currentUserId].balance + amount, currency };
      return copy;
    });
    addTx({ type: 'DEPOSIT', amount, currency, receiverId: currentUserId });
  }

  function withdraw(amount: number, currency: Currency = 'USD') {
    if (amount <= 0) return;
    setWallets((prev) => {
      const copy = { ...prev };
      ensureWallet(copy, currentUserId);
      if (copy[currentUserId].balance < amount) {
        addTx({ type: 'WITHDRAW', amount, currency, senderId: currentUserId, status: 'FAILED' });
        return copy;
      }
      copy[currentUserId] = { ...copy[currentUserId], balance: copy[currentUserId].balance - amount, currency };
      return copy;
    });
    addTx({ type: 'WITHDRAW', amount, currency, senderId: currentUserId });
  }

  function transfer(toUserId: string, amount: number, currency: Currency = 'USD') {
    if (!toUserId || amount <= 0) return;
    setWallets((prev) => {
      const copy = { ...prev };
      ensureWallet(copy, currentUserId);
      ensureWallet(copy, toUserId);
      if (copy[currentUserId].balance < amount) {
        addTx({ type: 'TRANSFER', amount, currency, senderId: currentUserId, receiverId: toUserId, status: 'FAILED' });
        return copy;
      }
      copy[currentUserId] = { ...copy[currentUserId], balance: copy[currentUserId].balance - amount };
      copy[toUserId] = { ...copy[toUserId], balance: copy[toUserId].balance + amount };
      return copy;
    });
    addTx({ type: 'TRANSFER', amount, currency, senderId: currentUserId, receiverId: toUserId });
  }

  function fundDeal(opts: { entrepreneurId: string; amount: number; dealTitle?: string; currency?: Currency }) {
    const { entrepreneurId, amount, dealTitle, currency = 'USD' } = opts;
    if (!entrepreneurId || amount <= 0) return;
    setWallets((prev) => {
      const copy = { ...prev };
      ensureWallet(copy, currentUserId);
      ensureWallet(copy, entrepreneurId);
      if (copy[currentUserId].balance < amount) {
        addTx({
          type: 'FUNDING',
          amount,
          currency,
          senderId: currentUserId,
          receiverId: entrepreneurId,
          note: dealTitle ? `Deal: ${dealTitle}` : undefined,
          status: 'FAILED',
        });
        return copy;
      }
      copy[currentUserId] = { ...copy[currentUserId], balance: copy[currentUserId].balance - amount };
      copy[entrepreneurId] = { ...copy[entrepreneurId], balance: copy[entrepreneurId].balance + amount };
      return copy;
    });
    addTx({
      type: 'FUNDING',
      amount,
      currency,
      senderId: currentUserId,
      receiverId: entrepreneurId,
      note: dealTitle ? `Deal: ${dealTitle}` : undefined,
    });
  }

  const value: WalletContextValue = useMemo(
    () => ({ currentUserId, wallet, transactions, deposit, withdraw, transfer, fundDeal }),
    [currentUserId, wallet, transactions]
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within WalletProvider');
  return ctx;
}
