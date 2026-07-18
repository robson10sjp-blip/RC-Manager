import React from 'react';

interface Product {
  id: string;
  name: string;
  category: string;
  costPrice: number;
  salePrice: number;
  stock: number;
  lowStockThreshold: number;
}

interface ProductListProps {
  products: Product[];
  loading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, loading, onEdit, onDelete }) => {
  if (loading) {
    return <div>Carregando produtos...</div>;
  }

  return (
    <div className="product-list">
      <h2>Lista de Produtos</h2>
      {products.length === 0 ? (
        <p>Nenhum produto encontrado.</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product.id} className="product-item">
              <div>
                <strong>{product.name}</strong>
                <div>Categoria: {product.category}</div>
                <div>Estoque: {product.stock}</div>
                <div>Preço custo: R$ {product.costPrice.toFixed(2)}</div>
                <div>Preço venda: R$ {product.salePrice.toFixed(2)}</div>
                {product.stock <= product.lowStockThreshold && (
                  <div className="stock-warning">Estoque baixo</div>
                )}
              </div>
              <div className="product-actions">
                <button onClick={() => onEdit(product)}>Editar</button>
                <button className="danger" onClick={() => onDelete(product.id)}>
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductList;
