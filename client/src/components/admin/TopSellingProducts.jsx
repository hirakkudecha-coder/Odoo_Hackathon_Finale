import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import creamLoungeChair from '../../assets/images/cream_lounge_chair.png';
import oakCredenza from '../../assets/images/oak_credenza.png';
import charcoalChair from '../../assets/images/charcoal_chair.png';
import cyanArmchair from '../../assets/images/cyan_armchair.png';
import yellowOttoman from '../../assets/images/yellow_ottoman.png';

const STATIC_IMAGES = [charcoalChair, oakCredenza, creamLoungeChair, cyanArmchair, yellowOttoman];

const STATIC_FALLBACK = [
  { rank: 1, name: 'Ergonomic Office Chair', units: '32 units', revenue: '₹ 96,000', image: charcoalChair },
  { rank: 2, name: 'Wooden Dining Table', units: '18 units', revenue: '₹ 90,000', image: oakCredenza },
  { rank: 3, name: 'Bookshelf Classic', units: '15 units', revenue: '₹ 67,500', image: creamLoungeChair },
  { rank: 4, name: 'Modern Sofa', units: '8 units', revenue: '₹ 64,000', image: cyanArmchair },
  { rank: 5, name: 'Study Table', units: '12 units', revenue: '₹ 48,000', image: yellowOttoman },
];

export const TopSellingProducts = () => {
  const [filter, setFilter] = useState('This Month');
  const [products, setProducts] = useState(STATIC_FALLBACK);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const res = await fetch('/api/products', { headers });
        if (res.ok) {
          const data = await res.json();
          const items = data.products || data.data || [];
          if (items.length > 0) {
            const mapped = items.slice(0, 5).map((p, idx) => ({
              rank: idx + 1,
              name: p.name || `Product ${idx + 1}`,
              units: `—`,
              revenue: `₹ ${Number(p.salesPrice || 0).toLocaleString('en-IN')}`,
              image: STATIC_IMAGES[idx % STATIC_IMAGES.length],
            }));
            setProducts(mapped);
          }
        }
      } catch (err) {
        // Fallback to static
      }
    };

    fetchProducts();
  }, []);



  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E8E1D5] shadow-2xs hover:shadow-md transition-shadow duration-300 text-left h-full flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#F0EAE1]">
        <h3 className="font-serif font-bold text-base sm:text-lg text-[#141A17]">
          Top Selling Products
        </h3>

        <button className="flex items-center gap-1.5 text-[11px] font-semibold text-[#4A5550] bg-[#FAF8F5] border border-[#E4DCD0] px-2.5 py-1 rounded-lg hover:bg-[#F2ECE3] hover:text-[#2D4A3E] transition-all cursor-pointer shadow-2xs">
          <span>{filter}</span>
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      {/* Product Rows */}
      <div className="space-y-2 my-auto">
        {products.map((item) => (
          <div 
            key={item.rank}
            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FAF6F0] hover:border hover:border-[#E8E1D5]/60 hover:shadow-2xs transition-all duration-200 text-xs cursor-pointer group"
          >
            {/* Rank & Image & Name */}
            <div className="flex items-center gap-3">
              <span className="w-4 text-center font-bold text-[#8E9B95] text-[11px] group-hover:text-[#2D4A3E] transition-colors">
                {item.rank}
              </span>
              <div className="w-9 h-9 rounded-lg bg-[#F5F1EA] p-1 flex items-center justify-center shrink-0 border border-[#E8E1D5] overflow-hidden group-hover:border-[#2D4A3E]/30 shadow-2xs">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-contain group-hover:scale-115 transition-transform duration-300"
                />
              </div>
              <span className="font-semibold text-[#141A17] text-xs group-hover:text-[#2D4A3E] transition-colors">
                {item.name}
              </span>
            </div>

            {/* Units & Revenue */}
            <div className="flex items-center gap-6 text-right">
              <span className="text-[#6D7D76] text-[11px]">
                {item.units}
              </span>
              <span className="font-serif font-bold text-[#141A17] w-20 group-hover:text-[#2D4A3E] transition-colors">
                {item.revenue}
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default TopSellingProducts;
