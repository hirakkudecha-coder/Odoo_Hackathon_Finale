import React, { useState } from 'react';
import { ArrowUpRight, Plus, Check, ShoppingCart, Tag, Sparkles } from 'lucide-react';
import oliveChair from '../../assets/images/olive_chair.png';
import sandDaybed from '../../assets/images/sand_daybed.png';
import charcoalChair from '../../assets/images/charcoal_chair.png';

export const ProductCatalogSection = ({ onOpenAuth }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const products = [
    {
      id: 'UF-01',
      name: 'Olive Velvet Lounge Chair',
      category: 'Seating & Lounge',
      price: '₹37,900',
      accountCategory: 'Finished Goods Asset',
      taxRate: '18% GST Included',
      stock: '28 In Stock',
      image: oliveChair,
      sku: 'UF-ARM-OLV',
    },
    {
      id: 'UF-02',
      name: 'Minimalist Sand Daybed & Sofa',
      category: 'Living Room',
      price: '₹54,900',
      accountCategory: 'Finished Goods Asset',
      taxRate: '18% GST Included',
      stock: '14 In Stock',
      image: sandDaybed,
      sku: 'UF-SOF-SND',
    },
    {
      id: 'UF-03',
      name: 'Charcoal Studio Armchair',
      category: 'Executive Decor',
      price: '₹62,900',
      accountCategory: 'Finished Goods Asset',
      taxRate: '18% GST Included',
      stock: '09 In Stock',
      image: charcoalChair,
      sku: 'UF-ARM-CHR',
    },
  ];

  return (
    <section id="catalogue" className="py-20 bg-[#FAF8F5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Block with Editorial Layout */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-[#E8E1D5] reveal">
          <div className="max-w-xl">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#2D4A3E] block mb-2">
              Product Master & Inventory Assets
            </span>
            <h2 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl text-[#141A17] tracking-tight">
              Turning spaces into places you love
            </h2>
          </div>

          <div className="max-w-xs text-left md:text-right">
            <p className="text-xs font-bold uppercase tracking-widest text-[#141A17]">
              Furniture That Lasts a Lifetime
            </p>
            <p className="text-xs text-[#66726D] mt-1">
              Every item is tracked from supplier purchase bill to customer sales invoice.
            </p>
          </div>
        </div>

        {/* 3 Product Cards Grid matching the reference boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((item, idx) => (
            <div
              key={item.id}
              className={`rounded-3xl bg-white p-6 border border-[#E6DFD4] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group reveal reveal-scale ${idx === 0 ? 'delay-100' : idx === 1 ? 'delay-200' : 'delay-300'
                }`}
            >
              <div>
                {/* Product Image Stage with soft ivory backdrop */}
                <div className="relative h-64 sm:h-72 rounded-2xl bg-[#F8F5EE] p-6 flex items-center justify-center overflow-hidden mb-6 group-hover:bg-[#F2ECE1] transition-colors">

                  {/* Floating SKU / Account Category Tag */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] font-semibold text-[#2D4A3E] border border-[#2D4A3E]/10">
                    {item.sku}
                  </div>

                  <div className="absolute top-3 right-3 bg-[#2D4A3E]/10 px-2 py-0.5 rounded-md text-[10px] font-bold text-[#2D4A3E]">
                    {item.stock}
                  </div>

                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Info */}
                <div className="space-y-1">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-[#6A7570]">
                    {item.category}
                  </span>
                  <h3 className="font-serif-luxury font-bold text-xl text-[#141A17] group-hover:text-[#2D4A3E] transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-[#55635D] pt-0.5">
                    Account: <span className="font-semibold text-[#141A17]">{item.accountCategory}</span>
                  </p>
                </div>
              </div>

              {/* Card Footer: Action & Price */}
              <div className="flex items-center justify-between pt-6 mt-4 border-t border-[#EAE3D8]">
                <button
                  onClick={() => onOpenAuth && onOpenAuth('signup')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2D4A3E] hover:text-[#E86034] transition-colors cursor-pointer group/btn"
                >
                  <span>Create Invoice</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </button>

                <div className="text-right">
                  <span className="text-lg font-bold text-[#141A17] font-serif">
                    {item.price}
                  </span>
                  <span className="block text-[9px] uppercase tracking-wider text-[#68736E]">
                    {item.taxRate}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Reference Badge Bar below Products */}
        <div className="mt-12 flex flex-wrap items-center justify-between p-4 rounded-2xl bg-[#FAF5EE] border border-[#E6DFD4] gap-4 reveal delay-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#E86034] text-white flex items-center justify-center text-xs font-bold">
              ✓
            </div>
            <div>
              <p className="text-xs font-bold text-[#141A17]">Automated Cost of Goods Sold (COGS)</p>
              <p className="text-[11px] text-[#6A7670]">Auto-credited from inventory assets and debited to COGS on delivery validation.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#2D4A3E]">
              Chart of Accounts Sync
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
        </div>

      </div>
    </section>
  );
};
