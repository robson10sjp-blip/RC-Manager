import { useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, onSnapshot, query, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

export default function ReceiptsPage() {
  const { user } = useAuth();
  const [receipts, setReceipts] = useState([]);
  const [form, setForm] = useState({ description: '', value: 0 });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'users', user.uid, 'receipts'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setReceipts(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })));
    });
    return unsubscribe;
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) return;

    if (editingId) {
      await updateDoc(doc(db, 'users', user.uid, 'receipts', editingId), form);
    } else {
      await addDoc(collection(db, 'users', user.uid, 'receipts'), { ...form, createdAt: new Date() });
    }
    resetForm();
  }

  async function handleDelete(id) {
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.uid, 'receipts', id));
  }

  function resetForm() {
    setForm({ description: '', value: 0 });
    setEditingId(null);
  }

  return (
    <section className="page">
      <h2>Recebimentos</h2>
      <form onSubmit={handleSubmit} className="form-card">
        <input placeholder="Descrição" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        <input type="number" placeholder="Valor" value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} />
        <button type="submit">{editingId ? 'Atualizar' : 'Adicionar'}</button>
        {editingId ? <button type="button" onClick={resetForm}>Cancelar</button> : null}
      </form>
      <div className="list">
        {receipts.map((receipt) => (
          <article key={receipt.id} className="card list-item">
            <div>
              <h3>{receipt.description}</h3>
              <p>Valor: R$ {Number(receipt.value || 0).toFixed(2)}</p>
            </div>
            <div className="actions">
              <button onClick={() => { setEditingId(receipt.id); setForm({ description: receipt.description, value: receipt.value || 0 }); }}>Editar</button>
              <button onClick={() => handleDelete(receipt.id)}>Excluir</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
