import React, { useState, useEffect } from 'react';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import ProductSearch from './ProductSearch';
import { getProducts, deleteProduct } from '../services/productService';

const ProductModule: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    setLoading(true);
    const productData = await getProducts();
    setProducts(productData);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleProductSaved = async () => {
    setSelectedProduct(null);
    await loadProducts();
  };

  const handleEdit = (product: any) => {
  setSelectedProduct({ ...product });

  setTimeout(() => {
    const formElement = document.querySelector('.product-module form');

    if (formElement) {
      formElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, 100);
};

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    await loadProducts();
  };

  const filteredProducts = products.filter((product) => {
    const term = searchTerm.toLowerCase();
    return (
      product.name?.toLowerCase().includes(term) ||
      product.category?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="product-module">
      <h1>Gerenciador de Produtos</h1>
      <ProductForm
        product={selectedProduct}
        onProductSaved={handleProductSaved}
        onCancel={() => setSelectedProduct(null)}
      />
      <ProductSearch searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />
      <ProductList
        products={filteredProducts}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ProductModule;
