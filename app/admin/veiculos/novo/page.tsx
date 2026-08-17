'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Plus, ImageIcon, Trash2, Bike, Ruler, DollarSign, ShoppingCart, CheckCircle2, Lock, UploadCloud, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { saveVehicleToDatabase, getVehicleById } from '@/lib/db-service';

type Status = 'disponivel' | 'reservado' | 'vendido';

export default function VehicleFormPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    ano: new Date().getFullYear(),
    cor: '',
    precoCusto: 0,      // 🔒 Interno - nunca exibido ao cliente
    preco: 0,           // ✅ Valor de venda público
    descricao: '',
    tipo: 'moto',
    promocao: false,
    estoque: 1,
    status: 'disponivel' as Status,
    dataVenda: '',
    compradorNome: '',
    fotos: [] as { url: string; position: number }[]
  });
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  useEffect(() => {
    if (isEdit && id) {
      loadVehicleData(id);
    }
  }, [id, isEdit]);

  const loadVehicleData = async (vehicleId: string) => {
    try {
      const data = await getVehicleById(vehicleId);
      if (data) {
        let formattedDataVenda = '';
        if (data.dataVenda) {
          if (typeof data.dataVenda === 'string') {
            formattedDataVenda = data.dataVenda.split('T')[0];
          } else if (typeof data.dataVenda.toDate === 'function') {
            formattedDataVenda = data.dataVenda.toDate().toISOString().split('T')[0];
          }
        }

        setFormData({
          marca: data.marca || '',
          modelo: data.modelo || '',
          ano: Number(data.ano) || new Date().getFullYear(),
          cor: data.cor || '',
          precoCusto: Number(data.precoCusto) || 0,
          preco: Number(data.preco) || 0,
          descricao: data.descricao || '',
          tipo: data.tipo || 'moto',
          promocao: Boolean(data.promocao),
          estoque: Number(data.estoque) || 1,
          status: (data.status as Status) || 'disponivel',
          dataVenda: formattedDataVenda,
          compradorNome: data.compradorNome || '',
          fotos: Array.isArray(data.fotos) ? data.fotos : []
        });
      } else {
        toast.error('Veículo não encontrado.');
        router.push('/admin/veiculos');
      }
    } catch (e: any) {
      console.error('Erro ao buscar veículo:', e);
      toast.error('Erro ao carregar dados do veículo.');
      router.push('/admin/veiculos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.marca.trim() || !formData.modelo.trim()) {
      toast.error('Informe a marca e o modelo do veículo.');
      return;
    }
    if (formData.precoCusto <= 0) {
      toast.error('Informe o preço de compra (custo) do veículo.');
      return;
    }
    if (formData.preco <= 0) {
      toast.error('Informe o preço de venda do veículo.');
      return;
    }
    if (formData.status === 'vendido' && !formData.dataVenda) {
      toast.error('Informe a data da venda.');
      return;
    }

    setSaving(true);

    try {
      await saveVehicleToDatabase(formData, isEdit ? id : undefined);
      toast.success(isEdit ? 'Veículo atualizado com sucesso!' : 'Veículo salvo no banco de dados com sucesso!');
      
      setTimeout(() => {
        router.push('/admin/veiculos');
      }, 400);
    } catch (e: any) {
      console.error('Erro ao gravar no banco:', e);
      toast.error('Erro ao salvar: ' + (e.message || 'Falha na conexão com o banco de dados.'));
      setSaving(false);
    }
  };

  const handleDeviceFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (formData.fotos.length + files.length > 5) {
      toast.error(`Você pode adicionar no máximo 5 fotos. Atualmente já tem ${formData.fotos.length}.`);
      return;
    }

    setUploadingPhotos(true);
    const toastId = toast.loading('Fazendo upload das fotos do dispositivo...');

    try {
      const data = new FormData();
      for (let i = 0; i < files.length; i++) {
        data.append('files', files[i]);
      }

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Erro ao enviar fotos');
      }

      const newPhotos = result.urls.map((url: string, index: number) => ({
        url,
        position: formData.fotos.length + index
      }));

      setFormData(prev => ({
        ...prev,
        fotos: [...prev.fotos, ...newPhotos]
      }));

      toast.success(`${files.length} foto(s) carregada(s) com sucesso!`, { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error('Erro no upload: ' + (err.message || 'Falha ao processar arquivo'), { id: toastId });
    } finally {
      setUploadingPhotos(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const addPhoto = () => {
    if (!newPhotoUrl.trim()) return;
    if (formData.fotos.length >= 5) {
      toast.error('Limite de 5 fotos atingido.');
      return;
    }
    setFormData({ ...formData, fotos: [...formData.fotos, { url: newPhotoUrl.trim(), position: formData.fotos.length }] });
    setNewPhotoUrl('');
  };

  const removePhoto = (index: number) => {
    const newFotos = formData.fotos.filter((_, i) => i !== index).map((f, i) => ({ ...f, position: i }));
    setFormData({ ...formData, fotos: newFotos });
  };

  const lucroEstimado = Number(formData.preco || 0) - Number(formData.precoCusto || 0);
  const margemEstimada = Number(formData.precoCusto || 0) > 0 ? ((lucroEstimado / Number(formData.precoCusto)) * 100) : 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-sky-500" />
        <p className="text-sm font-bold text-gray-500">Carregando dados do veículo...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.back()} 
          type="button"
          className="flex items-center text-gray-500 hover:text-primary transition-colors font-bold text-sm"
        >
          <ArrowLeft className="mr-2" size={18} /> Voltar para a lista
        </button>
        <h1 className="font-heading text-2xl font-black text-primary uppercase">
          {isEdit ? 'Editar Veículo' : 'Novo Veículo'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informações Básicas */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center space-x-2 text-sky-500">
            <Bike size={22} />
            <h3 className="font-heading font-black uppercase tracking-widest text-sm">Informações Básicas</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Marca</label>
              <input 
                type="text" 
                required 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-sky-500 rounded-xl transition-all outline-none text-sm font-bold" 
                value={formData.marca} 
                onChange={e => setFormData({ ...formData, marca: e.target.value })} 
                placeholder="Ex: Honda, Yamaha, Suzuki" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Modelo</label>
              <input 
                type="text" 
                required 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-sky-500 rounded-xl transition-all outline-none text-sm font-bold" 
                value={formData.modelo} 
                onChange={e => setFormData({ ...formData, modelo: e.target.value })} 
                placeholder="Ex: Biz 125, Titan 160, Pop 110i" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Ano</label>
              <input 
                type="number" 
                required 
                min="1990" 
                max={new Date().getFullYear() + 2} 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-sky-500 rounded-xl transition-all outline-none text-sm font-bold" 
                value={formData.ano} 
                onChange={e => setFormData({ ...formData, ano: parseInt(e.target.value) || new Date().getFullYear() })} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Cor do Veículo</label>
              <input 
                type="text" 
                required 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-sky-500 rounded-xl transition-all outline-none text-sm font-bold" 
                value={formData.cor} 
                onChange={e => setFormData({ ...formData, cor: e.target.value })} 
                placeholder="Ex: Vermelho, Preto Fosco, Azul Metálico, Prata" 
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Tipo de Veículo</label>
              <select 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-sky-500 rounded-xl transition-all outline-none text-sm font-bold" 
                value={formData.tipo} 
                onChange={e => setFormData({ ...formData, tipo: e.target.value })}
              >
                <option value="moto">Moto</option>
                <option value="scooter">Scooter</option>
                <option value="carro">Carro</option>
                <option value="utilitario">Utilitário</option>
                <option value="outro">Outro</option>
              </select>
            </div>
          </div>
        </div>

        {/* Preços — Seção Financeira */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center space-x-2 text-sky-500">
            <DollarSign size={20} />
            <h3 className="font-heading font-black uppercase tracking-widest text-sm">Preços e Margem</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Preço de Custo — Interno */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Preço de Compra (Custo)</label>
                <span className="flex items-center gap-1 bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-0.5 rounded-full">
                  <Lock size={9} /> INTERNO
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">R$</span>
                <input
                  type="number" 
                  step="0.01" 
                  min="0" 
                  required
                  className="w-full pl-10 pr-4 py-3 bg-amber-50/50 border-2 border-amber-200 focus:bg-white focus:ring-2 focus:ring-amber-400 focus:border-transparent rounded-xl transition-all font-black text-lg outline-none"
                  value={formData.precoCusto || ''}
                  onChange={e => setFormData({ ...formData, precoCusto: parseFloat(e.target.value) || 0 })}
                  placeholder="0,00"
                />
              </div>
              <p className="text-[10px] text-amber-600 font-bold">🔒 Nunca visível para clientes na vitrine</p>
            </div>

            {/* Preço de Venda — Público */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Preço de Venda</label>
                <span className="flex items-center gap-1 bg-green-100 text-green-700 text-[10px] font-black px-2 py-0.5 rounded-full">
                  <CheckCircle2 size={9} /> PÚBLICO
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">R$</span>
                <input
                  type="number" 
                  step="0.01" 
                  min="0" 
                  required
                  className="w-full pl-10 pr-4 py-3 bg-green-50/50 border-2 border-green-200 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent rounded-xl transition-all font-black text-lg outline-none"
                  value={formData.preco || ''}
                  onChange={e => setFormData({ ...formData, preco: parseFloat(e.target.value) || 0 })}
                  placeholder="0,00"
                />
              </div>
              <p className="text-[10px] text-green-600 font-bold">✅ Exibido publicamente no site Baby Motos</p>
            </div>
          </div>

          {/* Lucro estimado em tempo real */}
          {formData.precoCusto > 0 && formData.preco > 0 && (
            <div className={`p-5 rounded-2xl border-2 transition-all ${lucroEstimado >= 0 ? 'bg-emerald-50/80 border-emerald-200' : 'bg-red-50/80 border-red-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Lucro Bruto por Veículo</p>
                  <p className={`text-2xl font-black ${lucroEstimado >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {lucroEstimado >= 0 ? '+' : ''}R$ {lucroEstimado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Margem Comercial</p>
                  <p className={`text-2xl font-black ${margemEstimada >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {margemEstimada.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Status e Venda */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center space-x-2 text-sky-500">
            <ShoppingCart size={20} />
            <h3 className="font-heading font-black uppercase tracking-widest text-sm">Status e Disponibilidade</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Status do Veículo</label>
              <select
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-sky-500 rounded-xl transition-all font-bold text-sm outline-none"
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as Status })}
              >
                <option value="disponivel">✅ Disponível para Venda</option>
                <option value="reservado">🟡 Reservado (Em negociação)</option>
                <option value="vendido">🔴 Vendido (Registrar venda)</option>
              </select>
            </div>
            {formData.status !== 'vendido' && (
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Estoque Disponível</label>
                <input 
                  type="number" 
                  min="0" 
                  required 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-sky-500 rounded-xl transition-all font-bold text-sm outline-none" 
                  value={formData.estoque} 
                  onChange={e => setFormData({ ...formData, estoque: parseInt(e.target.value) || 0 })} 
                />
              </div>
            )}
          </div>

          {/* Campos de venda quando marcado como vendido */}
          {formData.status === 'vendido' && (
            <div className="p-6 bg-red-50 border-2 border-red-100 rounded-2xl space-y-4 animate-fade-in">
              <p className="text-sm font-black text-red-700 uppercase tracking-wider">📋 Dados do Registro de Venda</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-600 uppercase tracking-widest">Data da Venda</label>
                  <input
                    type="date" 
                    required={formData.status === 'vendido'}
                    className="w-full px-4 py-3 bg-white border border-red-200 focus:ring-2 focus:ring-red-400 rounded-xl transition-all font-bold text-sm outline-none"
                    value={formData.dataVenda}
                    onChange={e => setFormData({ ...formData, dataVenda: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-600 uppercase tracking-widest">Nome do Comprador (Opcional)</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-white border border-red-200 focus:ring-2 focus:ring-red-400 rounded-xl transition-all text-sm font-bold outline-none"
                    value={formData.compradorNome}
                    onChange={e => setFormData({ ...formData, compradorNome: e.target.value })}
                    placeholder="Nome do cliente"
                  />
                </div>
              </div>
              <p className="text-xs text-red-600 font-bold">⚠️ Esta transação será contabilizada instantaneamente no Dashboard e nos Relatórios Financeiros.</p>
            </div>
          )}

          {/* Promoção */}
          <div className="flex items-center space-x-3 p-4 bg-sky-50 rounded-2xl border border-sky-100">
            <input
              type="checkbox" 
              id="promocao"
              className="w-5 h-5 text-sky-500 border-sky-200 rounded focus:ring-sky-500"
              checked={formData.promocao}
              onChange={e => setFormData({ ...formData, promocao: e.target.checked })}
            />
            <label htmlFor="promocao" className="font-bold text-sky-900 cursor-pointer text-sm">
              ⭐ Destacar na Página Inicial (Oferta Especial Baby Motos)
            </label>
          </div>
        </div>

        {/* Fotos */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sky-500">
              <ImageIcon size={20} />
              <h3 className="font-heading font-black uppercase tracking-widest text-sm">Fotos do Veículo (Máx 5)</h3>
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{formData.fotos.length}/5 fotos</span>
          </div>

          <div className="space-y-4">
            {/* Hidden native file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleDeviceFileUpload}
              accept="image/*"
              multiple
              className="hidden"
            />

            {/* Device Upload Drag/Drop Box */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-sky-300 hover:border-sky-500 bg-sky-50/40 hover:bg-sky-50/80 rounded-2xl p-6 text-center cursor-pointer transition-all group"
            >
              {uploadingPhotos ? (
                <div className="flex flex-col items-center justify-center space-y-2 py-2">
                  <Loader2 size={32} className="text-sky-500 animate-spin" />
                  <p className="text-xs font-black text-sky-600 uppercase tracking-wider">Enviando fotos do dispositivo...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-2 py-2">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-md shadow-sky-500/30 group-hover:scale-110 transition-transform">
                    <UploadCloud size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-800">
                      Clique aqui para escolher fotos do seu celular ou computador
                    </p>
                    <p className="text-[11px] text-gray-400 font-bold mt-0.5">
                      Suporta JPG, PNG, WEBP • Selecione várias fotos de uma vez
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Alternative: Link / URL */}
            <div className="pt-2">
              <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">Ou adicione por link de imagem (URL):</p>
              <div className="flex space-x-2">
                <input
                  type="text" 
                  placeholder="https://exemplo.com/foto-moto.jpg"
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-sky-500 rounded-xl transition-all outline-none text-sm font-medium"
                  value={newPhotoUrl}
                  onChange={e => setNewPhotoUrl(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addPhoto();
                    }
                  }}
                />
                <button 
                  type="button" 
                  onClick={addPhoto} 
                  className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-3 rounded-xl transition-all shadow-md shadow-sky-500/20 font-bold text-xs uppercase flex items-center gap-1.5"
                  title="Adicionar foto por link"
                >
                  <Plus size={18} />
                  <span>Adicionar</span>
                </button>
              </div>
            </div>

            {/* Photos Preview Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
              {formData.fotos.map((foto, idx) => (
                <div key={idx} className="relative aspect-video rounded-2xl overflow-hidden border border-gray-200 shadow-sm group bg-gray-100">
                  <Image src={foto.url} alt={`Foto ${idx + 1}`} fill className="object-cover" />
                  <button 
                    type="button" 
                    onClick={() => removePhoto(idx)} 
                    className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg opacity-90 group-hover:opacity-100 transition-all shadow-md hover:bg-red-700"
                    title="Remover foto"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-black/70 backdrop-blur-md text-white text-[9px] font-black rounded uppercase">
                    Foto {idx + 1}
                  </div>
                </div>
              ))}
              {formData.fotos.length === 0 && (
                <div className="col-span-full border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center text-gray-400">
                  <ImageIcon size={32} className="mx-auto mb-1 opacity-30" />
                  <p className="text-xs font-bold">Nenhuma foto adicionada ainda.</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Faça upload de fotos do aparelho ou adicione links.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Descrição */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center space-x-2 text-sky-500">
            <Ruler size={20} />
            <h3 className="font-heading font-black uppercase tracking-widest text-sm">Descrição Detalhada</h3>
          </div>
          <textarea
            rows={4}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-sky-500 rounded-xl transition-all outline-none text-sm font-medium"
            placeholder="Descreva detalhes, quilometragem, revisão, manual, chave reserva, etc..."
            value={formData.descricao}
            onChange={e => setFormData({ ...formData, descricao: e.target.value })}
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-4">
          <button 
            type="button" 
            onClick={() => router.back()} 
            className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl font-black uppercase tracking-widest text-xs transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit" 
            disabled={saving}
            className="px-10 py-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-sky-500/30 transition-all flex items-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                <span>Gravando no Banco...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>{isEdit ? 'Salvar Alterações' : 'Cadastrar Veículo'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
