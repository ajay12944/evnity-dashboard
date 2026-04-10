import { useState, useEffect } from 'react';
import { firebaseService } from '../services/firebaseService';
import toast from 'react-hot-toast';

export const useCRUD = (collectionName, initialFormState = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = firebaseService.subscribe(collectionName, (freshData) => {
      setData(freshData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [collectionName]);

  const handleOpenModal = (row = null) => {
    setError(null);
    if (row) {
      setIsEditing(true);
      setEditId(row.id);
      setFormData(row);
    } else {
      setIsEditing(false);
      setEditId(null);
      setFormData(initialFormState);
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setFormData(initialFormState);
    setIsEditing(false);
    setEditId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await firebaseService.update(collectionName, editId, formData);
        toast.success(`Successfully updated ${collectionName.slice(0, -1)}`);
      } else {
        await firebaseService.create(collectionName, formData);
        toast.success(`Successfully created ${collectionName.slice(0, -1)}`);
      }
      handleCloseModal();
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  const handleDelete = async (id, itemName = 'item') => {
    if (window.confirm(`Are you sure you want to delete this ${itemName}?`)) {
      try {
        await firebaseService.delete(collectionName, id);
        toast.success(`Successfully deleted ${itemName}`);
      } catch (err) {
        toast.error('Failed to delete: ' + err.message);
      }
    }
  };

  return {
    data,
    loading,
    error,
    modalOpen,
    formData,
    isEditing,
    setFormData,
    handleOpenModal,
    handleCloseModal,
    handleChange,
    handleSubmit,
    handleDelete
  };
};
