'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, X, Plus, ImageIcon, Trash2, Tag, Car, Ruler } from 'lucide-react';
import Image from 'next/image';
import { Vehicle } from '@/lib/types';
import { toast } from 'sonner';

export default function VehicleFormPage() {
  const router = useRouter();
  const { id } = useParams();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    ano: new Date().getFullYear(),
    preco: 0,
    descricao: '',
    tipo: 'carro',
    promocao: false,
    estoque: 1,
    fotos: [] as { url: string; position: number }[]
  });

  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  useEffect(() => {
    if (isEdit) {
      fetchVehicle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit]);

  const fetchVehicle = async () => {
    try {
      if (!id) return;
      
      const { db } = await import('@/lib/firebase');
      const { doc, getDoc } = await import('firebase/firestore');
      
      const docRef = doc(db, 'vehicles', id as string);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setFormData({
          marca: data.marca || '',
          modelo: data.modelo || '',
          ano: data.ano || new Date().getFullYear(),
          preco: Number(data.preco || 0),
          descricao: data.descricao || '',
          tipo: data.tipo || 'carro',
          promocao: data.promocao || false,
          estoque: data.estoque || 1,
          fotos: data.fotos || []
        });
      } else {
        toast.error('Veículo não encontrado.');
        router.push('/admin/veiculos');
      }
    } catch (e) {
      console.error(e);
      toast.error('Erro ao carregar os dados do veículo.');
      router.push('/admin/veiculos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { db } = await import('@/lib/firebase');
      const { collection, addDoc, doc, updateDoc, serverTimestamp } = await import('firebase/firestore');

      const vehicleData = {
        ...formData,
        preco: Number(formData.preco),
        updated_at: serverTimestamp()
      };

      if (isEdit) {
         if (!id) throw new Error("ID inválido");
         const vehicleRef = doc(db, 'vehicles', id as string);
         await updateDoc(vehicleRef, vehicleData);
         toast.success('Veículo atualizado com sucesso!');
      } else {
         const vehiclesRef = collection(db, 'vehicles');
         await addDoc(vehiclesRef, {
            ...vehicleData,
            created_at: serverTimestamp()
         });
         toast.success('Veículo cadastrado com sucesso!');
      }

      router.push('/admin/veiculos');
    } catch (e: any) {
      console.error(e);
      toast.error('Erro ao salvar os dados: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const addPhoto = () => {
    if (!newPhotoUrl) return;
    if (formData.fotos.length >= 3) {
      toast.error('Você já atingiu o limite de 3 fotos para este veículo.');
      return;
    }
    setFormData({
      ...formData,
      fotos: [...formData.fotos, { url: newPhotoUrl, position: formData.fotos.length }]
    });
    setNewPhotoUrl('');
  };

  const removePhoto = (index: number) => {
    const newFotos = formData.fotos.filter((_, i) => i !== index).map((f, i) => ({ ...f, position: i }));
    setFormData({ ...formData, fotos: newFotos });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.back()} 
          className="flex items-center text-gray-500 hover:text-primary transition-colors font-bold"
        >
          <ArrowLeft className="mr-2" size={20} /> Voltar para a lista
        </button>
        <h1 className="font-heading text-2xl font-black text-primary uppercase">
          {isEdit ? 'Editar Veículo' : 'Novo Veículo'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center space-x-2 text-secondary">
            <Car size={20} />
            <h3 className="font-heading font-black uppercase tracking-widest text-sm">Informações Básicas</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Marca</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-secondary rounded-xl transition-all"
                value={formData.marca}
                onChange={e => setFormData({ ...formData, marca: e.target.value })}
                placeholder="Ex: Honda, Toyota, BMW"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Modelo</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-secondary rounded-xl transition-all"
                value={formData.modelo}
                onChange={e => setFormData({ ...formData, modelo: e.target.value })}
                placeholder="Ex: Civic, Corolla, X5"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Ano</label>
              <input 
                type="number" 
                required
                className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-secondary rounded-xl transition-all"
                value={formData.ano}
                onChange={e => setFormData({ ...formData, ano: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Tipo de Veículo</label>
              <select 
                className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-secondary rounded-xl transition-all"
                value={formData.tipo}
                onChange={e => setFormData({ ...formData, tipo: e.target.value })}
              >
                <option value="carro">Carro</option>
                <option value="moto">Moto</option>
                <option value="utilitario">Utilitário</option>
                <option value="outro">Outro</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pricing & Offer */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center space-x-2 text-secondary">
            <Tag size={20} />
            <h3 className="font-heading font-black uppercase tracking-widest text-sm">Preço e Promoção</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Preço Individual (R$)</label>
              <input 
                type="number" 
                step="0.01"
                required
                className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-secondary rounded-xl transition-all font-bold text-lg"
                value={formData.preco}
                onChange={e => setFormData({ ...formData, preco: parseFloat(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Estoque Disponível</label>
              <input 
                type="number" 
                required
                className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-secondary rounded-xl transition-all"
                value={formData.estoque}
                onChange={e => setFormData({ ...formData, estoque: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-2xl border border-red-100">
            <input 
              type="checkbox" 
              id="promocao"
              className="w-5 h-5 text-secondary border-red-200 rounded focus:ring-secondary"
              checked={formData.promocao}
              onChange={e => setFormData({ ...formData, promocao: e.target.checked })}
            />
            <label htmlFor="promocao" className="font-bold text-red-900 cursor-pointer">
              Marcar como Oferta Especial (Destaque na Home e Promoções)
            </label>
          </div>
        </div>

        {/* Photos */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-secondary">
              <ImageIcon size={20} />
              <h3 className="font-heading font-black uppercase tracking-widest text-sm">Fotos do Veículo (Máx 3)</h3>
            </div>
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{formData.fotos.length}/3 fotos</span>
          </div>

          <div className="space-y-4">
            <div className="flex space-x-2">
              <input 
                type="text" 
                placeholder="URL da imagem (ex: https://...)" 
                className="flex-1 px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-secondary rounded-xl transition-all"
                value={newPhotoUrl}
                onChange={e => setNewPhotoUrl(e.target.value)}
              />
              <button 
                type="button" 
                onClick={addPhoto}
                className="bg-primary text-white p-3 rounded-xl hover:bg-black transition-all"
              >
                <Plus size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-bold">
              {formData.fotos.map((foto, idx) => (
                <div key={idx} className="relative aspect-video rounded-2xl overflow-hidden border border-gray-100 shadow-sm group">
                  <Image src={foto.url} alt={`Preview ${idx}`} fill className="object-cover" />
                  <button 
                    type="button"
                    onClick={() => removePhoto(idx)}
                    className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/50 text-white text-[10px] rounded uppercase">
                    Posição {idx + 1}
                  </div>
                </div>
              ))}
              {formData.fotos.length === 0 && (
                <div className="col-span-full border-2 border-dashed border-gray-100 rounded-2xl p-12 text-center text-gray-300">
                  <ImageIcon size={48} className="mx-auto mb-2 opacity-20" />
                  <p className="text-sm">Nenhuma foto adicionada.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center space-x-2 text-secondary">
            <Ruler size={20} />
            <h3 className="font-heading font-black uppercase tracking-widest text-sm">Descrição Detalhada</h3>
          </div>
          <textarea 
            rows={6}
            className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-secondary rounded-xl transition-all"
            placeholder="Descreva as características do veículo, acessórios, estado de conservação..."
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
            className="px-12 py-4 bg-secondary hover:bg-red-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-red-100 transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            {saving ? <div className="animate-spin h-5 w-5 border-2 border-white/20 border-t-white rounded-full"></div> : <Save size={20} />}
            <span>{isEdit ? 'Salvar Alterações' : 'Cadastrar Veículo'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
