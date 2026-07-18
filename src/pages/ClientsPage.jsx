import { useEffect, useMemo, useState } from 'react';

import {

  addDoc,

  collection,

  deleteDoc,

  doc,

  onSnapshot,

  query,

  updateDoc,

} from 'firebase/firestore';

import { db } from '../firebase/config';

import { useAuth } from '../context/AuthContext';

const initialForm = {

  name: '',

  phone: '',

  city: '',

  address: '',

  email: '',

  status: 'ativo',

  totalPurchased: '',

  totalReceived: '',

  notes: '',

};

function formatCurrency(value) {

  return Number(value || 0).toLocaleString('pt-BR', {

    style: 'currency',

    currency: 'BRL',

  });

}

function normalizePhone(phone) {

  return String(phone || '').replace(/\D/g, '');

}

export default function ClientsPage() {

  const { user } = useAuth();

  const [clients, setClients] = useState([]);

  const [form, setForm] = useState(initialForm);

  const [editingId, setEditingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');

  const [cityFilter, setCityFilter] = useState('');

  const [statusFilter, setStatusFilter] = useState('');

  const [saving, setSaving] = useState(false);

  useEffect(() => {

    if (!user) return undefined;

    const clientsQuery = query(

      collection(db, 'users', user.uid, 'clients')

    );

    const unsubscribe = onSnapshot(

      clientsQuery,

      (snapshot) => {

        const data = snapshot.docs.map((docSnap) => ({

          id: docSnap.id,

          ...docSnap.data(),

        }));

        data.sort((a, b) =>

          String(a.name || '').localeCompare(String(b.name || ''), 'pt-BR')

        );

        setClients(data);

      },

      (error) => {

        console.error('Erro ao carregar clientes:', error);

      }

    );

    return unsubscribe;

  }, [user]);

  const cities = useMemo(() => {

    return [...new Set(

      clients

        .map((client) => client.city)

        .filter(Boolean)

        .map((city) => city.trim())

    )].sort((a, b) => a.localeCompare(b, 'pt-BR'));

  }, [clients]);

  const filteredClients = useMemo(() => {

    const search = searchTerm.trim().toLowerCase();

    return clients.filter((client) => {

      const matchesSearch =

        !search ||

        String(client.name || '').toLowerCase().includes(search) ||

        String(client.phone || '').toLowerCase().includes(search) ||

        String(client.city || '').toLowerCase().includes(search);

      const matchesCity =

        !cityFilter || client.city === cityFilter;

      const matchesStatus =

        !statusFilter || client.status === statusFilter;

      return matchesSearch && matchesCity && matchesStatus;

    });

  }, [clients, searchTerm, cityFilter, statusFilter]);

  const totals = useMemo(() => {

    return filteredClients.reduce(

      (acc, client) => {

        const purchased = Number(client.totalPurchased || 0);

        const received = Number(client.totalReceived || 0);

        acc.purchased += purchased;

        acc.received += received;

        acc.pending += Math.max(purchased - received, 0);

        return acc;

      },

      {

        purchased: 0,

        received: 0,

        pending: 0,

      }

    );

  }, [filteredClients]);

  function handleChange(event) {

    const { name, value } = event.target;

    setForm((current) => ({

      ...current,

      [name]: value,

    }));

  }

  async function handleSubmit(event) {

    event.preventDefault();

    if (!user || !form.name.trim()) return;

    setSaving(true);

    try {

      const payload = {

        name: form.name.trim(),

        phone: form.phone.trim(),

        city: form.city.trim(),

        address: form.address.trim(),

        email: form.email.trim(),

        status: form.status,

        totalPurchased: Number(form.totalPurchased || 0),

        totalReceived: Number(form.totalReceived || 0),

        notes: form.notes.trim(),

        updatedAt: new Date(),

      };

      if (editingId) {

        await updateDoc(

          doc(db, 'users', user.uid, 'clients', editingId),

          payload

        );

      } else {

        await addDoc(

          collection(db, 'users', user.uid, 'clients'),

          {

            ...payload,

            createdAt: new Date(),

          }

        );

      }

      resetForm();

    } catch (error) {

      console.error('Erro ao salvar cliente:', error);

      alert('Não foi possível salvar o cliente.');

    } finally {

      setSaving(false);

    }

  }

  async function handleDelete(client) {

    if (!user) return;

    const confirmed = window.confirm(

      `Deseja realmente excluir o cliente ${client.name}?`

    );

    if (!confirmed) return;

    try {

      await deleteDoc(

        doc(db, 'users', user.uid, 'clients', client.id)

      );

    } catch (error) {

      console.error('Erro ao excluir cliente:', error);

      alert('Não foi possível excluir o cliente.');

    }

  }

  function handleEdit(client) {

    setEditingId(client.id);

    setForm({

      name: client.name || '',

      phone: client.phone || '',

      city: client.city || '',

      address: client.address || '',

      email: client.email || '',

      status: client.status || 'ativo',

      totalPurchased: client.totalPurchased ?? '',

      totalReceived: client.totalReceived ?? '',

      notes: client.notes || '',

    });

    window.scrollTo({

      top: 0,

      behavior: 'smooth',

    });

  }

  function resetForm() {

    setForm(initialForm);

    setEditingId(null);

  }

  function openWhatsApp(client) {

    const phone = normalizePhone(client.phone);

    if (!phone) {

      alert('Este cliente não possui telefone cadastrado.');

      return;

    }

    const brazilPhone = phone.startsWith('55')

      ? phone

      : `55${phone}`;

    const message = encodeURIComponent(

      `Olá, ${client.name}! Aqui é da RC Confecções.`

    );

    window.open(

      `https://wa.me/${brazilPhone}?text=${message}`,

      '_blank',

      'noopener,noreferrer'

    );

  }

  return (

    <section className="page clients-page">

      <div className="page-header">

        <div>

          <span className="eyebrow">GESTÃO DE CLIENTES</span>

          <h2>Clientes</h2>

          <p>Cadastre, pesquise e acompanhe seus clientes.</p>

        </div>

        <div className="page-count">

          <strong>{filteredClients.length}</strong>

          <span>clientes</span>

        </div>

      </div>

      <div className="summary-grid">

        <article className="summary-card">

          <span>Total comprado</span>

          <strong>{formatCurrency(totals.purchased)}</strong>

        </article>

        <article className="summary-card">

          <span>Total recebido</span>

          <strong>{formatCurrency(totals.received)}</strong>

        </article>

        <article className="summary-card">

          <span>Falta receber</span>

          <strong>{formatCurrency(totals.pending)}</strong>

        </article>

      </div>

      <form onSubmit={handleSubmit} className="form-card client-form">

        <div className="form-title">

          <div>

            <h3>

              {editingId

                ? 'Editar cliente'

                : 'Cadastrar cliente'}

            </h3>

            <p>

              Preencha as principais informações do cliente.

            </p>

          </div>

          {editingId && (

            <span className="editing-badge">Editando</span>

          )}

        </div>

        <div className="form-grid">

          <label>

            Nome completo

            <input

              name="name"

              placeholder="Nome do cliente"

              value={form.name}

              onChange={handleChange}

              required

            />

          </label>

          <label>

            Telefone / WhatsApp

            <input

              name="phone"

              type="tel"

              placeholder="(00) 00000-0000"

              value={form.phone}

              onChange={handleChange}

            />

          </label>

          <label>

            Cidade

            <input

              name="city"

              placeholder="Cidade"

              value={form.city}

              onChange={handleChange}

            />

          </label>

          <label>

            Endereço

            <input

              name="address"

              placeholder="Rua, número ou referência"

              value={form.address}

              onChange={handleChange}

            />

          </label>

          <label>

            E-mail

            <input

              name="email"

              type="email"

              placeholder="cliente@email.com"

              value={form.email}

              onChange={handleChange}

            />

          </label>

          <label>

            Status

            <select

              name="status"

              value={form.status}

              onChange={handleChange}

            >

              <option value="ativo">Ativo</option>

              <option value="inativo">Inativo</option>

              <option value="bloqueado">Bloqueado</option>

            </select>

          </label>

          <label>

            Total comprado

            <input

              name="totalPurchased"

              type="number"

              min="0"

              step="0.01"

              placeholder="0,00"

              value={form.totalPurchased}

              onChange={handleChange}

            />

          </label>

          <label>

            Total recebido

            <input

              name="totalReceived"

              type="number"

              min="0"

              step="0.01"

              placeholder="0,00"

              value={form.totalReceived}

              onChange={handleChange}

            />

          </label>

          <label className="full-width">

            Observações

            <textarea

              name="notes"

              placeholder="Referências, preferências, informações de cobrança..."

              value={form.notes}

              onChange={handleChange}

              rows="3"

            />

          </label>

        </div>

        <div className="form-actions">

          <button type="submit" disabled={saving}>

            {saving

              ? 'Salvando...'

              : editingId

                ? 'Salvar alterações'

                : 'Adicionar cliente'}

          </button>

          {editingId && (

            <button

              type="button"

              className="button-secondary"

              onClick={resetForm}

            >

              Cancelar

            </button>

          )}

        </div>

      </form>

      <div className="filters-card">

        <input

          placeholder="Pesquisar por nome, telefone ou cidade"

          value={searchTerm}

          onChange={(event) =>

            setSearchTerm(event.target.value)

          }

        />

        <select

          value={cityFilter}

          onChange={(event) =>

            setCityFilter(event.target.value)

          }

        >

          <option value="">Todas as cidades</option>

          {cities.map((city) => (

            <option key={city} value={city}>

              {city}

            </option>

          ))}

        </select>

        <select

          value={statusFilter}

          onChange={(event) =>

            setStatusFilter(event.target.value)

          }

        >

          <option value="">Todos os status</option>

          <option value="ativo">Ativos</option>

          <option value="inativo">Inativos</option>

          <option value="bloqueado">Bloqueados</option>

        </select>

      </div>

      <div className="list clients-list">

        {filteredClients.length === 0 ? (

          <article className="card empty-state">

            <h3>Nenhum cliente encontrado</h3>

            <p>

              Cadastre um novo cliente ou altere os filtros.

            </p>

          </article>

        ) : (

          filteredClients.map((client) => {

            const purchased = Number(

              client.totalPurchased || 0

            );

            const received = Number(

              client.totalReceived || 0

            );

            const pending = Math.max(

              purchased - received,

              0

            );

            return (

              <article

                key={client.id}

                className="card client-card"

              >

                <div className="client-main">

                  <div className="client-avatar">

                    {String(client.name || '?')

                      .charAt(0)

                      .toUpperCase()}

                  </div>

                  <div>

                    <div className="client-name-row">

                      <h3>{client.name}</h3>

                      <span

                        className={`status-badge status-${

                          client.status || 'ativo'

                        }`}

                      >

                        {client.status || 'ativo'}

                      </span>

                    </div>

                    <p>

                      {client.city || 'Cidade não informada'}

                    </p>

                    {client.phone && (

                      <p>{client.phone}</p>

                    )}

                    {client.address && (

                      <p>{client.address}</p>

                    )}

                    {client.notes && (

                      <p className="client-notes">

                        {client.notes}

                      </p>

                    )}

                  </div>

                </div>

                <div className="client-values">

                  <div>

                    <span>Comprado</span>

                    <strong>

                      {formatCurrency(purchased)}

                    </strong>

                  </div>

                  <div>

                    <span>Recebido</span>

                    <strong>

                      {formatCurrency(received)}

                    </strong>

                  </div>

                  <div>

                    <span>Em aberto</span>

                    <strong>

                      {formatCurrency(pending)}

                    </strong>

                  </div>

                </div>

                <div className="actions">

                  <button

                    type="button"

                    onClick={() => openWhatsApp(client)}

                  >

                    WhatsApp

                  </button>

                  <button

                    type="button"

                    onClick={() => handleEdit(client)}

                  >

                    Editar

                  </button>

                  <button

                    type="button"

                    className="button-danger"

                    onClick={() => handleDelete(client)}

                  >

                    Excluir

                  </button>

                </div>

              </article>

            );

          })

        )}

      </div>

    </section>

  );

}

