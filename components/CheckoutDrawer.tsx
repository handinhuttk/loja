"use client";

import React, { useState, useEffect } from 'react';
import { X, Lock, ShieldCheck, MapPin, CreditCard, QrCode, User } from 'lucide-react';
import styles from './CheckoutDrawer.module.css';
import { fbq } from '@/components/FacebookPixel';

interface CheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVariant: number;
}

export default function CheckoutDrawer({ isOpen, onClose, selectedVariant }: CheckoutDrawerProps) {
  useEffect(() => {
    if (isOpen) {
      fbq('track', 'InitiateCheckout');
    }
  }, [isOpen]);

  const [cep, setCep] = useState('');
  const [address, setAddress] = useState({ logradouro: '', bairro: '', localidade: '', uf: '' });
  
  const [formData, setFormData] = useState({ nome: '', email: '', cpf: '', telefone: '', numero: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [pixResult, setPixResult] = useState<{ copiaECola: string; qrCodeUrl: string } | null>(null);

  const finalPrice = 'R$ 68,30';

  const handleCepSearch = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cleanCep = e.target.value.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      try {
        const res = await fetch(`https://brasilapi.com.br/api/cep/v1/${cleanCep}`);
        if (res.ok) {
          const data = await res.json();
          setAddress({ logradouro: data.street, bairro: data.neighborhood, localidade: data.city, uf: data.state });
        }
      } catch (err) {
        console.error("Erro ao buscar CEP", err);
      }
    }
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, cep, ...address, variant: selectedVariant })
      });
      const data = await res.json();
      
      if (data.success && data.pix) {
        setPixResult(data.pix);
      } else {
        const errorMsg = data.details ? JSON.stringify(data.details.message || data.details.errors || data.details) : '';
        alert(`${data.error || 'Erro ao gerar PIX'}\n\nMotivo: ${errorMsg}`);
      }
    } catch (err) {
      alert('Falha na comunicação com o servidor');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyPix = () => {
    if (pixResult) {
      navigator.clipboard.writeText(pixResult.copiaECola);
      alert('Código PIX copiado!');
    }
  };

  return (
    <>
      <div 
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`} 
        onClick={onClose}
      />
      <div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}>
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <Lock size={16} /> Finalizar Compra
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.content}>
          {pixResult ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <h3 style={{ color: '#22c55e', marginBottom: '16px' }}>PIX Gerado com Sucesso!</h3>
              <p style={{ fontSize: '13px', color: '#555', marginBottom: '20px' }}>
                Abra o aplicativo do seu banco, escolha a opção "PIX Copia e Cola" ou escaneie o QR Code abaixo para garantir sua oferta.
              </p>
              
              <div style={{ background: '#f9f9f9', padding: '16px', borderRadius: '12px', display: 'inline-block', marginBottom: '20px' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={pixResult.qrCodeUrl} alt="QR Code PIX" width={200} height={200} style={{ borderRadius: '8px' }} />
              </div>

              <div>
                <button 
                  onClick={copyPix}
                  style={{ width: '100%', padding: '14px', background: '#f0fdf4', color: '#166534', border: '1px solid #22c55e', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                >
                  <QrCode size={18} /> Copiar Código PIX
                </button>
              </div>

              {/* Aviso de Segurança do Banco Central */}
              <div style={{ marginTop: '20px', padding: '14px', background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '8px', textAlign: 'left', fontSize: '12px', color: '#92400e', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <ShieldCheck size={24} style={{ flexShrink: 0, marginTop: '2px', color: '#d97706' }} />
                <div>
                  <strong style={{ display: 'block', marginBottom: '4px', fontSize: '13px' }}>Aviso de Segurança (Banco Central)</strong>
                  Devido às novas regras e protocolos antifraude das instituições financeiras, o seu banco pode exibir um alerta de segurança na hora do pagamento. <strong>Não se preocupe!</strong> Esse é um procedimento padrão do sistema bancário. Nossa loja é verificada e sua compra é <strong>100% segura e confiável</strong>.
                </div>
              </div>

              {/* Security Badges para transmitir mais confiança na hora do pagamento */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '24px', flexWrap: 'wrap', borderTop: '1px solid #eaeaea', paddingTop: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={20} color="#22c55e" />
                  <span style={{ fontSize: '10px', color: '#666', fontWeight: 'bold', textTransform: 'uppercase' }}>Pagamento 100% Seguro</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <Lock size={20} color="#22c55e" />
                  <span style={{ fontSize: '10px', color: '#666', fontWeight: 'bold', textTransform: 'uppercase' }}>Ambiente Criptografado</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <QrCode size={20} color="#22c55e" />
                  <span style={{ fontSize: '10px', color: '#666', fontWeight: 'bold', textTransform: 'uppercase' }}>Aprovação Imediata</span>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.section}>
                <div className={styles.sectionTitle}>
                  <User size={16} /> 1. Dados Pessoais
                </div>
                <div className={styles.inputGroup}>
                  <input type="text" className={styles.input} placeholder="Nome Completo" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} />
                </div>
                <div className={styles.inputGroup}>
                  <input type="email" className={styles.input} placeholder="E-mail" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className={styles.row}>
                  <input type="text" className={styles.input} placeholder="CPF" value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})} />
                  <input type="tel" className={styles.input} placeholder="Celular/WhatsApp" value={formData.telefone} onChange={e => setFormData({...formData, telefone: e.target.value})} />
                </div>
              </div>

              <div className={styles.section}>
                <div className={styles.sectionTitle}>
                  <MapPin size={16} /> 2. Endereço de Entrega
                </div>
                <div className={styles.row}>
                  <input 
                    type="text" 
                    className={styles.input} 
                    placeholder="CEP" 
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    onBlur={handleCepSearch}
                  />
                  <input type="text" className={styles.input} placeholder="Número" style={{ width: '100px' }} value={formData.numero} onChange={e => setFormData({...formData, numero: e.target.value})} />
                </div>
                <div className={styles.inputGroup}>
                  <input type="text" className={styles.input} placeholder="Rua / Avenida" value={address.logradouro} onChange={e => setAddress({...address, logradouro: e.target.value})} />
                </div>
                <div className={styles.inputGroup}>
                  <input type="text" className={styles.input} placeholder="Bairro" value={address.bairro} onChange={e => setAddress({...address, bairro: e.target.value})} />
                </div>
                <div className={styles.row}>
                  <input type="text" className={styles.input} placeholder="Cidade" value={address.localidade} onChange={e => setAddress({...address, localidade: e.target.value})} />
                  <input type="text" className={styles.input} placeholder="Estado" value={address.uf} style={{ width: '80px' }} onChange={e => setAddress({...address, uf: e.target.value})} />
                </div>
              </div>

              <div className={styles.section}>
                <div className={styles.sectionTitle}>
                  <CreditCard size={16} /> 3. Pagamento
                </div>
                <div style={{ fontSize: '13px', color: '#555', textAlign: 'center', padding: '16px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #22c55e', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <QrCode size={32} color="#22c55e" />
                  <strong>Pagamento via PIX</strong>
                  O código PIX será gerado na próxima etapa. A aprovação é imediata e seu pedido é processado mais rápido!
                </div>
              </div>
            </>
          )}
        </div>

        {!pixResult && (
          <div className={styles.footer}>
            <button className={styles.finishBtn} onClick={handleCheckout} disabled={isProcessing}>
              {isProcessing ? 'Gerando PIX...' : <><Lock size={18} /> Pagar {finalPrice} Seguro</>}
            </button>
            <div className={styles.securityBadges}>
              <span><ShieldCheck size={12} color="#22c55e" /> Pagamento Seguro</span>
              <span><Lock size={12} color="#22c55e" /> Criptografia SSL</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
