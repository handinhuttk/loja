"use client";

import React, { useState } from 'react';
import Hero from '@/components/Hero';
import OfferBlock from '@/components/OfferBlock';
import ProductInfo from '@/components/ProductInfo';
import VariantSelector from '@/components/VariantSelector';
import Shipping from '@/components/Shipping';
import BenefitsBar from '@/components/BenefitsBar';
import SellerInfo from '@/components/SellerInfo';
import ProductDescription from '@/components/ProductDescription';
import BottomActionsBar from '@/components/BottomActionsBar';

import CheckoutDrawer from '@/components/CheckoutDrawer';

export default function Home() {
  const [selectedVariant, setSelectedVariant] = useState<number>(0);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <main style={{ maxWidth: '480px', margin: '0 auto', position: 'relative', backgroundColor: '#F3F4F6', minHeight: '100vh' }}>
      <Hero selectedVariant={selectedVariant} />
      <OfferBlock />
      <VariantSelector selectedVariant={selectedVariant} setSelectedVariant={setSelectedVariant} />
      <ProductInfo />
      <Shipping />
      <BenefitsBar />
      <SellerInfo />
      <ProductDescription />
      <BottomActionsBar onOpenCheckout={() => setIsCheckoutOpen(true)} />
      
      <CheckoutDrawer 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        selectedVariant={selectedVariant} 
      />
    </main>
  );
}
