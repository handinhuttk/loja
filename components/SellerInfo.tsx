import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import styles from './SellerInfo.module.css';

export default function SellerInfo() {
  return (
    <div className={styles.container}>
      <div className={styles.sellerLeft}>
        <Image 
          src="https://images.unsplash.com/photo-1550525811-e5869dd03032?q=80&w=100&auto=format&fit=crop" 
          alt="Tech Store Logo" 
          width={48} 
          height={48} 
          className={styles.logo}
        />
        <div className={styles.sellerDetails}>
          <div className={styles.sellerName}>Tech Store Oficial</div>
          <div className={styles.sellerStats}>
            <span>1.2k Produtos</span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#F59E0B' }}>
              <Star size={12} fill="currentColor" /> 4.8
            </span>
          </div>
        </div>
      </div>
      <button className={styles.visitBtn}>
        Visitar Loja
      </button>
    </div>
  );
}
