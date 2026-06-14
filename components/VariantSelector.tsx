"use client";

import React from 'react';
import Image from 'next/image';
import styles from './VariantSelector.module.css';

interface VariantSelectorProps {
  selectedVariant: number;
  setSelectedVariant: (index: number) => void;
}

export default function VariantSelector({ selectedVariant, setSelectedVariant }: VariantSelectorProps) {
  const options = ["Preto", "Branco"];

  return (
    <div className={styles.container}>
      <div className={styles.topRow}>
        <div className={styles.thumbnails}>
          <div 
            className={`${styles.thumbWrapper} ${selectedVariant === 0 ? styles.selected : ''}`}
            onClick={() => setSelectedVariant(0)}
          >
            <Image 
              src="/images/1.jpeg" 
              alt="Opção Preto" 
              fill
              className={styles.thumbImage}
            />
          </div>
          <div 
            className={`${styles.thumbWrapper} ${selectedVariant === 1 ? styles.selected : ''}`}
            onClick={() => setSelectedVariant(1)}
          >
            <Image 
              src="/images/1-branco.jpg" 
              alt="Opção Branco" 
              fill
              className={styles.thumbImage}
            />
          </div>
        </div>
        
        <div className={styles.optionsCount}>
          Preto, Branco &gt;
        </div>
      </div>
      
      <div className={styles.selectedName}>
        <span className={styles.labelPrefix}>Cor: </span>
        {options[selectedVariant]}
      </div>
    </div>
  );
}
