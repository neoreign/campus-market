"use client";

import { useCart } from '@/lib/store';

export default function ProductCard({ product }: { product: any }) {
  const addItem = useCart((state) => state.addItem);

  return (
    <div className="product-card">
      {/* Product Image with 1:1 aspect ratio */}
      <div className="product-image-wrapper">
        <img 
          src={product.image_url} 
          alt={product.name} 
          className="product-image"
        />
      </div>
      
      {/* Product Information */}
      <div className="product-info">
        {/* Category Badge */}
        {product.category && (
          <span className="product-category">{product.category}</span>
        )}
        
        <h2 className="product-name">{product.name}</h2>
        <p className="product-price">₦{product.price}</p>
        
        <button 
          onClick={() => {
            addItem(product);
            alert("Added to cart!");
          }}
          className="btn btn-primary w-full mt-2"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}