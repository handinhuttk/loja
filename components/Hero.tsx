"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Share2, Heart, ShoppingCart, Search, ChevronLeft } from 'lucide-react';
import styles from './Hero.module.css';

interface HeroProps {
  selectedVariant: number;
}

export default function Hero({ selectedVariant }: HeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // When variant changes, reset gallery to index 0 to show the selected color
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedVariant]);

  const baseImages = [
    '/images/1.jpeg',
    '/images/2.jpeg',
    '/images/3.jpeg',
    '/images/4.jpeg',
    '/images/5.jpeg',
    '/images/6.jpeg',
    '/images/7.jpeg',
    '/images/8.jpeg'
  ];

  // Dynamically create the images array based on the selected variant
  const currentImages = [...baseImages];
  if (selectedVariant === 1) {
    currentImages[0] = '/images/1-branco.jpg';
  } else {
    currentImages[0] = '/images/1.jpeg'; // The black one
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % currentImages.length);
  };

  return (
    <div className={`${styles.heroContainer} fade-in`} onClick={handleNext}>
      <div className={styles.topBar}>
        <button className={styles.iconButton} aria-label="Voltar">
          <ChevronLeft size={24} />
        </button>
        <div className={styles.rightActions}>
          <button className={styles.iconButton} aria-label="Buscar">
            <Search size={20} />
          </button>
          <button className={styles.iconButton} aria-label="Compartilhar">
            <Share2 size={20} />
          </button>
          <button className={styles.iconButton} aria-label="Carrinho">
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>

      <div className={styles.imageWrapper}>
        <Image 
          src={currentImages[currentIndex]} 
          alt="Produto" 
          fill
          priority
          className={styles.mainImage}
        />
      </div>

      <div className={styles.pagination}>
        {currentImages.map((_, idx) => (
          <div 
            key={idx} 
            className={`${styles.dot} ${idx === currentIndex ? styles.dotActive : ''}`} 
          />
        ))}
      </div>
    </div>
  );
}
