import { useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, onSnapshot, query, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

export default function StockPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', quantity: 0, price: 0 });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'users', user.uid, 'stock'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })));
    });
    return unsubscribe;
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) return;

    if (editingId) {
      await updateDoc(doc(db, 'users', user.uid, 'stock', editingId), form);
    } else {
      await addDoc(collection(db, 'users', user.uid, 'stock'), { ...form, createdAt: new Date() });
    }
    resetForm();
  }

  async function handleDelete(id) {
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.uid, 'stock', id));
  }

  function resetForm() {
    setForm({ name: '', quantity: 0, price: 0 });
    setEditingId(null);
  }

  return (
    <section className="page">
      <h2>Estoques</h2>
      <form onSubmit={handleSubmit} className="form-card">
        <input placeholder="Nome do item" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input type="number" placeholder="Quantidade" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} />
        <input type="number" placeholder="Preço" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
        <button type="submit">{editingId ? 'Atualizar' : 'Adicionar'}</button>
        {editingId ? <button type="button" onClick={resetForm}>Cancelar</button> : null}
      </form>
      <div className="list">
        {items.map((item) => (
          <article key={item.id} className="card list-item">
            <div>
              <h3>{item.name}</h3>
              <p>Quantidade: {item.quantity}</p>
              <p>Preço: R$ {Number(item.price || 0).toFixed(2)}</p>
            </div>
            <div className="actions">
              <button onClick={() => { setEditingId(item.id); setForm({ name: item.name, quantity: item.quantity || 0, price: item.price || 0 }); }}>Editar</button>
              <button onClick={() => handleDelete(item.id)}>Excluir</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
