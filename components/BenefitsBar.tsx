import React from 'react';
import { ShieldCheck, ChevronRight } from 'lucide-react';
import styles from './BenefitsBar.module.css';

export default function BenefitsBar() {
  return (
    <div className={styles.container}>
      <ShieldCheck size={14} className={styles.icon} />
      <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        Reembolso para quaisquer problemas de logística · Todos os problemas resolvidos
      </span>
      <ChevronRight size={14} />
    </div>
  );
}
