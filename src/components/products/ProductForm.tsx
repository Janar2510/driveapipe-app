import React from 'react';
import { useForm } from 'react-hook-form';
import { useCRM } from '../../context/CRMContext';
import { Product } from '../../types';

interface ProductFormProps {
  product?: Product;
  onClose: () => void;
}

interface ProductFormData {
  name: string;
  code: string;
  description?: string;
  price: number;
  currency: string;
  tax: number;
  isActive: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onClose }) => {
  const { createProduct, updateProduct } = useCRM();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProductFormData>({
    defaultValues: product ? {
      name: product.name,
      code: product.code,
      description: product.description,
      price: product.price,
      currency: product.currency,
      tax: product.tax,
      isActive: product.isActive,
    } : {
      currency: 'USD',
      tax: 0,
      isActive: true,
    },
  });
  
  const onSubmit = async (data: ProductFormData) => {
    if (product) {
      // Update existing product
      await updateProduct(product.id, data);
    } else {
      // Create new product
      await createProduct(data);
    }
    
    onClose();
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Product name *
        </label>
        <input
          type="text"
          id="name"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          {...register('name', { required: 'Product name is required' })}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="code" className="block text-sm font-medium text-gray-700">
          Product code *
        </label>
        <input
          type="text"
          id="code"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          {...register('code', { required: 'Product code is required' })}
        />
        {errors.code && (
          <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          {...register('description')}
        ></textarea>
      </div>
      
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price *
          </label>
          <input
            type="number"
            id="price"
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            {...register('price', { 
              required: 'Price is required',
              valueAsNumber: true,
              min: { value: 0, message: 'Price must be positive' },
            })}
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>
        
        <div className="sm:col-span-3">
          <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
            Currency *
          </label>
          <select
            id="currency"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            {...register('currency', { required: 'Currency is required' })}
          >
            <option value="USD">USD - $</option>
            <option value="EUR">EUR - €</option>
            <option value="GBP">GBP - £</option>
            <option value="CAD">CAD - $</option>
            <option value="AUD">AUD - $</option>
            <option value="JPY">JPY - ¥</option>
          </select>
        </div>
      </div>
      
      <div>
        <label htmlFor="tax" className="block text-sm font-medium text-gray-700">
          Tax rate (%)
        </label>
        <input
          type="number"
          id="tax"
          min="0"
          max="100"
          step="0.01"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          {...register('tax', { 
            valueAsNumber: true,
            min: { value: 0, message: 'Tax rate must be positive' },
            max: { value: 100, message: 'Tax rate cannot exceed 100%' },
          })}
        />
        {errors.tax && (
          <p className="mt-1 text-sm text-red-600">{errors.tax.message}</p>
        )}
      </div>
      
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="isActive"
            type="checkbox"
            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
            {...register('isActive')}
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="isActive" className="font-medium text-gray-700">
            Active product
          </label>
          <p className="text-gray-500">Inactive products won't appear in deal product selectors</p>
        </div>
      </div>
      
      <div className="pt-5 flex justify-end space-x-3">
        <button
          type="button"
          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;