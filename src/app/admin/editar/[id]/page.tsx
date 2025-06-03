'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface FormData {
  name: string;
  description: string;
  price: string;
  stock: string;
}

export default function EditarProducto() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: '',
    stock: ''
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('ID del producto no proporcionado');
      setLoading(false);
      return;
    }

    fetch(`http://localhost:5000/api/products/${id}`)
      .then(async res => {
        if (!res.ok) {
          const json = await res.json();
          throw new Error(json.message || 'Error al obtener el producto');
        }
        return res.json();
      })
      .then(data => {
        setFormData({
          name: data.name || '',
          description: data.description || '',
          price: data.price?.toString() || '',
          stock: data.stock?.toString() || ''
        });
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.price.trim() ||
      !formData.stock.trim()
    ) {
      alert('Nombre, Precio y Stock son obligatorios');
      return;
    }

    const priceNum = Number(formData.price);
    const stockNum = Number(formData.stock);

    if (isNaN(priceNum) || priceNum <= 0) {
      alert('Precio debe ser un número positivo');
      return;
    }
    if (isNaN(stockNum) || stockNum < 0 || !Number.isInteger(stockNum)) {
      alert('Stock debe ser un entero mayor o igual a 0');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim(),
          price: priceNum,
          stock: stockNum
        })
      });

      if (res.ok) {
        router.push('/admin');
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Error al actualizar producto');
      }
    } catch {
      alert('Error al conectar con el servidor');
    }
  };

  if (loading) return <p style={{ textAlign: 'center' }}>Cargando producto...</p>;
  if (error) return <p style={{ color: 'red', textAlign: 'center' }}>Error: {error}</p>;

  return (
    <div style={{
      maxWidth: '480px',
      margin: '2rem auto',
      padding: '2rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      borderRadius: '8px',
      backgroundColor: '#fff',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#333' }}>
        Editar Producto
      </h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Nombre"
          required
          style={inputStyle}
        />
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descripción"
          style={inputStyle}
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Precio"
          min="0"
          step="0.01"
          required
          style={inputStyle}
        />
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          placeholder="Stock"
          min="0"
          step="1"
          required
          style={inputStyle}
        />
        <button
          type="submit"
          style={{
            padding: '0.75rem',
            backgroundColor: '#0070f3',
            color: '#fff',
            fontWeight: '600',
            fontSize: '1rem',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#005bb5')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#0070f3')}
        >
          Guardar cambios
        </button>
      </form>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: '0.6rem 1rem',
  fontSize: '1rem',
  borderRadius: '6px',
  border: '1.5px solid #ccc',
  outline: 'none',
  transition: 'border-color 0.3s ease',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

