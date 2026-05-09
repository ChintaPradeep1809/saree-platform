'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { CategoryResponse } from '@/types';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api';

export default function AdminCategoriesPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchCategories = () => {
    fetch(`${BASE}/categories`, { headers: { Authorization: `Bearer ${user?.token}` } })
      .then(r => r.json())
      .then(setCategories)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const startEdit = (cat: CategoryResponse) => {
    setEditingId(cat.id);
    setForm({ name: cat.name, description: cat.description ?? '' });
    setShowAdd(false);
    setError('');
  };

  const startAdd = () => {
    setShowAdd(true);
    setEditingId(null);
    setForm({ name: '', description: '' });
    setError('');
  };

  const cancel = () => { setEditingId(null); setShowAdd(false); setError(''); };

  const save = async () => {
    if (!form.name.trim()) { setError('Name is required'); return; }
    setSaving(true);
    setError('');
    try {
      const url = editingId ? `${BASE}/categories/${editingId}` : `${BASE}/categories`;
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
        body: JSON.stringify({ name: form.name, description: form.description || null }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.message ?? 'Failed to save');
        return;
      }
      cancel();
      fetchCategories();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete category "${name}"? Products in this category will be unaffected.`)) return;
    await fetch(`${BASE}/categories/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${user?.token}` },
    });
    fetchCategories();
  };

  const inputClass = 'border border-primary/20 px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary/50 w-full';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-light tracking-wide">Categories</h1>
        <button onClick={startAdd}
          className="bg-primary text-white px-5 py-2 text-xs tracking-[0.15em] uppercase hover:bg-primary/90 transition-colors">
          + Add Category
        </button>
      </div>

      {(showAdd || editingId !== null) && (
        <div className="bg-white border border-primary/15 p-5 mb-6">
          <p className="text-xs tracking-wide text-foreground/50 mb-4">{editingId ? 'Edit Category' : 'New Category'}</p>
          {error && <p className="text-red-600 text-xs mb-3">{error}</p>}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-foreground/40 mb-1">Name *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputClass} placeholder="e.g. Silk Sarees" />
            </div>
            <div>
              <label className="block text-xs text-foreground/40 mb-1">Description</label>
              <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className={inputClass} placeholder="Optional" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={save} disabled={saving}
              className="bg-primary text-white px-6 py-2 text-xs tracking-wide uppercase hover:bg-primary/90 disabled:opacity-50">
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={cancel} className="px-4 py-2 text-xs text-foreground/50 border border-primary/15 hover:border-primary/30">Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-foreground/40 text-sm">Loading...</p>
      ) : (
        <div className="bg-white border border-primary/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-primary/5 border-b border-primary/10">
              <tr>
                <th className="text-left px-4 py-3 text-xs tracking-wide text-foreground/50 font-normal">Name</th>
                <th className="text-left px-4 py-3 text-xs tracking-wide text-foreground/50 font-normal">Slug</th>
                <th className="text-left px-4 py-3 text-xs tracking-wide text-foreground/50 font-normal">Description</th>
                <th className="text-left px-4 py-3 text-xs tracking-wide text-foreground/50 font-normal">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {categories.map(cat => (
                <tr key={cat.id} className="hover:bg-primary/2 transition-colors">
                  <td className="px-4 py-3 font-medium">{cat.name}</td>
                  <td className="px-4 py-3 text-foreground/40 text-xs font-mono">{cat.slug}</td>
                  <td className="px-4 py-3 text-foreground/60 text-xs">{cat.description ?? '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button onClick={() => startEdit(cat)} className="text-xs text-primary hover:underline">Edit</button>
                      <button onClick={() => handleDelete(cat.id, cat.name)} className="text-xs text-red-500 hover:underline">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
