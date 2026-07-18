import React, { useState, useEffect } from 'react';
import { addProduct, updateProduct } from '../services/productService';

interface Product {
  id?: string;
  name?: string;
  category?: string;
  costPrice?: number;
  salePrice?: number;
  stock?: number;
  lowStockThreshold?: number;
}

interface ProductFormProps {
  product: Product | null;
  onProductSaved: () => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onProductSaved, onCancel }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Masculina');
  const [costPrice, setCostPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [stock, setStock] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState('5');

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setCategory(product.category || 'Masculina');
      setCostPrice(product.costPrice?.toString() || '');
      setSalePrice(product.salePrice?.toString() || '');
      setStock(product.stock?.toString() || '');
      setLowStockThreshold(product.lowStockThreshold?.toString() || '5');
    } else {
      clearForm();
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const productData = {
      name,
      category,
      costPrice: Number(costPrice) || 0,
      salePrice: Number(salePrice) || 0,
      stock: Number(stock) || 0,
      lowStockThreshold: Number(lowStockThreshold) || 5,
    };

    if (product?.id) {
      await updateProduct(product.id, productData);
    } else {
      await addProduct(productData);
    }

    onProductSaved();
    clearForm();
  };

  const clearForm = () => {
    setName('');
    setCategory('Masculina');
    setCostPrice('');
    setSalePrice('');
    setStock('');
    setLowStockThreshold('5');
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <h2>{product?.id ? 'Editar Produto' : 'Novo Produto'}</h2>
      <div>
        <label>Nome:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Categoria:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Masculina">Masculina</option>
          <option value="Feminina">Feminina</option>
          <option value="Infantil">Infantil</option>
        </select>
      </div>
      <div>
        <label>Preço de custo:</label>
        <input
          type="number"
          step="0.01"
          value={costPrice}
          onChange={(e) => setCostPrice(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Preço de venda:</label>
        <input
          type="number"
          step="0.01"
          value={salePrice}
          onChange={(e) => setSalePrice(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Quantidade em estoque:</label>
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Alerta de estoque baixo:</label>
        <input
          type="number"
          value={lowStockThreshold}
          onChange={(e) => setLowStockThreshold(e.target.value)}
          required
        />
      </div>
      <div className="form-actions">
        <button type="submit">{product?.id ? 'Atualizar' : 'Adicionar'} Produto</button>
        {product?.id && (
          <button type="button" className="secondary" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default ProductForm;
