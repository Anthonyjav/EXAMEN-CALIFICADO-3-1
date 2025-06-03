'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const [productos, setProductos] = useState<any[]>([])
  const router = useRouter()

  // Validación de autenticación y rol
  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (!userStr) {
      router.push('/')
      return
    }
    const user = JSON.parse(userStr)
    if (user.user.role?.toLowerCase() !== 'admin') {
      router.push('/')
    }
  }, [router])

  // Obtener productos
  const fetchProductos = async () => {
    const res = await fetch('http://localhost:5000/api/products')
    const data = await res.json()
    setProductos(data)
  }

  useEffect(() => {
    fetchProductos()
  }, [])

  // Eliminar producto
  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return
    await fetch(`http://localhost:5000/api/products/${id}`, {
      method: 'DELETE'
    })
    fetchProductos()
  }

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-extrabold text-gray-900">Panel Administrativo</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 transition-colors text-white font-semibold px-5 py-2 rounded-md shadow-sm"
          >
            Cerrar sesión
          </button>
        </div>

        {/* Info + agregar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <p className="text-gray-700 text-lg max-w-md">
            Aquí podrás administrar productos y gestionar usuarios.
          </p>
          <button
            onClick={() => router.push('/admin/agregar')}
            className="bg-green-600 hover:bg-green-700 transition-colors text-white font-semibold px-6 py-2 rounded-md shadow-md"
          >
            + Agregar Producto
          </button>
        </div>

        {/* Tabla responsive */}
        <div className="overflow-x-auto rounded-md border border-gray-300 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Imagen</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Precio</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Stock</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {productos.map((producto) => (
                <tr
                  key={producto.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <img
                      src={producto.image_url}
                      alt={producto.name}
                      className="w-20 h-20 object-cover rounded-md border"
                    />
                  </td>
                  <td className="px-4 py-3 text-gray-900 font-medium">{producto.name}</td>
                  <td className="px-4 py-3 text-gray-700">S/ {producto.price}</td>
                  <td className="px-4 py-3 text-gray-700">{producto.stock}</td>
                  <td className="px-4 py-3 flex justify-center gap-3">
                    <button
                      onClick={() => router.push(`/admin/editar/${producto.id}`)}
                      className="bg-yellow-400 hover:bg-yellow-500 transition-colors text-white font-semibold px-4 py-1 rounded-md shadow-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(producto.id)}
                      className="bg-red-600 hover:bg-red-700 transition-colors text-white font-semibold px-4 py-1 rounded-md shadow-sm"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {productos.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    No hay productos disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
