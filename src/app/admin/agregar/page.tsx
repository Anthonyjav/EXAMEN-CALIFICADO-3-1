'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AgregarProducto() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Convertir price y stock a números para cumplir validación del backend
    const productoFinal = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      stock: parseInt(form.stock, 10),
    }

    try {
      const res = await fetch('http://localhost:5000/api/products/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productoFinal),
      })

      if (!res.ok) {
        const errorData = await res.json()
        alert('Error al agregar producto: ' + (errorData.message || res.statusText))
        return
      }

      router.push('/admin')
    } catch (error) {
      alert('Error de red o servidor: ' + error)
    }
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Agregar Producto</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          onChange={handleChange}
          placeholder="Nombre"
          required
          className="w-full p-2 border rounded"
          value={form.name}
        />
        <input
          name="price"
          onChange={handleChange}
          placeholder="Precio"
          type="number"
          step="0.01"
          required
          className="w-full p-2 border rounded"
          value={form.price}
        />
        <input
          name="stock"
          onChange={handleChange}
          placeholder="Stock"
          type="number"
          required
          className="w-full p-2 border rounded"
          value={form.stock}
        />
        <textarea
          name="description"
          onChange={handleChange}
          placeholder="Descripción"
          className="w-full p-2 border rounded"
          value={form.description}
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Guardar
        </button>
      </form>
    </div>
  )
}
