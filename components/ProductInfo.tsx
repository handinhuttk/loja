import React from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './ProductInfo.module.css';

export default function ProductInfo() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Projetor Hy320 Android Wi-fi Hd 390 Ansi Espelhament...
      </h1>
      <ChevronDown size={16} className={styles.arrow} />
    </div>
  );
}
