import React from 'react';
import WalletBalance from '../../components/payment/WalletBalance';
import PaymentForm from '../../components/payment/PaymentForm';
import TransactionTable from '../../components/payment/TransactionTable';

const PaymentsPage: React.FC = () => {
  return (
      <div className="grid gap-4">
        <WalletBalance />
        <PaymentForm />
        <div>
          <h2 className="text-lg font-semibold mb-2">Transaction History</h2>
          <TransactionTable />
        </div>
      </div>

  );
};

export default PaymentsPage;
