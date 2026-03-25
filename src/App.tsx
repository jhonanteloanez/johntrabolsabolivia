/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { ShoppingCart, Plus, Minus, Send, CheckCircle2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Flavor {
  id: string;
  name: string;
  description: string;
  color: string;
  price: number;
  image?: string;
}

const FLAVORS: Flavor[] = [
  { id: 'fresh-mint', name: 'Fresh Mint 6.5mg', description: 'Experiencia refrescante de menta suave.', color: 'bg-sky-100 border-sky-200 text-sky-900', price: 70, image: 'https://storage.googleapis.com/m-infra.appspot.com/public/res/antigravity/fresh_mint.png' },
  { id: 'cucumber-lime', name: 'Cucumber Lime 6.5mg', description: 'Pepino fresco con un toque cítrico de lima.', color: 'bg-lime-100 border-lime-200 text-lime-900', price: 70 },
  { id: 'apple-mint', name: 'Apple Mint 9mg', description: 'Manzana dulce combinada con menta fresca.', color: 'bg-emerald-200 border-emerald-300 text-emerald-950', price: 70, image: 'https://storage.googleapis.com/m-infra.appspot.com/public/res/antigravity/apple_mint.png' },
  { id: 'pineapple-coconut', name: 'Pineapple Coconut 9mg', description: 'Escape tropical en cada bolsa.', color: 'bg-amber-200 border-amber-300 text-amber-950', price: 70, image: 'https://storage.googleapis.com/m-infra.appspot.com/public/res/antigravity/pineapple_coconut.png' },
  { id: 'purple-chill', name: 'Purple Chill 9mg', description: 'Relajante mezcla de bayas silvestres.', color: 'bg-fuchsia-100 border-fuchsia-200 text-fuchsia-900', price: 70 },
  { id: 'citrus', name: 'Citrus 9mg', description: 'Cítrico clásico, brillante y picante.', color: 'bg-orange-100 border-orange-200 text-orange-900', price: 70, image: 'https://storage.googleapis.com/m-infra.appspot.com/public/res/antigravity/citrus.png' },
];

export default function App() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [isOrdering, setIsOrdering] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);

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
    
    const rawNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '1234567890';
    // Clean number: remove all non-digits
    const whatsappNumber = rawNumber.replace(/\D/g, '');
    
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
              src="input_file_0.png" 
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

      <main className="max-w-2xl mx-auto px-4 py-8 pb-40">
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
    </div>
  );
}
