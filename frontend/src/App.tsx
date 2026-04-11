import { useState, useEffect } from 'react';
import { productApi } from './services/api';
import type { Produto, ProductAnalytics, GlobalStats, Consumidor, DashboardStats } from './types';
import {
  Search, ShoppingBag, Star, Edit, X, Save, Plus,
  Trash2, TrendingUp, BarChart3, Users, Package, Zap, ChevronRight,
  ChevronLeft, LayoutDashboard, MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, Tooltip, ResponsiveContainer, Cell, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';

type View = 'estoque' | 'clientes' | 'dashboard';

function App() {
  const [currentView, setCurrentView] = useState<View>('estoque');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Estoque States
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null);

  // Clientes States
  const [clientes, setClientes] = useState<Consumidor[]>([]);
  const [clientPage, setClientPage] = useState(0);
  const [totalClientPages, setTotalClientPages] = useState(0);

  // Dashboard States
  const [dashSummary, setDashSummary] = useState<DashboardStats | null>(null);

  // Modal / Shared States
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null);
  const [analytics, setAnalytics] = useState<ProductAnalytics | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Produto>>({});

  const PAGE_SIZE = 20;

  useEffect(() => {
    if (currentView === 'estoque') {
      loadProducts();
      loadGlobalStats();
      loadCategories();
    } else if (currentView === 'clientes') {
      loadClientes();
    } else if (currentView === 'dashboard') {
      loadDashboard();
    }
  }, [currentView, search, page, clientPage, selectedCategory]);

  useEffect(() => {
    if (selectedProduct || isCreating) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [selectedProduct, isCreating]);

  const loadProducts = async () => {
    try {
      const data = await productApi.list(search, page * PAGE_SIZE, selectedCategory);
      setProdutos(data.items);
      setTotalPages(data.pages);
    } catch (error) {
      console.error(error);
    }
  };

  const loadClientes = async () => {
    try {
      const data = await productApi.listClientes(search, clientPage * PAGE_SIZE);
      setClientes(data.items);
      setTotalClientPages(data.pages);
    } catch (error) {
      console.error(error);
    }
  };

  const loadDashboard = async () => {
    try {
      const data = await productApi.getDashboardSummary();
      setDashSummary(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadGlobalStats = async () => {
    try {
      const data = await productApi.getGlobalStats();
      setGlobalStats(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await productApi.getCategories();
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleProductClick = async (product: Produto) => {
    setSelectedProduct(product);
    setAnalytics(null);
    try {
      const data = await productApi.getAnalytics(product.id_produto);
      setAnalytics(data);
    } catch (error) {
      console.error(error);
    }
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
      loadGlobalStats();
    } catch (error) {
      alert('Erro ao salvar.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este produto?')) return;
    try {
      await productApi.delete(id);
      setSelectedProduct(null);
      loadProducts();
      loadGlobalStats();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 font-sans text-slate-200 overflow-hidden selection:bg-indigo-500/30">
      {/* SIDEBAR */}
      <motion.aside
        animate={{ width: isSidebarCollapsed ? 84 : 280 }}
        className="bg-slate-900/40 border-r border-white/5 flex flex-col relative shrink-0 z-50 backdrop-blur-xl transition-all duration-300"
      >
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-xl z-50 hover:bg-indigo-500 transition-colors"
        >
          {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-10 overflow-hidden">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl shrink-0 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Zap size={22} className="text-white" fill="currentColor" />
            </div>
            {!isSidebarCollapsed && (
              <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xl font-black tracking-tighter text-white whitespace-nowrap">
                RocketStore
              </motion.h1>
            )}
          </div>

          <nav className="space-y-1.5 font-medium">
            {[
              { id: 'estoque', label: 'Estoque', icon: ShoppingBag },
              { id: 'clientes', label: 'Clientes', icon: Users },
              { id: 'dashboard', label: 'Analytics', icon: LayoutDashboard },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as View)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm transition-all ${currentView === item.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-white/5'}`}
              >
                <item.icon size={18} className="shrink-0" />
                {!isSidebarCollapsed && <span>{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>

        {currentView === 'estoque' && (
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 mx-2 mb-4 scrollbar-hide bg-slate-950/20 rounded-[2rem] border border-white/5">
            <button
              onClick={() => { setSelectedCategory(''); setPage(0); }}
              className={`w-full flex items-center px-4 py-2.5 rounded-xl text-[10px] uppercase font-bold tracking-tight transition-all ${selectedCategory === '' ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {!isSidebarCollapsed ? 'Todas Categorias' : '📌'}
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); setPage(0); }}
                className={`w-full text-left px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-tight transition-all truncate ${selectedCategory === cat ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {!isSidebarCollapsed ? cat.replace(/_/g, ' ') : cat.substr(0, 2)}
              </button>
            ))}
          </div>
        )}
      </motion.aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-indigo-500/5 blur-[120px] rounded-full -z-10 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-purple-500/5 blur-[100px] rounded-full -z-10" />

        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-slate-950/40 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-6">
            <h2 className="text-xl font-black text-white capitalize">{currentView}</h2>
            <div className="h-6 w-px bg-white/10" />

            <AnimatePresence>
              {currentView !== 'dashboard' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="relative w-80 group"
                >
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={16} />
                  <input
                    placeholder="Buscar em tempo real..."
                    className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-2 pl-11 pr-4 text-xs font-medium focus:border-indigo-500/50 outline-none transition-all"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(0); setClientPage(0); }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-4">
            {currentView === 'estoque' && (
              <button
                onClick={() => { setIsCreating(true); setEditForm({ id_produto: Math.random().toString(36).substr(2, 9), nome_produto: '', categoria_produto: '', peso_produto_gramas: 0 }); }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-6 rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-95 transition-all"
              >
                <Plus size={16} /> Novo Registro
              </button>
            )}
            <div className="flex items-center gap-3 bg-white/5 pl-4 pr-1 py-1 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
              <div className="text-right">
                <p className="text-[10px] font-black text-white">Administrador</p>
                <p className="text-[8px] font-bold text-slate-500 group-hover:text-indigo-400 transition-colors">rocket_manager@store.com</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-600 border border-white/10 flex items-center justify-center overflow-hidden shadow-lg shadow-indigo-600/20">
                <img src="https://api.dicebear.com/7.x/shapes/svg?seed=Rocket" alt="Avatar" />
              </div>
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-10 custom-scrollbar scrollbar-hide">
          {currentView === 'estoque' && (
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { l: 'Faturamento', v: `R$ ${globalStats?.total_receita.toLocaleString()}`, i: TrendingUp, c: 'text-indigo-400', b: 'bg-indigo-500/10' },
                  { l: 'Volume Vendas', v: globalStats?.total_vendas, i: ShoppingBag, c: 'text-emerald-400', b: 'bg-emerald-500/10' },
                  { l: 'Ticket Médio', v: `R$ ${globalStats?.ticket_medio.toFixed(2)}`, i: BarChart3, c: 'text-amber-400', b: 'bg-amber-500/10' },
                  { l: 'Produtos Únicos', v: globalStats?.total_produtos, i: Package, c: 'text-purple-400', b: 'bg-purple-500/10' },
                ].map((s, i) => (
                  <div key={i} className="bg-slate-900/40 p-5 rounded-3xl border border-white/5 flex items-center gap-4">
                    <div className={`${s.b} ${s.c} p-3 rounded-2xl`}><s.i size={20} /></div>
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.l}</p>
                      <h3 className="text-lg font-black text-white">{s.v}</h3>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-6">
                {produtos.map((p, idx) => (
                  <motion.div
                    key={p.id_produto}
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (idx % 20) * 0.02 }}
                    onClick={() => handleProductClick(p)}
                    className="group bg-slate-900/20 border border-white/5 rounded-[2rem] p-4 hover:border-indigo-500/40 hover:bg-slate-900/40 transition-all cursor-pointer box-border"
                  >
                    <div className="aspect-square rounded-2xl overflow-hidden bg-slate-950 mb-4 border border-white/5">
                      <img src={p.url_imagem} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={p.nome_produto} />
                    </div>
                    <span className="text-[9px] font-black text-indigo-400 uppercase tracking-wider mb-2 block truncate">
                      {p.categoria_produto.replace(/_/g, ' ')}
                    </span>
                    <h3 className="text-xs font-bold line-clamp-2 h-8 leading-tight group-hover:text-white transition-colors">{p.nome_produto}</h3>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                      <span>#{p.id_produto.substr(0, 6)}</span>
                      <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-lg group-hover:bg-indigo-500 group-hover:text-white transition-colors">{p.peso_produto_gramas}g</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-between items-center bg-slate-900/40 border border-white/5 p-4 rounded-3xl">
                  <button onClick={() => setPage(page - 1)} disabled={page === 0} className="px-6 py-2.5 rounded-2xl bg-white/5 text-xs font-black disabled:opacity-20 hover:bg-white/10 transition-all">ANTERIOR</button>
                  <div className="flex gap-2 text-xs font-black">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pNum = totalPages > 5 ? (page > 2 ? Math.min(page - 2 + i, totalPages - 5 + i) : i) : i;
                      return (
                        <button key={pNum} onClick={() => setPage(pNum)} className={`w-10 h-10 rounded-xl transition-all ${pNum === page ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}>{pNum + 1}</button>
                      );
                    })}
                  </div>
                  <button onClick={() => setPage(page + 1)} disabled={page >= totalPages - 1} className="px-6 py-2.5 rounded-2xl bg-indigo-600 text-xs font-black hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 disabled:opacity-20 transition-all">PRÓXIMA</button>
                </div>
              )}
            </div>
          )}

          {currentView === 'clientes' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <h3 className="text-2xl font-black">Base de Consumidores</h3>
                  <p className="text-xs text-slate-500">Gestão integrada de perfis e localização</p>
                </div>
              </div>

              <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden">
                <table className="w-full text-left text-sm border-separate border-spacing-0">
                  <thead className="bg-white/5 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    <tr>
                      <th className="p-6">ID</th>
                      <th className="p-6 border-l border-white/5">Nome Completo</th>
                      <th className="p-6 border-l border-white/5">Localização</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {clientes.map((c) => (
                      <tr key={c.id_consumidor} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="p-6 font-mono text-xs text-slate-500">#{c.id_consumidor.substr(0, 12)}...</td>
                        <td className="p-6 font-bold">{c.nome_consumidor}</td>
                        <td className="p-6">
                          <div className="flex items-center gap-2 text-slate-400">
                            <MapPin size={14} className="text-rose-500/50" />
                            <span className="text-xs">{c.cidade}, {c.estado}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalClientPages > 1 && (
                <div className="flex justify-center gap-4 mt-8">
                  <button onClick={() => setClientPage(clientPage - 1)} disabled={clientPage === 0} className="p-3 rounded-2xl bg-white/5 disabled:opacity-20"><ChevronLeft /></button>
                  <span className="flex items-center font-bold text-sm">Pág {clientPage + 1} de {totalClientPages}</span>
                  <button onClick={() => setClientPage(clientPage + 1)} disabled={clientPage >= totalClientPages - 1} className="p-3 rounded-2xl bg-white/5 disabled:opacity-20"><ChevronRight /></button>
                </div>
              )}
            </div>
          )}

          {currentView === 'dashboard' && dashSummary && (
            <div className="space-y-8 animate-in zoom-in-95 duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-slate-900/40 p-8 rounded-[3rem] border border-white/5">
                  <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest mb-10">Desempenho de Vendas (Histórico)</h3>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={dashSummary.revenue_history}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '16px', color: '#fff' }} />
                        <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={4} dot={{ r: 6, fill: '#6366f1' }} activeDot={{ r: 10 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-slate-900/40 p-8 rounded-[3rem] border border-white/5 flex flex-col items-center">
                  <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest mb-10 self-start text-center w-full">Distribuição de Status</h3>
                  <div className="h-[300px] w-full flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={Object.entries(dashSummary.status_distribution).map(([k, v]) => ({ name: k, count: v }))}>
                        <XAxis dataKey="name" stroke="#64748b" fontSize={10} angle={-45} textAnchor="end" height={60} />
                        <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '12px' }} />
                        <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                          {Object.entries(dashSummary.status_distribution).map((_, i) => <Cell key={i} fill={['#6366f1', '#a855f7', '#ec4899', '#f59e0b'][i % 4]} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* DETAIL MODAL (Estoque) / CREATE / EDIT */}
      <AnimatePresence>
        {(selectedProduct || isCreating) && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={() => { setSelectedProduct(null); setAnalytics(null); setIsEditing(false); setIsCreating(false); }} />
            <motion.div initial={{ scale: 0.9, y: 50, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 50, opacity: 0 }} className="relative w-full max-w-5xl max-h-[90vh] bg-slate-900 rounded-[3.5rem] border border-white/10 overflow-hidden shadow-2xl">
              <div className="p-12 overflow-y-auto custom-scrollbar h-full scrollbar-hide">
                {(isEditing || isCreating) ? (
                  <div className="space-y-10">
                    <div className="flex justify-between items-center">
                      <h2 className="text-3xl font-black tracking-tighter">{isCreating ? 'Cadastrar Novo Item' : 'Editar Produto'}</h2>
                      <button onClick={() => { setIsEditing(false); setIsCreating(false); if (!selectedProduct) setSelectedProduct(null); }} className="p-4 bg-white/5 rounded-full hover:bg-white/10 transition-all"><X size={24} /></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-950/30 p-10 rounded-[2.5rem] border border-white/5">
                      <div className="md:col-span-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Nome Comercial</label>
                        <input value={editForm.nome_produto} onChange={e => setEditForm({ ...editForm, nome_produto: e.target.value })} className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-indigo-500 outline-none" />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Categoria</label>
                        <input value={editForm.categoria_produto} onChange={e => setEditForm({ ...editForm, categoria_produto: e.target.value })} className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-indigo-500 outline-none" />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Peso (g)</label>
                        <input type="number" value={editForm.peso_produto_gramas} onChange={e => setEditForm({ ...editForm, peso_produto_gramas: Number(e.target.value) })} className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-indigo-500 outline-none" />
                      </div>
                      <button onClick={handleSave} className="md:col-span-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-[1.5rem] mt-4 flex items-center justify-center gap-2 shadow-2xl shadow-indigo-600/30 active:scale-95 transition-all">
                        <Save size={20} /> Salvar Registro
                      </button>
                    </div>
                  </div>
                ) : selectedProduct && (
                  <div className="flex flex-col lg:flex-row gap-12">
                    <div className="w-full lg:w-96 shrink-0 space-y-8">
                      <div className="aspect-square rounded-[3rem] overflow-hidden bg-slate-950 border border-white/10 shadow-2xl">
                        <img src={selectedProduct.url_imagem} className="w-full h-full object-cover" />
                      </div>
                      {analytics && (
                        <div className="p-8 bg-indigo-600/10 rounded-[2.5rem] border border-indigo-500/20">
                          <div className="flex items-center gap-2 text-indigo-400 mb-3"><Zap size={20} fill="currentColor" /><span className="text-xs font-black uppercase tracking-widest">Rocket Insight</span></div>
                          <p className="text-sm font-medium leading-relaxed italic text-indigo-100">“{analytics.performance.total_vendas > 10 ? 'Produto premium com alta taxa de recompra. Ideal para campanhas de fidelidade.' : 'Volume de vendas estável. Recomendamos otimização de SEO para aumentar alcance.'}”</p>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-10">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-4xl font-black text-white leading-tight mb-2">{selectedProduct.nome_produto}</h2>
                          <div className="flex gap-2">
                            <span className="bg-indigo-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{selectedProduct.categoria_produto.replace(/_/g, ' ')}</span>
                            <span className="bg-slate-800 px-4 py-1 rounded-full text-[10px] font-mono text-slate-400 tracking-tighter uppercase">ID #{selectedProduct.id_produto}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => { setIsEditing(true); setEditForm(selectedProduct); }} className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 transition-all"><Edit size={20} /></button>
                          <button onClick={() => handleDelete(selectedProduct.id_produto)} className="w-12 h-12 flex items-center justify-center border border-rose-500/20 hover:bg-rose-500/10 rounded-2xl text-rose-500 transition-all"><Trash2 size={20} /></button>
                          <button onClick={() => { setSelectedProduct(null); setAnalytics(null); }} className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full transition-all text-slate-500"><X size={24} /></button>
                        </div>
                      </div>

                      {analytics && (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                          {[
                            { l: 'Pedidos', v: analytics.performance.total_vendas, i: ShoppingBag, c: 'text-indigo-400' },
                            { l: 'Receita', v: `R$ ${Math.round(analytics.performance.receita_total).toLocaleString()}`, i: TrendingUp, c: 'text-emerald-400' },
                            { l: 'Ranking', v: analytics.performance.avaliacao_media.toFixed(1), i: Star, c: 'text-amber-400' },
                            { l: 'Logística', v: `${selectedProduct.peso_produto_gramas}g`, i: Package, c: 'text-purple-400' },
                          ].map((s, i) => (
                            <div key={i} className="bg-slate-950/50 p-6 rounded-3xl border border-white/5 text-center">
                              <s.i size={20} className={`mx-auto mb-3 ${s.c}`} />
                              <p className="text-[10px] font-black text-slate-600 uppercase mb-1">{s.l}</p>
                              <h4 className="text-lg font-black text-white">{s.v}</h4>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="h-48 bg-slate-950/20 rounded-[2.5rem] border border-white/5 p-8">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={analytics?.performance ? [
                            { n: 'Conversão', v: analytics.performance.total_vendas * 2 },
                            { n: 'VGM', v: analytics.performance.receita_total / 100 },
                            { n: 'Retenção', v: analytics.performance.avaliacao_media * 20 }
                          ] : []}>
                            <Tooltip contentStyle={{ background: '#020617', border: 'none', borderRadius: '16px' }} />
                            <Bar dataKey="v" radius={[8, 8, 0, 0]} barSize={50}>
                              {[0, 1, 2].map((_, i) => <Cell key={i} fill={['#6366f1', '#a855f7', '#fbbf24'][i]} />)}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
