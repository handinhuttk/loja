"use client";

import React, { useState } from 'react';
import { Truck, MapPin } from 'lucide-react';
import styles from './Shipping.module.css';

export default function Shipping() {
  const [cep, setCep] = useState('');
  const [location, setLocation] = useState('São Paulo, SP...');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCepSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) {
      setError('CEP inválido');
      return;
    }
    
    setError('');
    setLoading(true);
    try {
      const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cleanCep}`);
      if (!response.ok) throw new Error('CEP não encontrado');
      const data = await response.json();
      setLocation(`${data.city}, ${data.state}`);
    } catch (err) {
      setError('Não foi possível encontrar este CEP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.shippingRow}>
        <div className={styles.iconWrapper}>
          <Truck size={20} />
        </div>
        <div className={styles.shippingInfo}>
          <div className={styles.priceAndLoc}>
            <span className={`${styles.price} ${styles.freePrice}`}>Frete Expresso Grátis</span>
            <span className={styles.loc}>
              <MapPin size={12} />
              {location}
            </span>
          </div>
          <div className={styles.details}>
            Entrega garantida em até <strong>2 dias úteis</strong> para a sua região.
          </div>
          
          <form className={styles.cepForm} onSubmit={handleCepSearch}>
            <input 
              type="text" 
              placeholder="Digite seu CEP" 
              className={styles.cepInput}
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              maxLength={9}
            />
            <button type="submit" className={styles.cepBtn} disabled={loading}>
              {loading ? '...' : 'OK'}
            </button>
          </form>
          {error && <div className={styles.error}>{error}</div>}
        </div>
      </div>
    </div>
  );
}
