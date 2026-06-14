"use client";

import React, { useState, useEffect } from 'react';
import { Store, MessageCircle, ShoppingCart } from 'lucide-react';
import styles from './BottomActionsBar.module.css';

interface BottomActionsBarProps {
  onOpenCheckout?: () => void;
}

export default function BottomActionsBar({ onOpenCheckout }: BottomActionsBarProps) {
  const [orders, setOrders] = useState(745);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIncrease = Math.floor(Math.random() * 5) + 2; 
      setOrders(prev => prev + randomIncrease);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.messageBar}>
        {orders} pedidos feitos recente
      </div>
      
      <div className={styles.container}>
        <div className={styles.leftActions}>
          <button className={styles.iconBtn}>
            <Store size={20} color="#333" />
            <span>Loja</span>
          </button>
          <button className={styles.iconBtn}>
            <MessageCircle size={20} color="#333" />
            <span>Contatar</span>
          </button>
        </div>

        <button className={styles.cartBtn} onClick={onOpenCheckout}>
          <ShoppingCart size={22} />
        </button>

        <button className={styles.buyBtn} onClick={onOpenCheckout}>
          <span>Compre Agora</span>
          <span className={styles.buyBtnSub}>O Menor Preço</span>
        </button>
      </div>
    </div>
  );
}
