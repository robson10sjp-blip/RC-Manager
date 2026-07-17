import { useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, onSnapshot, query, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

export default function SalesPage() {
  const { user } = useAuth();
  const [sales, setSales] = useState([]);
  const [form, setForm] = useState({ client: '', value: 0 });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'users', user.uid, 'sales'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSales(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })));
    });
    return unsubscribe;
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) return;

    if (editingId) {
      await updateDoc(doc(db, 'users', user.uid, 'sales', editingId), form);
    } else {
      await addDoc(collection(db, 'users', user.uid, 'sales'), { ...form, createdAt: new Date() });
    }
    resetForm();
  }

  async function handleDelete(id) {
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.uid, 'sales', id));
  }

  function resetForm() {
    setForm({ client: '', value: 0 });
    setEditingId(null);
  }

  return (
    <section className="page">
      <h2>Vendas</h2>
      <form onSubmit={handleSubmit} className="form-card">
        <input placeholder="Cliente" value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} required />
        <input type="number" placeholder="Valor" value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} />
        <button type="submit">{editingId ? 'Atualizar' : 'Adicionar'}</button>
        {editingId ? <button type="button" onClick={resetForm}>Cancelar</button> : null}
      </form>
      <div className="list">
        {sales.map((sale) => (
          <article key={sale.id} className="card list-item">
            <div>
              <h3>{sale.client}</h3>
              <p>Valor: R$ {Number(sale.value || 0).toFixed(2)}</p>
            </div>
            <div className="actions">
              <button onClick={() => { setEditingId(sale.id); setForm({ client: sale.client, value: sale.value || 0 }); }}>Editar</button>
              <button onClick={() => handleDelete(sale.id)}>Excluir</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
