"use client";

import { useCart } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CartPage() {
  const { items, removeItem, clearCart } = useCart();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [hostel, setHostel] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Calculate Total
  const total = items.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    // 1. Send Order to Supabase
    const { error } = await supabase
      .from('orders')
      .insert({
        customer_name: name,
        phone: phone,
        address: hostel,
        items: JSON.stringify(items),
        total: total,
        paid: false
      });

    if (error) {
      alert("Error placing order: " + error.message);
      setLoading(false);
    } else {
      // 2. Success!
      alert("Order Sent! We will contact you to confirm payment.");
      clearCart();
      router.push('/');
    }
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="site-header">
          <div className="header-content">
            <h1 className="text-3xl font-bold" style={{ color: 'var(--primary)' }}>
              Campus Market
            </h1>
            <Link href="/" className="btn btn-outline">
              ← Back to Shop
            </Link>
          </div>
        </header>

        {/* Empty Cart Message */}
        <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
          <h2 className="section-title">Your cart is empty</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Add some delicious items to get started!
          </p>
          <Link href="/" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="site-header">
        <div className="header-content">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--primary)' }}>
            Campus Market
          </h1>
          <Link href="/" className="btn btn-outline">
            ← Continue Shopping
          </Link>
        </div>
      </header>

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        <h1 className="section-title">Checkout</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
          
          {/* Cart Items Card */}
          <div style={{ 
            background: 'white', 
            borderRadius: '16px', 
            padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem' }}>
              Order Summary
            </h2>
            
            {items.map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem 0',
                borderBottom: index < items.length - 1 ? '1px solid var(--border)' : 'none'
              }}>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    ₦{item.price}
                  </div>
                </div>
                <button 
                  onClick={() => removeItem(item.id)}
                  style={{
                    color: '#ff3b30',
                    fontSize: '0.875rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '1.5rem',
              paddingTop: '1rem',
              borderTop: '2px solid var(--border)',
              fontSize: '1.5rem',
              fontWeight: '700'
            }}>
              <span>Total:</span>
              <span style={{ color: 'var(--primary)' }}>₦{total}</span>
            </div>
          </div>

          {/* Checkout Form */}
          <form onSubmit={handleCheckout} style={{
            background: 'white',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>
              📍 Delivery Details
            </h2>
            
            <div className="mb-3">
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
                color: 'var(--text-primary)'
              }}>
                Full Name
              </label>
              <input 
                required
                className="search-input"
                style={{ background: 'white' }}
                placeholder="John Doe"
                value={name} 
                onChange={e => setName(e.target.value)}
              />
            </div>
            
            <div className="mb-3">
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
                color: 'var(--text-primary)'
              }}>
                Phone Number
              </label>
              <input 
                required
                className="search-input"
                style={{ background: 'white' }}
                placeholder="0801234567"
                value={phone} 
                onChange={e => setPhone(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
                color: 'var(--text-primary)'
              }}>
                Hostel / Room No
              </label>
              <input 
                required
                className="search-input"
                style={{ background: 'white' }}
                placeholder="Block A, Room 205"
                value={hostel} 
                onChange={e => setHostel(e.target.value)}
              />
            </div>

            {/* Payment Instructions */}
            <div style={{
              background: '#fff3cd',
              border: '2px solid #ffc107',
              borderRadius: '12px',
              padding: '1.25rem',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ 
                fontWeight: '700', 
                color: '#856404',
                marginBottom: '0.75rem',
                fontSize: '1rem'
              }}>
                💳 Payment Instructions
              </h3>
              <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                Transfer <strong style={{ color: 'var(--primary)' }}>₦{total}</strong> to:
              </p>
              <p style={{ 
                fontFamily: 'monospace', 
                fontSize: '1.5rem', 
                fontWeight: '700',
                margin: '0.5rem 0',
                color: '#000'
              }}>
                7015199028
              </p>
              <p style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                Palmpay • Abdulakeem Nurein
              </p>
              <p style={{ 
                fontSize: '0.75rem', 
                color: '#856404',
                marginTop: '0.75rem',
                fontStyle: 'italic'
              }}>
                ⚠️ Do not close this page until you have transferred.
              </p>
            </div>

            <button 
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', fontSize: '1rem' }}
            >
              {loading ? "Processing..." : "✅ I Have Paid (Place Order)"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}