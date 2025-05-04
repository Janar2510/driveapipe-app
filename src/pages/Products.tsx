import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import PageHeader from '../components/common/PageHeader';
import ProductCard from '../components/products/ProductCard';
import ProductForm from '../components/products/ProductForm';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';
import { Plus, ShoppingCart, Search, X, Filter } from 'lucide-react';
import { Product } from '../types';

const Products: React.FC = () => {
  const { products } = useCRM();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  
  // Filter products based on search and activity status
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesActive = showInactive || product.isActive;
    
    return matchesSearch && matchesActive;
  });
  
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };
  
  return (
    <div>
      <PageHeader
        title="Products"
        subtitle="Manage your product catalog and pricing"
        actions={
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Product
          </button>
        }
      />
      
      {products.length > 0 ? (
        <>
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Search products..."
              />
              {searchTerm && (
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setSearchTerm('')}
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showInactive"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="showInactive" className="ml-2 block text-sm text-gray-900">
                Show inactive products
              </label>
            </div>
          </div>
          
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  onClick={handleProductClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="mt-2 text-lg font-medium text-gray-900">No products match your search</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or create a new product.
              </p>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          title="No products yet"
          description="Start by adding your first product"
          icon={<ShoppingCart className="h-6 w-6" />}
          action={
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Product
            </button>
          }
        />
      )}
      
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Add Product"
        size="lg"
      >
        <ProductForm onClose={() => setShowCreateModal(false)} />
      </Modal>
      
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedProduct(null);
        }}
        title="Edit Product"
        size="lg"
      >
        {selectedProduct && (
          <ProductForm 
            product={selectedProduct}
            onClose={() => {
              setShowEditModal(false);
              setSelectedProduct(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default Products;