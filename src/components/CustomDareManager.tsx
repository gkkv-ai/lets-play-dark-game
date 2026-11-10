import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Eye, X, Save } from 'lucide-react';
import type { Dare } from '../types';
import { useApp } from '../context/AppContext';
import ConfirmDialog from './ConfirmDialog';
import './CustomDareManager.scss';

const CATEGORIES = ['Kiss', 'Touch', 'Talk', 'Dance', 'Oral', 'Blindfold', 'Roleplay', 'Sensation', 'Sex', 'Other'];

const emptyForm = (): Partial<Dare> => ({
  title: '',
  description: '',
  category: 'Other',
  level: 1,
  duration: undefined,
  isCustom: true,
});

interface CustomDareManagerProps {
  onClose: () => void;
}

const CustomDareManager: React.FC<CustomDareManagerProps> = ({ onClose }) => {
  const { customDares, addCustomDare, updateCustomDare, deleteCustomDare } = useApp();
  const [form, setForm] = useState<Partial<Dare>>(emptyForm());
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [preview, setPreview] = useState<Dare | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [durationInput, setDurationInput] = useState('');

  const openNew = () => {
    setForm(emptyForm());
    setEditing(null);
    setDurationInput('');
    setShowForm(true);
  };

  const openEdit = (d: Dare) => {
    setForm({ ...d });
    setEditing(d.id);
    setDurationInput(d.duration ? String(Math.floor(d.duration / 60)) : '');
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.title?.trim() || !form.description?.trim()) return;
    const durationSec = durationInput
      ? Math.max(1, parseInt(durationInput, 10)) * 60
      : undefined;
    const dare: Dare = {
      id: editing || `custom_${Date.now()}`,
      level: form.level as 1 | 2 | 3,
      title: form.title!.trim(),
      description: form.description!.trim(),
      category: form.category || 'Other',
      duration: durationSec,
      isCustom: true,
    };
    if (editing) {
      updateCustomDare(dare);
    } else {
      addCustomDare(dare);
    }
    setShowForm(false);
    setForm(emptyForm());
    setEditing(null);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteCustomDare(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <motion.div
      className="custom-dare-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="custom-dare-panel glass"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      >
        <div className="panel-header">
          <h3>My Dares</h3>
          <div className="header-actions">
            <motion.button
              className="btn-add"
              onClick={openNew}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus size={16} />
              Add Dare
            </motion.button>
            <button className="close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="panel-body">
          {customDares.length === 0 && !showForm && (
            <div className="empty-state">
              <span>No custom dares yet.</span>
              <p>Add your own dares to personalize the game.</p>
            </div>
          )}

          {/* Form */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                className="dare-form glass"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h4>{editing ? 'Edit Dare' : 'New Custom Dare'}</h4>

                <div className="form-row">
                  <label>Title *</label>
                  <input
                    type="text"
                    placeholder="Dare title..."
                    value={form.title || ''}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    maxLength={80}
                  />
                </div>

                <div className="form-row">
                  <label>Description *</label>
                  <textarea
                    placeholder="Describe the dare..."
                    value={form.description || ''}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="form-grid">
                  <div className="form-row">
                    <label>Level</label>
                    <select
                      value={form.level || 1}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, level: Number(e.target.value) as 1 | 2 | 3 }))
                      }
                    >
                      <option value={1}>Level 1 — Romantic</option>
                      <option value={2}>Level 2 — Passion</option>
                      <option value={3}>Level 3 — Extreme</option>
                    </select>
                  </div>

                  <div className="form-row">
                    <label>Category</label>
                    <select
                      value={form.category || 'Other'}
                      onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <label>Duration (minutes, optional)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    placeholder="e.g. 5"
                    value={durationInput}
                    onChange={(e) => setDurationInput(e.target.value)}
                  />
                </div>

                <div className="form-actions">
                  <motion.button
                    className="btn-save"
                    onClick={handleSave}
                    disabled={!form.title?.trim() || !form.description?.trim()}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Save size={16} />
                    {editing ? 'Save Changes' : 'Add Dare'}
                  </motion.button>
                  <button className="btn-cancel-form" onClick={() => setShowForm(false)}>
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* List */}
          <div className="dare-list">
            {customDares.map((d) => (
              <motion.div
                key={d.id}
                className="dare-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="dare-item-info">
                  <span className="dare-item-title">{d.title}</span>
                  <span className="dare-item-meta">
                    Level {d.level} · {d.category}
                    {d.duration ? ` · ${Math.round(d.duration / 60)}m` : ''}
                  </span>
                </div>
                <div className="dare-item-actions">
                  <button onClick={() => setPreview(d)} title="Preview">
                    <Eye size={15} />
                  </button>
                  <button onClick={() => openEdit(d)} title="Edit">
                    <Edit2 size={15} />
                  </button>
                  <button
                    className="del"
                    onClick={() => setDeleteId(d.id)}
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Preview */}
        <AnimatePresence>
          {preview && (
            <motion.div
              className="preview-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreview(null)}
            >
              <motion.div
                className="preview-card glass"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button className="close-btn" onClick={() => setPreview(null)}>
                  <X size={18} />
                </button>
                <span className="preview-level">Level {preview.level}</span>
                <h3>{preview.title}</h3>
                <p>{preview.description}</p>
                {preview.duration && (
                  <span className="preview-duration">
                    ⏱ {Math.round(preview.duration / 60)} minutes
                  </span>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete confirm */}
        <AnimatePresence>
          {deleteId && (
            <ConfirmDialog
              title="Delete Dare?"
              message="This custom dare will be permanently deleted."
              confirmLabel="Delete"
              onConfirm={handleDelete}
              onCancel={() => setDeleteId(null)}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default CustomDareManager;

