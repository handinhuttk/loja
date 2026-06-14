"use client";

import React, { useState, useEffect } from 'react';
import { Tag } from 'lucide-react';
import styles from './OfferBlock.module.css';

export default function OfferBlock() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 16,
    seconds: 47
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (value: number) => value.toString().padStart(2, '0');

  return (
    <div className={styles.container}>
      {/* Top Banner Verde */}
      <div className={styles.topBanner}>
        <div className={styles.campaignName}>
          <span>Ofertas da Copa</span>
          <span style={{ backgroundColor: 'white', color: '#4CAF50', borderRadius: '50%', width: 14, height: 14, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 'bold' }}>&gt;</span>
        </div>
        <div className={styles.timerContainer}>
          <span>Termina em</span>
          <div className={styles.timerBoxes}>
            <span className={styles.timeBox}>{formatTime(timeLeft.hours)}</span>
            <span>:</span>
            <span className={styles.timeBox}>{formatTime(timeLeft.minutes)}</span>
            <span>:</span>
            <span className={styles.timeBox}>{formatTime(timeLeft.seconds)}</span>
          </div>
        </div>
      </div>

      {/* Bloco de Preços Branco com fundo degradê rosa */}
      <div className={styles.priceCard}>
        <div className={styles.priceGrid}>
          <div className={styles.mainPriceCol}>
            <span className={styles.priceLabel}>Preço Oferta</span>
            <div className={styles.currentPrice}>
              <span className={styles.currency}>R$</span>
              68,30
            </div>
          </div>
          
          <span className={styles.mathSign}>=</span>

          <div className={styles.oldPriceCol}>
            <span className={styles.oldPriceLabel}>Preço original</span>
            <span className={styles.oldPriceValue}>R$189,99</span>
          </div>
          
          <span className={styles.mathSign}>-</span>

          <div className={styles.couponCol}>
            <span className={styles.couponLabel}>Cupom</span>
            <span className={styles.couponValue}>R$121,69</span>
          </div>
        </div>

        <div className={styles.installmentsRow}>
          <div>
            <span className={styles.installmentsHighlight}>R$11,38</span> x6 Pagamento parcelado &gt;
          </div>
          <div className={styles.soldCount}>9.753 Vendidos ⓘ</div>
        </div>

        <div className={styles.badgesRow}>
          <div className={styles.discountBadge}>
            <Tag size={10} />
            64% OFF
          </div>
        </div>
      </div>
    </div>
  );
}
