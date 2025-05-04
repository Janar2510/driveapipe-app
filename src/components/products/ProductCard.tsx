import React from 'react';
import { Product } from '../../types';
import { Tag, AlertCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onClick?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(product);
    }
  };
  
  return (
    <div 
      className={`bg-gray-900/40 backdrop-blur-md rounded-lg border border-white/10 hover:bg-gray-900/50 transition-all duration-200 ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={handleClick}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-medium text-white">{product.name}</h3>
            <div className="mt-1 flex items-center">
              <span className="text-sm text-gray-300 mr-2">{product.code}</span>
              {!product.isActive && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-900/50 text-gray-100 ring-1 ring-white/20">
                  Inactive
                </span>
              )}
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-lg font-medium text-white">
              {product.currency} {product.price.toLocaleString()}
            </div>
            {product.tax > 0 && (
              <div className="text-xs text-gray-300">
                +{product.tax}% tax
              </div>
            )}
          </div>
        </div>
        
        {product.description && (
          <div className="mt-3 text-sm text-gray-300">
            {product.description}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;