'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Producto {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
}

interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

export default function CarritoPage() {
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const router = useRouter();

  useEffect(() => {
    const carritoStr = localStorage.getItem('carrito');
    if (carritoStr) {
      setCarrito(JSON.parse(carritoStr));
    }
  }, []);

  const guardarCarrito = (nuevoCarrito: ItemCarrito[]) => {
    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
  };

  const incrementar = (id: number) => {
    const nuevoCarrito = carrito.map(item => {
      if (item.producto.id === id) {
        return { ...item, cantidad: item.cantidad + 1 };
      }
      return item;
    });
    guardarCarrito(nuevoCarrito);
  };

  const decrementar = (id: number) => {
    const nuevoCarrito = carrito
      .map(item => {
        if (item.producto.id === id) {
          return { ...item, cantidad: item.cantidad - 1 };
        }
        return item;
      })
      .filter(item => item.cantidad > 0);
    guardarCarrito(nuevoCarrito);
  };

  const eliminar = (id: number) => {
    const nuevoCarrito = carrito.filter(item => item.producto.id !== id);
    guardarCarrito(nuevoCarrito);
  };

  const finalizarCompra = () => {
    if (carrito.length === 0) {
      alert('El carrito está vacío.');
      return;
    }
    alert('Compra finalizada con éxito.');
    localStorage.removeItem('carrito');
    setCarrito([]);
    router.push('/home');
  };

  const total = carrito.reduce((acc, item) => acc + item.producto.price * item.cantidad, 0);

  return (
    <div className="min-h-screen bg-[#F1EDE2] font-[var(--font-geist-sans)] p-10 sm:p-20">
      <h1 className="text-4xl font-bold text-[#A68461] text-center mb-12">Tu Carrito</h1>

      {carrito.length === 0 ? (
        <p className="text-center text-[#A68461] text-lg">No hay productos en el carrito.</p>
      ) : (
        <>
          <div className="space-y-6 max-w-4xl mx-auto">
            {carrito.map(({ producto, cantidad }) => (
              <div
                key={producto.id}
                className="flex items-center bg-[#F7F1EC] border border-[#E2D6C6] rounded-2xl shadow p-4 gap-4"
              >
                <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
                  <Image
                    src={producto.image_url || '/placeholder.png'}
                    alt={producto.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="flex-grow">
                  <h2 className="text-xl font-semibold text-[#A68461]">{producto.name}</h2>
                  <p className="text-gray-600 text-sm line-clamp-2">{producto.description}</p>
                  <div className="font-bold text-[#A68461] mt-1">S/. {producto.price}</div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decrementar(producto.id)}
                      className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                      aria-label="Disminuir cantidad"
                    >
                      -
                    </button>
                    <span className="w-6 text-center">{cantidad}</span>
                    <button
                      onClick={() => incrementar(producto.id)}
                      className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                      aria-label="Aumentar cantidad"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => eliminar(producto.id)}
                    className="text-red-600 hover:underline text-sm"
                    aria-label="Eliminar producto"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="max-w-4xl mx-auto mt-10 flex justify-between items-center">
            <div className="text-2xl font-bold text-[#A68461]">Total: S/. {total.toFixed(2)}</div>
            <button
              onClick={finalizarCompra}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded font-semibold transition"
            >
              Finalizar compra
            </button>
          </div>
        </>
      )}
    </div>
  );
}
