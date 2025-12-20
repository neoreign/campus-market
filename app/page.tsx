"use client";

import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import ProductCard from './components/ProductCard';
import { useEffect, useState } from 'react';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [loading, setLoading] = useState(true);

  // Categories list
  const categories = [
    'All Products',
    'Fruits',
    'Vegetables',
    'Dairy',
    'Snacks',
    'Beverages',
    'Bakery',
    'Pantry'
  ];

  // Fetch products on mount
  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) {
        console.error('Error fetching products:', error);
      } else {
        setProducts(data || []);
        setFilteredProducts(data || []);
      }
      setLoading(false);
    }

    fetchProducts();
  }, []);

  // Filter products when category changes (case-insensitive)
  useEffect(() => {
    if (selectedCategory === 'All Products') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) => 
          product.category && 
          product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
      setFilteredProducts(filtered);
    }
  }, [selectedCategory, products]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <header className="site-header">
          <div className="header-content">
            <h1 className="text-3xl font-bold" style={{ color: 'var(--primary)' }}>
              Campus Market
            </h1>
          </div>
        </header>
        <div className="container text-center" style={{ paddingTop: '4rem' }}>
          <p>Loading products...</p>
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
          
          <Link href="/cart" className="btn btn-primary">
            🛒 Go to Cart
          </Link>
        </div>
      </header>

      {/* Category Pills Section */}
      <div className="category-pills">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`category-pill ${
              selectedCategory === category ? 'active' : ''
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div style={{ 
            gridColumn: '1 / -1', 
            textAlign: 'center', 
            padding: '4rem 2rem',
            color: 'var(--text-secondary)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              No products in this category
            </h3>
            <p>Try selecting a different category</p>
          </div>
        )}
      </div>
    </main>
  );
}