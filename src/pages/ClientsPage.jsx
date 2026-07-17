import { useEffect, useState } from 'react';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

export default function ClientsPage() {
  const { user } = useAuth();
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'users', user.uid, 'clients'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setClients(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })));
    });
    return unsubscribe;
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) return;

    if (editingId) {
      await updateDoc(doc(db, 'users', user.uid, 'clients', editingId), form);
    } else {
      await addDoc(collection(db, 'users', user.uid, 'clients'), { ...form, createdAt: new Date() });
    }
    resetForm();
  }

  async function handleDelete(id) {
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.uid, 'clients', id));
  }

  function resetForm() {
    setForm({ name: '', email: '', phone: '' });
    setEditingId(null);
  }

  return (
    <section className="page">
      <h2>Clientes</h2>
      <form onSubmit={handleSubmit} className="form-card">
        <input placeholder="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="E-mail" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Telefone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <button type="submit">{editingId ? 'Atualizar' : 'Adicionar'}</button>
        {editingId ? <button type="button" onClick={resetForm}>Cancelar</button> : null}
      </form>
      <div className="list">
        {clients.map((client) => (
          <article key={client.id} className="card list-item">
            <div>
              <h3>{client.name}</h3>
              <p>{client.email}</p>
              <p>{client.phone}</p>
            </div>
            <div className="actions">
              <button onClick={() => { setEditingId(client.id); setForm({ name: client.name, email: client.email || '', phone: client.phone || '' }); }}>Editar</button>
              <button onClick={() => handleDelete(client.id)}>Excluir</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
