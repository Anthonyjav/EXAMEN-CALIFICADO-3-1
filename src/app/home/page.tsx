'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { HomeIcon, ShoppingCartIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

interface Producto {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
}

export default function HomePage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/');
      return;
    }

    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(err => console.error('Error al obtener productos:', err));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/');
  };

  const agregarAlCarrito = (producto: Producto) => {
    const carritoStr = localStorage.getItem('carrito');
    let carrito: { producto: Producto; cantidad: number }[] = carritoStr ? JSON.parse(carritoStr) : [];

    const index = carrito.findIndex(item => item.producto.id === producto.id);
    if (index !== -1) {
      carrito[index].cantidad += 1;
    } else {
      carrito.push({ producto, cantidad: 1 });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    alert(`Se agregó "${producto.name}" al carrito.`);
  };

  return (
    <div className="min-h-screen bg-[#F1EDE2] font-[var(--font-geist-sans)]">
      {/* NAVBAR */}
      <nav className="bg-[#F7F1EC] border-b border-[#E2D6C6] px-6 py-4 flex justify-between items-center">
        <div className="flex gap-6 items-center">
          <button onClick={() => router.push('/home')} className="flex items-center gap-1 text-[#A68461] hover:underline">
            <HomeIcon className="h-5 w-5" />
            <span>Inicio</span>
          </button>
          <button onClick={() => router.push('/carrito')} className="flex items-center gap-1 text-[#A68461] hover:underline">
            <ShoppingCartIcon className="h-5 w-5" />
            <span>Carrito</span>
          </button>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-1 text-red-600 hover:underline">
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          <span>Cerrar sesión</span>
        </button>
      </nav>

      {/* CONTENIDO */}
      <div className="p-10 sm:p-20">
        <h1 className="text-4xl font-bold text-[#A68461] text-center mb-12">Nuestros Productos</h1>

        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {productos.length > 0 ? (
            productos.map((producto) => (
              <div
                key={producto.id}
                className="bg-[#F7F1EC] border border-[#E2D6C6] rounded-2xl shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition"
              >
                <div className="relative w-full h-52">
                  <Image
                    src={producto.image_url || '/placeholder.png'}
                    alt={producto.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-2xl"
                  />
                </div>
                <div className="p-4 flex flex-col gap-2 flex-grow">
                  <h2 className="text-lg font-semibold text-[#A68461]">{producto.name}</h2>
                  <p className="text-sm text-gray-600 line-clamp-2">{producto.description}</p>
                  <div className="text-[#A68461] font-bold text-md mt-2">S/. {producto.price}</div>
                </div>
                <button
                  onClick={() => agregarAlCarrito(producto)}
                  className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-b-2xl font-semibold transition"
                >
                  + Agregar al carrito
                </button>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-[#A68461] text-lg">No hay productos disponibles.</p>
          )}
        </div>
      </div>
    </div>
  );
}
