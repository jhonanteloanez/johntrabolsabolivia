/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { ShoppingCart, Plus, Minus, Send, CheckCircle2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Importa tus imágenes aquí
import freshMint from './assets/images/fresh-mint.jpg';
import cucumberLime from './assets/images/cucumber-lime.jpg';
import appleMint from './assets/images/apple-mint.jpg';
import pineappleCoconut from './assets/images/pineapple-coconut.jpg';
import purpleChill from './assets/images/purple-chill.jpg';
import citrus from './assets/images/citrus.jpg';
import logoImage from './assets/images/El match perfecto para tu bebida. Disfruta tu ZYN aquí..png';

interface Flavor {
  id: string;
  name: string;
  description: string;
  color: string;
  price: number;
  image?: string;
}

const FLAVORS: Flavor[] = [
  { id: 'fresh-mint', name: 'Fresh Mint 6.5mg', description: 'Experiencia refrescante de menta suave.', color: 'bg-sky-100 border-sky-200 text-sky-900', price: 70, image: freshMint },
  { id: 'cucumber-lime', name: 'Cucumber Lime 6.5mg', description: 'Pepino fresco con un toque cítrico de lima.', color: 'bg-lime-100 border-lime-200 text-lime-900', price: 70, image: cucumberLime },
  { id: 'apple-mint', name: 'Apple Mint 9mg', description: 'Manzana dulce combinada con menta fresca.', color: 'bg-emerald-200 border-emerald-300 text-emerald-950', price: 70, image: appleMint },
  { id: 'pineapple-coconut', name: 'Pineapple Coconut 9mg', description: 'Escape tropical en cada bolsa.', color: 'bg-amber-200 border-amber-300 text-amber-950', price: 70, image: pineappleCoconut },
  { id: 'purple-chill', name: 'Purple Chill 9mg', description: 'Relajante mezcla de bayas silvestres.', color: 'bg-fuchsia-100 border-fuchsia-200 text-fuchsia-900', price: 70, image: purpleChill },
  { id: 'citrus', name: 'Citrus 11mg', description: 'Cítrico clásico, brillante y picante.', color: 'bg-orange-100 border-orange-200 text-orange-900', price: 70, image: citrus },
];

export default function App() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [isOrdering, setIsOrdering] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);

  const rawWhatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '59177674401';
  const whatsappNumber = rawWhatsappNumber.replace(/\D/g, '');
  const quickWhatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hola quiero poutinear mis pouches')}`;

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: next };
    });
  };

  const clearCart = () => {
    if (window.confirm('¿Estás seguro de que quieres vaciar todo el carrito?')) {
      setCart({});
    }
  };

  const totalItems = useMemo(() => Object.values(cart).reduce((sum: number, q: number) => sum + q, 0), [cart]);
  
  const discountPerItem = totalItems >= 6 ? 10 : (totalItems >= 2 ? 5 : 0);
  const totalDiscount = totalItems * discountPerItem;

  const totalPrice = useMemo(() => {
    const basePrice = Object.entries(cart).reduce((sum: number, [id, q]: [string, number]) => {
      const flavor = FLAVORS.find(f => f.id === id);
      return sum + (flavor?.price || 0) * q;
    }, 0);
    return basePrice - totalDiscount;
  }, [cart, totalDiscount]);

  const handlePlaceOrder = () => {
    if (totalItems === 0) return;
    
    setIsOrdering(true);
    
    let message = `*PEDIDO JOHN TRABOLSA*\n\n`;
    Object.entries(cart).forEach(([id, q]) => {
      const flavor = FLAVORS.find(f => f.id === id);
      message += `• ${flavor?.name}: ${q} unidades\n`;
    });
    message += `\n*Resumen:*`;
    message += `\n- Cantidad: ${totalItems} items`;
    if (totalDiscount > 0) {
      message += `\n- Ahorro: -${totalDiscount} Bs.`;
    }
    message += `\n- Total: ${totalPrice.toFixed(0)} Bs.`;
    message += `\n\n¡Hola! Quiero confirmar mi pedido.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Small delay for animation feel
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      setIsOrdering(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-stone-200">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-stone-200 px-4 py-4">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img 
              src={logoImage} 
              alt="Logo John Trabolsa" 
              className="w-12 h-12 rounded-full object-cover border-2 border-stone-100 shadow-sm"
              referrerPolicy="no-referrer"
            />
            <div>
              <h1 className="text-xl font-black tracking-tighter text-stone-900 uppercase">JOHN TRABOLSA</h1>
              <p className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.2em]">Pouches premium</p>
            </div>
          </div>
          <div className="relative">
            <ShoppingCart className="w-6 h-6 text-stone-600" />
            {totalItems > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-stone-900 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white"
              >
                {totalItems}
              </motion.span>
            )}
          </div>
        </div>
      </header>

      <main className={`max-w-2xl mx-auto px-4 py-8 ${totalItems > 0 ? 'pb-80' : 'pb-40'}`}>
        <div className="mb-8">
          <h2 className="text-3xl font-light text-stone-800 mb-2">Selecciona tus sabores</h2>
          <p className="text-stone-500 text-sm font-medium mb-6">Arma tu pedido en segundos y confírmalo por WhatsApp.</p>
          
          {/* FAQ Accordion */}
          <div className="border border-stone-200 rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm">
            <button 
              onClick={() => setIsFaqOpen(!isFaqOpen)}
              aria-expanded={isFaqOpen}
              aria-controls="faq-content"
              className="w-full flex items-center justify-between p-4 text-left hover:bg-stone-100/50 transition-colors"
            >
              <span className="text-sm font-bold text-stone-700 uppercase tracking-tight">¿Qué son los pouches?</span>
              <motion.div
                animate={{ rotate: isFaqOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4 text-stone-400" />
              </motion.div>
            </button>
            
            <AnimatePresence>
              {isFaqOpen && (
                <motion.div
                  id="faq-content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="p-4 pt-0 space-y-3">
                    <div className="h-px bg-stone-100 mb-3" />
                    <ul className="space-y-3 text-stone-600 text-xs leading-relaxed">
                      <li className="flex gap-3 items-start bg-sky-50/50 p-2 rounded-xl border border-sky-100/50">
                        <span className="text-lg">🤫</span>
                        <span><strong className="text-sky-900 block">Discretos</strong> Pequeños sobres de uso oral, invisibles y fáciles de llevar a todos lados.</span>
                      </li>
                      <li className="flex gap-3 items-start bg-emerald-50/50 p-2 rounded-xl border border-emerald-100/50">
                        <span className="text-lg">✨</span>
                        <span><strong className="text-emerald-900 block">Limpios</strong> Destacan por su practicidad, sin humo ni cenizas, con variedad de sabores.</span>
                      </li>
                      <li className="flex gap-3 items-start bg-purple-50/50 p-2 rounded-xl border border-purple-100/50">
                        <span className="text-lg">☁️</span>
                        <span><strong className="text-purple-900 block">Cómodos</strong> Una opción ligera para el día a día, ideales para usar en cualquier momento.</span>
                      </li>
                      <li className="flex gap-3 items-start bg-amber-50/50 p-2 rounded-xl border border-amber-100/50">
                        <span className="text-lg">🧠</span>
                        <span><strong className="text-amber-900 block">Prácticos</strong> Aportan una sensación rápida de frescura y enfoque, perfectos para quienes buscan una experiencia moderna y sencilla.</span>
                      </li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="grid gap-4">
          {FLAVORS.map((flavor) => (
            <motion.div 
              key={flavor.id}
              whileHover={{ y: -2 }}
              className={`p-4 rounded-2xl border transition-all ${flavor.color} flex items-center gap-4`}
            >
              {flavor.image && (
                <div className="w-16 h-16 flex-shrink-0 bg-white/40 rounded-xl overflow-hidden border border-black/5">
                  <img 
                    src={flavor.image} 
                    alt={flavor.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-bold text-lg leading-tight">{flavor.name}</h3>
                <p className="text-xs opacity-80 mb-1 line-clamp-1">{flavor.description}</p>
                <p className="text-xs font-mono font-bold opacity-60">{flavor.price} Bs. / unidad</p>
              </div>
              
              <div className="flex items-center bg-white/50 rounded-full p-1 border border-black/5 shadow-sm">
                <button 
                  onClick={() => updateQuantity(flavor.id, -1)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-mono font-bold">
                  {cart[flavor.id] || 0}
                </span>
                <button 
                  onClick={() => updateQuantity(flavor.id, 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Sticky Footer Cart */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.footer 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-stone-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20"
          >
            <div className="max-w-2xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Tu Selección</p>
                    <button 
                      onClick={clearCart}
                      className="text-[10px] uppercase tracking-widest text-red-500 font-bold hover:underline opacity-60 hover:opacity-100 transition-opacity"
                    >
                      Vaciar
                    </button>
                  </div>
                  <p className="text-lg font-bold text-stone-800">{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
                </div>
                <div className="text-right">
                  {totalDiscount > 0 && (
                    <motion.div 
                      key={totalItems >= 6 ? 'gold' : 'green'}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`inline-flex items-center px-2 py-0.5 rounded-md border mb-1 shadow-sm ${
                        totalItems >= 6 
                          ? 'bg-amber-400 text-amber-950 border-amber-500' 
                          : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      }`}
                    >
                      <span className="text-[10px] font-black uppercase tracking-tighter">
                        {totalItems >= 6 ? '¡Súper Ahorro ' : 'Ahorras '} {totalDiscount} Bs.!
                      </span>
                    </motion.div>
                  )}
                  <p className="text-3xl font-mono font-black tracking-tighter text-stone-900">{totalPrice.toFixed(0)} Bs.</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <button 
                  onClick={handlePlaceOrder}
                  disabled={isOrdering}
                  className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-lg uppercase tracking-tight flex items-center justify-center gap-3 hover:bg-emerald-700 active:scale-[0.98] shadow-lg shadow-emerald-200 transition-all disabled:opacity-50"
                >
                  {isOrdering ? (
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    >
                      <Send className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <>
                      <span>Confirmar Pedido</span>
                      <Send className="w-5 h-5 fill-current" />
                    </>
                  )}
                </button>
                <p className="text-center text-[10px] text-stone-400 font-medium uppercase tracking-widest">
                  Se abrirá un mensaje listo para enviar por WhatsApp
                </p>
              </div>
            </div>
          </motion.footer>
        )}
      </AnimatePresence>

      {/* Empty State Hint */}
      {totalItems === 0 && (
        <div className="fixed bottom-8 left-0 right-0 text-center pointer-events-none">
          <p className="text-stone-400 text-xs font-medium uppercase tracking-widest animate-pulse">
            Selecciona items para empezar tu pedido
          </p>
        </div>
      )}

      {/* Botón fijo de WhatsApp */}
      <a
        href={quickWhatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-4 z-50 bg-emerald-600 text-white p-3 rounded-full shadow-2xl shadow-emerald-600/40 hover:scale-105 transition-transform flex items-center gap-2"
      >
        <span className="sr-only">WhatsApp - ¿Tienes alguna consulta?</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
          <path d="M17.472 14.382c-.297-.148-1.758-.867-2.03-.967-.272-.1-.47-.148-.668.149-.195.297-.769.967-.942 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.173.198-.297.297-.495.099-.198.05-.372-.025-.52-.075-.148-.668-1.611-.915-2.205-.242-.579-.487-.5-.668-.51l-.57-.01c-.199 0-.52.075-.792.372s-1.04 1.016-1.04 2.478 1.065 2.87 1.213 3.074 2.1 3.2 5.076 4.487c.71.306 1.26.489 1.69.626.71.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z" />
          <path d="M12.004 2.003a9.937 9.937 0 0 0-8.946 5.008C1.617 9.221 1.5 10.408 1.5 12c0 2.383 1.016 4.597 2.789 6.268L2 22l3.859-1.01a9.908 9.908 0 0 0 6.145 1.822h.004c2.42 0 4.695-.936 6.406-2.639C21.513 16.643 22.5 14.37 22.5 12c0-5.52-4.48-9.997-10.496-9.997zm0 18.018h-.004a8.062 8.062 0 0 1-4.102-1.112l-.293-.174-2.28.598.611-2.233-.19-.355a8.025 8.025 0 0 1-1.199-4.354c0-4.418 3.584-8.003 8.002-8.003 4.42 0 8.004 3.585 8.004 8.003-.003 4.418-3.587 8.003-8.007 8.003z" />
        </svg>
        <span className="text-sm font-bold">¿Tienes alguna consulta?</span>
      </a>
    </div>
  );
}
