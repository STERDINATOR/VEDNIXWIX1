import React from 'react';
import { motion } from 'framer-motion';
import { Shop } from '@/components/ui/shop';
import { useMember } from '@/integrations';

export default function ShopPage() {
  const { member } = useMember();

  const handlePurchase = (item: any) => {
    // In a real app, this would handle the purchase logic
    console.log('Purchasing item:', item);
    // Show success notification, update user balance, etc.
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-[120rem] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Shop 
            userXP={15750}
            userGems={250}
            userCoins={1200}
            onPurchase={handlePurchase}
          />
        </motion.div>
      </div>
    </div>
  );
}