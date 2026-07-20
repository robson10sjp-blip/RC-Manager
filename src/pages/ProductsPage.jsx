import { useEffect, useMemo, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

const categoryOptions = ['masculino', 'feminino', 'infantil'];

function formatCurrency(value) {
  return Number(value || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

function normalize(value) {
  return String(value || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

export default function ProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    code: '',
    description: '',
    category: 'masculino',
    size: '',
    color: '',
    costPrice: 0,
    salePrice: 0,
    stockQuantity: 0,
    minStock: 0
  });

  useEffect(() => {
    if (!user) return;
    setLoading(true);

    const q = query(
      collection(db, 'products'),
      where('ownerUid', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
        setProducts(items);
        setLoading(false);
      },
      (snapshotError) => {
        console.error('Erro ao carregar produtos', snapshotError);
        setError('Não foi possível carregar os produtos. Tente novamente.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const filteredProducts = useMemo(() => {
    const query = normalize(search);
    if (!query) return products;

    return products.filter((product) => {
      return [
        product.code,
        product.description,
        product.category,
        product.size,
        product.color
      ].some((field) => normalize(field).includes(query));
    });
  }, [products, search]);

  const indicators = useMemo(() => {
    const totalProducts = products.length;
    const totalUnits = products.reduce((sum, item) => sum + Number(item.stockQuantity || 0), 0);
    const totalCost = products.reduce((sum, item) => sum + Number(item.costPrice || 0) * Number(item.stockQuantity || 0), 0);
    const lowStockCount = products.filter((item) => Number(item.stockQuantity || 0) <= Number(item.minStock || 0)).length;
    return { totalProducts, totalUnits, totalCost, lowStockCount };
  }, [products]);

  const resetForm = () => {
    setEditingId(null);
    setForm({
      code: '',
      description: '',
      category: 'masculino',
      size: '',
      color: '',
      costPrice: 0,
      salePrice: 0,
      stockQuantity: 0,
      minStock: 0
    });
    setError(null);
    setMessage(null);
  };

  const validateProduct = (data) => {
    if (!data.code.trim()) return 'O código do produto é obrigatório.';
    if (!data.description.trim()) return 'A descrição é obrigatória.';
    if (!categoryOptions.includes(data.category)) return 'Categoria inválida.';
    if (Number(data.costPrice) < 0) return 'O preço de custo não pode ser negativo.';
    if (Number(data.salePrice) < 0) return 'O preço de venda não pode ser negativo.';
    if (Number(data.stockQuantity) < 0) return 'A quantidade em estoque não pode ser negativa.';
    if (Number(data.minStock) < 0) return 'O estoque mínimo não pode ser negativo.';
    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    const validationError = validateProduct(form);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (!user) return;

    setSaving(true);

    try {
      const payload = {
        ownerUid: user.uid,
        code: form.code.trim(),
        description: form.description.trim(),
        category: form.category,
        size: form.size.trim(),
        color: form.color.trim(),
        costPrice: Number(form.costPrice),
        salePrice: Number(form.salePrice),
        stockQuantity: Number(form.stockQuantity),
        minStock: Number(form.minStock),
        createdAt: serverTimestamp()
      };

      if (editingId) {
        await updateDoc(doc(db, 'products', editingId), payload);
        setMessage('Produto atualizado com sucesso.');
      } else {
        await addDoc(collection(db, 'products'), payload);
        setMessage('Produto cadastrado com sucesso.');
      }

      resetForm();
    } catch (saveError) {
      console.error('Erro ao salvar produto', saveError);
      setError('Não foi possível salvar o produto. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

const handleEdit = (product) => {
  setEditingId(product.id);

  setForm({
    code: product.code || '',
    description: product.description || '',
    category: product.category || 'masculino',
    size: product.size || '',
    color: product.color || '',
    costPrice: Number(product.costPrice || 0),
    salePrice: Number(product.salePrice || 0),
    stockQuantity: Number(product.stockQuantity || 0),
    minStock: Number(product.minStock || 0)
  });

  setError(null);
  setMessage('Produto carregado para edição.');

  setTimeout(() => {
    const formElement = document.querySelector('.product-form-card');

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
  

  const handleDelete = async (product) => {
    if (!window.confirm(`Deseja excluir o produto ${product.code} - ${product.description}?`)) {
      return;
    }
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      await deleteDoc(doc(db, 'products', product.id));
      setMessage('Produto excluído com sucesso.');
      if (editingId === product.id) resetForm();
    } catch (deleteError) {
      console.error('Erro ao excluir produto', deleteError);
      setError('Não foi possível excluir o produto. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const adjustStock = async (product, delta) => {
    setError(null);
    setMessage(null);
    const newStock = Number(product.stockQuantity || 0) + Number(delta);
    if (newStock < 0) {
      setError('Não é possível reduzir o estoque abaixo de zero.');
      return;
    }
    setSaving(true);

    try {
      await updateDoc(doc(db, 'products', product.id), { stockQuantity: newStock });
      setMessage('Estoque atualizado com sucesso.');
    } catch (updateError) {
      console.error('Erro ao ajustar estoque', updateError);
      setError('Não foi possível atualizar o estoque. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="page products-page">
      <div className="page-head">
        <div>
          <h2>Produtos</h2>
          <p>Cadastre produtos e controle o estoque em tempo real.</p>
        </div>
      </div>

      <div className="stats-grid">
        <article className="stat-card">
          <span>Total de produtos</span>
          <strong>{indicators.totalProducts}</strong>
        </article>
        <article className="stat-card">
          <span>Total de peças em estoque</span>
          <strong>{indicators.totalUnits}</strong>
        </article>
        <article className="stat-card">
          <span>Valor total do estoque</span>
          <strong>{formatCurrency(indicators.totalCost)}</strong>
        </article>
        <article className="stat-card">
          <span>Produtos com estoque baixo</span>
          <strong>{indicators.lowStockCount}</strong>
        </article>
      </div>

      <div className="product-grid">
        <div className="card form-card product-form-card">
          <h3>{editingId ? 'Editar produto' : 'Cadastrar produto'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <label>
                Código do produto
                <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required />
              </label>
              <label>
                Descrição
                <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
              </label>
              <label>
                Categoria
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {categoryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Tamanho
                <input value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} />
              </label>
              <label>
                Cor
                <input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
              </label>
              <label>
                Preço de custo
                <input type="number" step="0.01" value={form.costPrice} onChange={(e) => setForm({ ...form, costPrice: e.target.value })} />
              </label>
              <label>
                Preço de venda
                <input type="number" step="0.01" value={form.salePrice} onChange={(e) => setForm({ ...form, salePrice: e.target.value })} />
              </label>
              <label>
                Quantidade em estoque
                <input type="number" value={form.stockQuantity} onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })} />
              </label>
              <label>
                Estoque mínimo
                <input type="number" value={form.minStock} onChange={(e) => setForm({ ...form, minStock: e.target.value })} />
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" disabled={saving}>
                {saving ? 'Salvando...' : editingId ? 'Atualizar produto' : 'Cadastrar produto'}
              </button>
              {editingId ? (
                <button type="button" className="secondary" onClick={resetForm} disabled={saving}>
                  Cancelar
                </button>
              ) : null}
            </div>
          </form>
          {message ? <p className="success-message">{message}</p> : null}
          {error ? <p className="error-message">{error}</p> : null}
        </div>

        <div className="card products-list-card">
          <div className="list-header">
            <h3>Lista de produtos</h3>
            <input
              type="search"
              placeholder="Buscar por código, descrição, categoria, tamanho ou cor"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="empty-state">Carregando produtos...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="empty-state">Nenhum produto encontrado.</div>
          ) : (
            <div className="products-table">
              {filteredProducts.map((product) => {
                const lowStock = Number(product.stockQuantity || 0) <= Number(product.minStock || 0);
                return (
                  <article key={product.id} className={`product-row ${lowStock ? 'low-stock' : ''}`}>
                    <div className="product-details">
                      <strong>{product.code}</strong>
                      <span>{product.description}</span>
                      <span>{product.category} · {product.size || '-'} · {product.color || '-'}</span>
                    </div>
                    <div className="product-meta">
                      <span>{formatCurrency(product.costPrice)}</span>
                      <span>V: {formatCurrency(product.salePrice)}</span>
                      <span>Estoque: {product.stockQuantity}</span>
                      <span>Min: {product.minStock}</span>
                    </div>
                    <div className="product-actions">
                      <button onClick={() => handleEdit(product)}>Editar</button>
                      <button onClick={() => handleDelete(product)} className="secondary">
                        Excluir
                      </button>
                      <button onClick={() => adjustStock(product, 1)} className="small">
                        + Entrada
                      </button>
                      <button onClick={() => adjustStock(product, -1)} className="small secondary">
                        - Saída
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
