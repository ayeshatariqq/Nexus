import React from 'react';
import { useWallet } from '../../context/WalletContext';
import { Card, CardBody } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Wallet } from 'lucide-react';

const format = (n: number) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const WalletBalance: React.FC = () => {
  const { wallet } = useWallet();
  if (!wallet) return null;

  return (
            <Card className="bg-secondary-50 border border-secondary-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-secondary-100 rounded-full mr-4">
                <Wallet size={20} className="text-secondary-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-700">Wallet Balance</p>
                <h3 className="text-xl font-semibold text-secondary-900">{wallet.currency} {format(wallet.balance)}</h3>
              </div>
              <Badge variant="success">Mock • Safe</Badge>
            </div>
          </CardBody>
        </Card>

  );
};

export default WalletBalance;
