import React from 'react';

interface ProductSearchProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
}

const ProductSearch: React.FC<ProductSearchProps> = ({ searchTerm, onSearchTermChange }) => {
  return (
    <div className="product-search">
      <input
        type="text"
        placeholder="Buscar produto por nome ou categoria..."
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
      />
    </div>
  );
};

export default ProductSearch;
