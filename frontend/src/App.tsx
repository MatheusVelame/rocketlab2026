import { useState, useEffect } from 'react';
import { productApi } from './services/api';
import type { Produto, ProductAnalytics } from './types';
import { Search, ShoppingBag, Star, Edit, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null);
  const [analytics, setAnalytics] = useState<ProductAnalytics | null>(null);
  const [isEditing, setIsEditing] = useState(false);
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

  const handleSave = async () => {
    if (!selectedProduct) return;
    try {
      const updated = await productApi.update(selectedProduct.id_produto, editForm);
      setSelectedProduct(updated);
      setIsEditing(false);
      loadProducts();
    } catch (error) {
      console.error('Erro ao salvar', error);
    }
  };

  return (
    <div className="app-container">
      <header>
        <div>
          <h1>RocketStore Manager</h1>
          <p style={{ color: 'var(--text-muted)' }}>Painel do Gerente</p>
        </div>
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
        {selectedProduct && (
          <div className="modal-overlay" onClick={() => { setSelectedProduct(null); setAnalytics(null); setIsEditing(false); }}>
            <motion.div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '2rem' }}>
                <div>
                  <h2 style={{ margin: 0 }}>{selectedProduct.nome_produto}</h2>
                  <p style={{ color: 'var(--text-muted)' }}>{selectedProduct.categoria_produto}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {!isEditing ? (
                    <button onClick={handleEdit} style={{ background: 'var(--bg-app)', border: '1px solid var(--border)' }}>
                      <Edit size={18} />
                    </button>
                  ) : (
                    <button onClick={handleSave} style={{ background: 'var(--success)' }}>
                      <Save size={18} />
                    </button>
                  )}
                  <button onClick={() => { setSelectedProduct(null); setAnalytics(null); setIsEditing(false); }} style={{ background: 'transparent' }}>
                    <X size={24} />
                  </button>
                </div>
              </div>

              {isEditing ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
                </div>
              ) : (
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
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
