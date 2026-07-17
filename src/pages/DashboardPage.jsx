export default function DashboardPage() {
  return (
    <section className="page">
      <h2>Dashboard</h2>
      <div className="grid">
        <article className="card">
          <h3>Clientes</h3>
          <p>Gerencie clientes, contatos e histórico.</p>
        </article>
        <article className="card">
          <h3>Estoque</h3>
          <p>Controle peças, categorias e níveis mínimos.</p>
        </article>
        <article className="card">
          <h3>Vendas</h3>
          <p>Organize pedidos e acompanhe o fluxo comercial.</p>
        </article>
        <article className="card">
          <h3>Recebimentos</h3>
          <p>Monitore entradas e pagamentos recebidos.</p>
        </article>
      </div>
    </section>
  );
}
