import { useState, useEffect } from 'react';
import { productApi } from './services/api';
import type { Produto, ProductAnalytics } from './types';
import { Search, ShoppingBag, Star, Edit, X, Save, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null);
  const [analytics, setAnalytics] = useState<ProductAnalytics | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Produto>>({});

  useEffect(() => {
    loadProducts();
  }, [search]);

  const loadProducts = async () => {
    try {
      const data = await productApi.list(search);
      setProdutos(data);
    } catch (error) {
      console.error('Erro ao carregar produtos', error);
    }
  };

  const handleProductClick = async (product: Produto) => {
    setSelectedProduct(product);
    try {
      const data = await productApi.getAnalytics(product.id_produto);
      setAnalytics(data);
    } catch (error) {
      console.error('Erro ao carregar analytics', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm(selectedProduct || {});
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setEditForm({
      id_produto: Math.random().toString(36).substring(2, 11),
      nome_produto: '',
      categoria_produto: '',
      peso_produto_gramas: 0,
    });
  };

  const handleSave = async () => {
    try {
      if (isCreating) {
        await productApi.create(editForm as Produto);
        setIsCreating(false);
      } else if (selectedProduct) {
        const updated = await productApi.update(selectedProduct.id_produto, editForm);
        setSelectedProduct(updated);
        setIsEditing(false);
      }
      loadProducts();
    } catch (error) {
      console.error('Erro ao salvar', error);
      alert('Erro ao salvar produto. Verifique se o ID já existe.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    try {
      await productApi.delete(id);
      setSelectedProduct(null);
      loadProducts();
    } catch (error) {
      console.error('Erro ao excluir', error);
    }
  };

  return (
    <div className="app-container">
      <header>
        <div>
          <h1>RocketStore Manager</h1>
          <p style={{ color: 'var(--text-muted)' }}>Painel do Gerente</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} size={20} />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '40px', marginBottom: 0 }}
            />
          </div>
          <button onClick={handleCreateNew} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={20} /> Novo Produto
          </button>
        </div>
      </header>

      <div className="grid">
        {produtos.map((p) => (
          <motion.div
            key={p.id_produto}
            className="card"
            layoutId={p.id_produto}
            onClick={() => handleProductClick(p)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
              <span className="badge">{p.categoria_produto}</span>
              <ShoppingBag size={20} color="var(--primary)" />
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>{p.nome_produto}</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: {p.id_produto}</p>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {(selectedProduct || isCreating) && (
          <div className="modal-overlay" onClick={() => { setSelectedProduct(null); setAnalytics(null); setIsEditing(false); setIsCreating(false); }}>
            <motion.div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '2rem' }}>
                <div>
                  <h2 style={{ margin: 0 }}>{isCreating ? 'Novo Produto' : selectedProduct?.nome_produto}</h2>
                  <p style={{ color: 'var(--text-muted)' }}>{isCreating ? 'Cadastre as informações' : selectedProduct?.categoria_produto}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {!isCreating && !isEditing && (
                    <>
                      <button onClick={handleEdit} style={{ background: 'var(--bg-app)', border: '1px solid var(--border)' }}>
                        <Edit size={18} />
                      </button>
                      <button onClick={() => selectedProduct && handleDelete(selectedProduct.id_produto)} style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444' }}>
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                  {(isEditing || isCreating) && (
                    <button onClick={handleSave} style={{ background: 'var(--success)' }}>
                      <Save size={18} />
                    </button>
                  )}
                  <button onClick={() => { setSelectedProduct(null); setAnalytics(null); setIsEditing(false); setIsCreating(false); }} style={{ background: 'transparent' }}>
                    <X size={24} />
                  </button>
                </div>
              </div>

              {(isEditing || isCreating) ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {isCreating && (
                    <div style={{ gridColumn: 'span 2' }}>
                      <label>ID do Produto (Único)</label>
                      <input
                        value={editForm.id_produto || ''}
                        onChange={(e) => setEditForm({ ...editForm, id_produto: e.target.value })}
                      />
                    </div>
                  )}
                  <div>
                    <label>Nome do Produto</label>
                    <input
                      value={editForm.nome_produto || ''}
                      onChange={(e) => setEditForm({ ...editForm, nome_produto: e.target.value })}
                    />
                  </div>
                  <div>
                    <label>Categoria</label>
                    <input
                      value={editForm.categoria_produto || ''}
                      onChange={(e) => setEditForm({ ...editForm, categoria_produto: e.target.value })}
                    />
                  </div>
                  <div>
                    <label>Peso (g)</label>
                    <input
                      type="number"
                      value={editForm.peso_produto_gramas || 0}
                      onChange={(e) => setEditForm({ ...editForm, peso_produto_gramas: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
              ) : (
                selectedProduct && (
                  <>
                    {analytics && (
                      <div className="stats-grid">
                        <div className="stat-box">
                          <div className="stat-label">Vendas Totais</div>
                          <div className="stat-value">{analytics.performance.total_vendas}</div>
                        </div>
                        <div className="stat-box">
                          <div className="stat-label">Receita</div>
                          <div className="stat-value">R$ {analytics.performance.receita_total.toLocaleString()}</div>
                        </div>
                        <div className="stat-box">
                          <div className="stat-label">Avaliação Média</div>
                          <div className="stat-value" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                            {analytics.performance.avaliacao_media.toFixed(1)} <Star size={18} fill="var(--accent)" />
                          </div>
                        </div>
                        <div className="stat-box">
                          <div className="stat-label">Total Avaliações</div>
                          <div className="stat-value">{analytics.performance.total_avaliacoes}</div>
                        </div>
                      </div>
                    )}

                    <div style={{ marginTop: '2rem' }}>
                      <h3>Informações Técnicas</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                        <p><strong>Peso:</strong> {selectedProduct.peso_produto_gramas}g</p>
                        <p><strong>Alt:</strong> {selectedProduct.altura_centimetros}cm</p>
                        <p><strong>Larg:</strong> {selectedProduct.largura_centimetros}cm</p>
                        <p><strong>Comp:</strong> {selectedProduct.comprimento_centimetros}cm</p>
                      </div>
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                      <h3>Últimas Avaliações</h3>
                      {analytics.ultimas_avaliacoes.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          {analytics.ultimas_avaliacoes.map((rev, idx) => (
                            <div key={idx} style={{ background: '#0f172a', padding: '1rem', borderRadius: '0.75rem' }}>
                              <div style={{ display: 'flex', gap: '4px', marginBottom: '0.5rem' }}>
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} size={14} fill={i < rev.avaliacao ? 'var(--accent)' : 'none'} color={i < rev.avaliacao ? 'var(--accent)' : 'var(--text-muted)'} />
                                ))}
                              </div>
                              <p style={{ margin: 0, fontSize: '0.9rem' }}>{rev.comentario || 'Sem comentário'}</p>
                              {rev.data_comentario && (
                                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                  {new Date(rev.data_comentario).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ color: 'var(--text-muted)' }}>Nenhuma avaliação encontrada.</p>
                      )}
                    </div>
                  </>
                )
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
