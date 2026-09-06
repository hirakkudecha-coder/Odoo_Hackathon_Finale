import React, { useState, useEffect, useMemo } from 'react';
import { 
  Package, 
  Search, 
  Plus, 
  Filter, 
  Download, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight,
  Printer,
  FileText,
  X,
  CheckCircle,
  Eye,
  Camera,
  Edit2,
  Tag,
  Layers,
  Sparkles
} from 'lucide-react';
import { ViewModeToggle } from '../../common/ViewModeToggle';
import { DocumentPdfModal } from '../DocumentPdfModal';
import { createMasterRegisterPdfData, downloadDirectPdf } from '../../../utils/pdfGenerator';

export const ProductsTable = ({ onCreateProduct }) => {
  const [viewMode, setViewMode] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedPdfDoc, setSelectedPdfDoc] = useState(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Dynamic Categories list
  const [categories, setCategories] = useState([
    'Living Room Seating',
    'Living Room Sofas',
    'Dining Furniture',
    'Storage & Cabinetry',
    'Accent Furniture',
    'Office Workspaces',
    'Lighting & Fixtures',
    'Design Services',
    'Packages'
  ]);
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState('');

  const initialProducts = [
    {
      id: 'p-1',
      sku: 'FUR-OCH-001',
      name: 'Olive Velvet Lounge Chair',
      type: 'Goods',
      category: 'Living Room Seating',
      image: oliveChairImg,
      costPrice: 14200,
      salesPrice: 24500,
      stock: 18,
      status: 'In Stock',
      statusDot: 'bg-[#10B981]',
      statusStyle: 'bg-[#E5F7ED] text-[#1E7445]',
    },
    {
      id: 'p-2',
      sku: 'FUR-MCR-002',
      name: 'Minimalist Oak Credenza',
      type: 'Goods',
      category: 'Storage & Cabinetry',
      image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=300&auto=format&fit=crop&q=80',
      costPrice: 28000,
      salesPrice: 46000,
      stock: 6,
      status: 'Low Stock',
      statusDot: 'bg-[#F59E0B]',
      statusStyle: 'bg-[#FEF7EC] text-[#D97706]',
    },
    {
      id: 'p-3',
      sku: 'FUR-BSO-003',
      name: 'Nordic Royal Blue Sofa (3-Seater)',
      type: 'Goods',
      category: 'Living Room Sofas',
      image: royalBlueSofa,
      costPrice: 42000,
      salesPrice: 72000,
      stock: 12,
      status: 'In Stock',
      statusDot: 'bg-[#10B981]',
      statusStyle: 'bg-[#E5F7ED] text-[#1E7445]',
    },
    {
      id: 'p-4',
      sku: 'FUR-WDT-004',
      name: 'Walnut Solid Wood Dining Table',
      type: 'Goods',
      category: 'Dining Furniture',
      image: diningTable,
      costPrice: 32500,
      salesPrice: 58000,
      stock: 9,
      status: 'In Stock',
      statusDot: 'bg-[#10B981]',
      statusStyle: 'bg-[#E5F7ED] text-[#1E7445]',
    },
    {
      id: 'p-5',
      sku: 'FUR-RAC-005',
      name: 'Handcrafted Cream Bouclé Lounge Chair',
      type: 'Goods',
      category: 'Accent Furniture',
      image: creamLoungeChair,
      costPrice: 9500,
      salesPrice: 18200,
      stock: 24,
      status: 'In Stock',
      statusDot: 'bg-[#10B981]',
      statusStyle: 'bg-[#E5F7ED] text-[#1E7445]',
    },
    {
      id: 'p-6',
      sku: 'SRV-DSG-006',
      name: 'Bespoke Atelier Space Planning & 3D Render',
      type: 'Service',
      category: 'Design Services',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=300&auto=format&fit=crop&q=80',
      costPrice: 8000,
      salesPrice: 28000,
      stock: 0,
      status: 'In Stock',
      statusDot: 'bg-[#10B981]',
      statusStyle: 'bg-[#E5F7ED] text-[#1E7445]',
    },
    {
      id: 'p-7',
      sku: 'CMB-EXE-007',
      name: 'Executive Suite Master Combo Package',
      type: 'Combo',
      category: 'Packages',
      image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=300&auto=format&fit=crop&q=80',
      costPrice: 185000,
      salesPrice: 295000,
      stock: 4,
      status: 'In Stock',
      statusDot: 'bg-[#10B981]',
      statusStyle: 'bg-[#E5F7ED] text-[#1E7445]',
    },
  ];

  const [products, setProducts] = useState(initialProducts);

  useEffect(() => {
    let isMounted = true;
    const loadProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch('/api/products', { headers });
        if (res.ok) {
          const json = await res.json();
          if (json.products && Array.isArray(json.products) && json.products.length > 0) {
            const mapped = json.products.map((p, idx) => {
              const type = p.type || 'Goods';
              const cost = Number(p.costPrice) || 0;
              const sales = Number(p.salesPrice) || 0;
              const stock = p.currentStock !== undefined ? p.currentStock : (type === 'Service' ? 0 : 15);
              const isLow = stock > 0 && stock <= 8;
              return {
                id: p._id || idx + 1,
                sku: p.sku || `FUR-${String(idx + 1).padStart(3, '0')}`,
                name: p.name,
                type,
                category: p.category || 'General',
                image: p.image || (idx % 2 === 0 ? oliveChairImg : creamLoungeChair),
                costPrice: cost,
                salesPrice: sales,
                stock,
                status: stock === 0 && type !== 'Service' ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock',
                statusDot: isLow ? 'bg-[#F59E0B]' : 'bg-[#10B981]',
                statusStyle: isLow ? 'bg-[#FEF7EC] text-[#D97706]' : 'bg-[#E5F7ED] text-[#1E7445]',
              };
            });
            if (isMounted) {
              setProducts(mapped);
              const extractedCats = Array.from(new Set(mapped.map(m => m.category))).filter(Boolean);
              setCategories(prev => Array.from(new Set([...prev, ...extractedCats])));
            }
          }
        }
      } catch (err) {
        console.warn('Live products fetch failed:', err.message);
      }
    };
    loadProducts();
    return () => { isMounted = false; };
  }, []);

  const [newProductForm, setNewProductForm] = useState({
    sku: '',
    name: '',
    type: 'Goods',
    category: 'Living Room Seating',
    costPrice: '',
    salesPrice: '',
    stock: '',
    image: '',
    status: 'In Stock',
  });

  const filterTabs = ['All', 'Goods', 'Service', 'Combo'];

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (activeFilterTab !== 'All') {
      result = result.filter((p) => p.type === activeFilterTab);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => {
      return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    });
    return result;
  }, [products, searchQuery, activeFilterTab, sortAsc]);

  const itemsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setIsAddingNewCategory(false);
    setNewProductForm({
      sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      name: '',
      type: 'Goods',
      category: categories[0] || 'Living Room Seating',
      costPrice: '',
      salesPrice: '',
      stock: '15',
      image: '',
      status: 'In Stock',
    });
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (p) => {
    setEditingProduct(p);
    setIsAddingNewCategory(false);
    setNewProductForm({
      sku: p.sku,
      name: p.name,
      type: p.type || 'Goods',
      category: p.category || 'General',
      costPrice: p.costPrice,
      salesPrice: p.salesPrice,
      stock: p.stock,
      image: p.image || '',
      status: p.status,
    });
    setIsCreateModalOpen(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProductForm(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddNewCategory = (e) => {
    e.preventDefault();
    if (!newCategoryInput.trim()) return;
    const cat = newCategoryInput.trim();
    if (!categories.includes(cat)) {
      setCategories([...categories, cat]);
    }
    setNewProductForm(prev => ({ ...prev, category: cat }));
    setNewCategoryInput('');
    setIsAddingNewCategory(false);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!newProductForm.name || !newProductForm.salesPrice) return;

    try {
      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const payload = {
        name: newProductForm.name,
        type: newProductForm.type,
        category: newProductForm.category,
        image: newProductForm.image,
        costPrice: Number(newProductForm.costPrice) || 0,
        salesPrice: Number(newProductForm.salesPrice) || 0,
        currentStock: Number(newProductForm.stock) || 0,
      };

      if (editingProduct) {
        const updated = products.map(p => p.id === editingProduct.id ? {
          ...p,
          ...payload,
          sku: newProductForm.sku,
          stock: payload.currentStock,
          status: payload.currentStock <= 5 ? 'Low Stock' : 'In Stock'
        } : p);
        setProducts(updated);
        await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(payload)
        }).catch(() => {});
      } else {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        }).catch(() => null);

        let savedProduct = {};
        if (res && res.ok) {
          const json = await res.json();
          savedProduct = json.product || {};
        }

        const nextId = savedProduct._id || `p-${Date.now()}`;
        const newEntry = {
          id: nextId,
          sku: newProductForm.sku,
          name: newProductForm.name,
          type: newProductForm.type,
          category: newProductForm.category,
          image: newProductForm.image || oliveChairImg,
          costPrice: payload.costPrice,
          salesPrice: payload.salesPrice,
          stock: payload.currentStock,
          status: newProductForm.status,
          statusDot: payload.currentStock <= 5 ? 'bg-[#F59E0B]' : 'bg-[#10B981]',
          statusStyle: payload.currentStock <= 5 ? 'bg-[#FEF7EC] text-[#D97706]' : 'bg-[#E5F7ED] text-[#1E7445]',
        };

        setProducts([newEntry, ...products]);
      }
    } catch (err) {
      console.error('Error saving product:', err);
    }

    setIsCreateModalOpen(false);
  };

  const handleToggleStockStatus = (productId) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const isCurrentlyIn = p.status === 'In Stock';
          return {
            ...p,
            status: isCurrentlyIn ? 'Low Stock' : 'In Stock',
            statusDot: isCurrentlyIn ? 'bg-[#F59E0B]' : 'bg-[#10B981]',
            statusStyle: isCurrentlyIn ? 'bg-[#FEF7EC] text-[#D97706]' : 'bg-[#E5F7ED] text-[#1E7445]',
          };
        }
        return p;
      })
    );
  };

  const handleViewProductPdf = (p) => {
    const pdfData = {
      type: 'PRODUCT',
      title: 'PRODUCT SPECIFICATION SHEET',
      documentNo: p.sku,
      date: new Date().toLocaleDateString('en-GB'),
      dueDate: 'Active Catalog SKU',
      status: p.status,
      partner: {
        name: p.name,
        email: `Category: ${p.category}`,
        phone: `Type: ${p.type}`,
        city: 'Luxury Atelier Collection',
      },
      tableData: {
        headers: ['Specification Attribute', 'Value'],
        rows: [
          ['Product Name', p.name],
          ['SKU Code', p.sku],
          ['Product Classification', p.type],
          ['Collection Category', p.category],
          ['Standard Cost Price', `₹ ${Number(p.costPrice).toLocaleString('en-IN')}`],
          ['Retail Sales Price', `₹ ${Number(p.salesPrice).toLocaleString('en-IN')}`],
          ['Current Available Stock', `${p.stock} units`],
          ['Stock Availability Status', p.status],
        ],
      },
      notes: 'Official Urban Furniture catalog document. Rates are inclusive of standard 18% GST.',
    };

    setSelectedPdfDoc(pdfData);
    setIsPdfModalOpen(true);
  };

  const handleExportPdf = () => {
    const headers = ['SKU', 'Product Name', 'Type', 'Category', 'Cost Price', 'Sales Price', 'Stock Status'];
    const rows = filteredProducts.map((p) => [
      p.sku,
      p.name,
      p.type,
      p.category,
      `₹ ${Number(p.costPrice).toLocaleString('en-IN')}`,
      `₹ ${Number(p.salesPrice).toLocaleString('en-IN')}`,
      p.status,
    ]);

    const pdfData = createMasterRegisterPdfData('Products Master Catalog', headers, rows);
    downloadDirectPdf(pdfData, 'Products_Master_Catalog.pdf');
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E8E1D5] shadow-xs overflow-hidden transition-all duration-300 space-y-0">
      
      {/* 1. Header */}
      <div className="p-5 sm:p-6 border-b border-[#F0EAE1] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#F4EFE6] text-[#1C3A2F] flex items-center justify-center border border-[#E5DDD0] shadow-2xs shrink-0">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#141A17] tracking-tight">
              Products Master
            </h2>
            <p className="text-xs text-[#6B7A74] mt-0.5">
              Manage furniture catalog, services, combo bundles, and prices.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          
          <div className="relative flex-1 md:w-56">
            <Search className="w-4 h-4 text-[#8A9B93] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl pl-9 pr-3 py-2 text-xs text-[#141A17] placeholder:text-[#8A9B93] focus:outline-hidden focus:border-[#1C3A2F] focus:ring-1 focus:ring-[#1C3A2F] transition-all"
            />
          </div>

          <button
            type="button"
            onClick={handleExportPdf}
            className="inline-flex items-center gap-1.5 bg-white border border-[#E2DAD0] hover:bg-[#F5EFE6] text-[#4A5952] text-xs font-semibold px-3 py-2 rounded-xl transition-colors cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 bg-[#1C3A2F] hover:bg-[#142C23] text-[#FAF8F5] text-xs font-semibold px-4 py-2 rounded-xl shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Product</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* 2. Filter Toolbar */}
      <div className="px-5 sm:px-6 py-3.5 bg-[#FAF8F5]/80 border-b border-[#F0EAE1] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveFilterTab(tab);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeFilterTab === tab
                  ? 'bg-[#1C3A2F] text-white shadow-2xs'
                  : 'bg-white text-[#5B6963] border border-[#E8E1D5] hover:bg-[#F2ECE4] hover:text-[#141A17]'
              }`}
            >
              {tab === 'All' ? 'All Catalog' : `${tab} Items`}
            </button>
          ))}
        </div>

        <button 
          type="button" 
          onClick={() => setSortAsc(!sortAsc)}
          className="inline-flex items-center gap-1.5 bg-white border border-[#E2DAD0] hover:bg-[#F5EFE6] text-[#4A5952] text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors cursor-pointer shadow-2xs"
        >
          <span>Sort: {sortAsc ? 'A-Z' : 'Z-A'}</span>
        </button>
      </div>

      {/* 3. VIEW: KANBAN MODE */}
      {viewMode === 'kanban' ? (
        <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedProducts.map((p) => (
            <div 
              key={p.id}
              className="bg-white rounded-3xl border border-[#E5DFD5] p-5 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 group overflow-hidden"
            >
              <div className="space-y-3.5">
                {/* Product Image Banner */}
                <div className="w-full h-40 bg-[#FAF8F5] rounded-2xl overflow-hidden relative border border-[#EBE4DA] flex items-center justify-center">
                  {p.image ? (
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <Package className="w-12 h-12 text-[#9AABA2]" />
                  )}

                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-[#14231C]/80 backdrop-blur-xs text-white text-[10px] font-mono font-bold">
                      {p.sku}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-[#1C3A2F] text-[10.5px] font-bold shadow-xs">
                      {p.type}
                    </span>
                  </div>

                  <span className={`absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs ${p.statusStyle}`}>
                    {p.status}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-[#84958C] uppercase tracking-wider block truncate">
                    {p.category}
                  </span>
                  <h3 className="font-serif font-bold text-base text-[#141A17] group-hover:text-[#1C3A2F] transition-colors line-clamp-2 leading-snug">
                    {p.name}
                  </h3>
                </div>

                {/* Prices & Stock Grid */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#F0EAE1] text-xs">
                  <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#EBE4DA]">
                    <span className="text-[10px] font-bold uppercase text-[#889890] block">Sales Price</span>
                    <span className="text-sm font-bold text-[#141A17]">
                      ₹ {Number(p.salesPrice).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#EBE4DA]">
                    <span className="text-[10px] font-bold uppercase text-[#889890] block">Cost Price</span>
                    <span className="text-sm font-semibold text-[#66776F]">
                      ₹ {Number(p.costPrice).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-[#F0EAE1] flex items-center justify-between">
                <span className="text-xs text-[#52645B] font-medium">
                  Stock: <strong className="text-[#141A17]">{p.stock} units</strong>
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleViewProductPdf(p)}
                    className="p-1.5 rounded-lg text-[#55665E] hover:bg-[#FAF8F5] cursor-pointer"
                    title="View Spec PDF"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(p)}
                    className="p-1.5 rounded-lg text-[#1C3A2F] hover:bg-[#FAF8F5] cursor-pointer"
                    title="Edit Product"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* 4. VIEW: TABLE LIST VIEW */
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#F0EAE1] text-[11px] font-bold text-[#55665E] uppercase tracking-wider">
                <th className="py-3 px-6">SKU / Item</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Cost Price</th>
                <th className="py-3 px-4 text-right">Sales Price</th>
                <th className="py-3 px-4 text-center">Stock</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EAE1] text-xs text-[#141A17]">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-[#7A8A82]">
                    No products found.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    <td className="py-3.5 px-6 font-bold text-[#141A17]">
                      <div className="flex items-center gap-3">
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="w-9 h-9 rounded-xl object-cover border border-[#DDD5C7] shrink-0" />
                        ) : (
                          <div className="w-9 h-9 rounded-xl bg-[#E8E1D5] flex items-center justify-center shrink-0">
                            <Package className="w-4 h-4 text-[#55665E]" />
                          </div>
                        )}
                        <div>
                          <div className="font-mono text-[10.5px] font-bold text-[#1C3A2F]">{p.sku}</div>
                          <div className="font-medium text-[#141A17]">{p.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#E2DAD0] font-bold text-[10.5px] text-[#2D4A3E]">
                        {p.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#55665E]">{p.category}</td>
                    <td className="py-3.5 px-4 text-right font-medium text-[#66776F]">
                      ₹ {Number(p.costPrice).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-[#141A17]">
                      ₹ {Number(p.salesPrice).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-center font-semibold text-[#141A17]">
                      {p.stock} units
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold ${p.statusStyle}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${p.statusDot}`} />
                        <span>{p.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleViewProductPdf(p)}
                          className="p-1.5 rounded-lg text-[#55665E] hover:bg-[#F2ECE4] hover:text-[#141A17] cursor-pointer"
                          title="View PDF Spec"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 rounded-lg text-[#55665E] hover:bg-[#F2ECE4] hover:text-[#141A17] cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 5. Pagination */}
      <div className="px-6 py-4 border-t border-[#F0EAE1] bg-[#FAF8F5]/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#55665E]">
        <span>
          Showing {filteredProducts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
          {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
        </span>
        <div className="flex items-center gap-1.5">
          <button 
            type="button" 
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-[#E2DAD0] bg-white hover:bg-[#F2ECE4] enabled:cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              type="button"
              onClick={() => setCurrentPage(pageNum)}
              className={`px-3 py-1 font-bold rounded-lg cursor-pointer transition-all ${
                currentPage === pageNum
                  ? 'bg-[#1C3A2F] text-white shadow-2xs'
                  : 'bg-white text-[#4A5952] border border-[#E2DAD0] hover:bg-[#F2ECE4]'
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button 
            type="button" 
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-[#E2DAD0] bg-white hover:bg-[#F2ECE4] enabled:cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Create / Edit Product Modal with Dynamic Category Creation & Image Upload */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-[#E8E1D5] shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto text-left animate-scaleUp">
            <div className="p-5 border-b border-[#F0EAE1] flex items-center justify-between bg-[#FAF8F5] sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#1C3A2F] text-white flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-luxury font-bold text-base text-[#141A17]">
                    {editingProduct ? 'Edit Product Item' : 'Add Product Item'}
                  </h3>
                  <p className="text-[11px] text-[#6B7A74]">Configure catalog SKU and inventory rates</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-[#6B7A74] hover:text-[#141A17] hover:bg-[#EAE4DC] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-5 space-y-4 text-xs">
              {/* Product Image Upload */}
              <div className="flex items-center gap-4 p-3 bg-[#FAF8F5] rounded-2xl border border-[#E5DFD5]">
                {newProductForm.image ? (
                  <img 
                    src={newProductForm.image} 
                    alt="Product Preview" 
                    className="w-16 h-16 rounded-2xl object-cover border border-[#DDD5C7]" 
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-[#E8E1D5] text-[#55665E] flex items-center justify-center">
                    <Camera className="w-6 h-6" />
                  </div>
                )}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#141A17]">Product Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="text-[11px] text-[#66776F] file:mr-2.5 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#1C3A2F] file:text-white hover:file:bg-[#142C23] file:cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#141A17] mb-1">SKU Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FUR-TBL-006"
                    value={newProductForm.sku}
                    onChange={(e) => setNewProductForm({ ...newProductForm, sku: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs font-mono text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#141A17] mb-1">Product Type *</label>
                  <select
                    value={newProductForm.type}
                    onChange={(e) => setNewProductForm({ ...newProductForm, type: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs font-bold text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
                  >
                    <option value="Goods">Goods (Stockable Product)</option>
                    <option value="Service">Service (Non-stockable)</option>
                    <option value="Combo">Combo (Bundle / Package)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#141A17] mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scandinavian Teak Wood Coffee Table"
                  value={newProductForm.name}
                  onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
                />
              </div>

              {/* Dynamic Category Selection & Creation */}
              <div className="p-3 bg-[#FAF8F5] rounded-2xl border border-[#E5DFD5] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-[#141A17]">Category (Relational)</label>
                  <button
                    type="button"
                    onClick={() => setIsAddingNewCategory(!isAddingNewCategory)}
                    className="text-[11px] font-bold text-[#1C3A2F] hover:underline cursor-pointer"
                  >
                    {isAddingNewCategory ? '← Select Existing' : '+ Add New Category'}
                  </button>
                </div>

                {isAddingNewCategory ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Acoustic Wall Panels"
                      value={newCategoryInput}
                      onChange={(e) => setNewCategoryInput(e.target.value)}
                      className="flex-1 bg-white border border-[#E2DAD0] rounded-xl px-3 py-1.5 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
                    />
                    <button
                      type="button"
                      onClick={handleAddNewCategory}
                      className="px-3 py-1.5 bg-[#1C3A2F] text-white rounded-xl font-semibold text-xs cursor-pointer shadow-2xs"
                    >
                      Add
                    </button>
                  </div>
                ) : (
                  <select
                    value={newProductForm.category}
                    onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                    className="w-full bg-white border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs font-semibold text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#141A17] mb-1">Cost Price (INR)</label>
                  <input
                    type="number"
                    placeholder="e.g. 12000"
                    value={newProductForm.costPrice}
                    onChange={(e) => setNewProductForm({ ...newProductForm, costPrice: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#141A17] mb-1">Sales Price (INR) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 21500"
                    value={newProductForm.salesPrice}
                    onChange={(e) => setNewProductForm({ ...newProductForm, salesPrice: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs font-bold text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#141A17] mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    disabled={newProductForm.type === 'Service'}
                    placeholder={newProductForm.type === 'Service' ? 'N/A' : 'e.g. 15'}
                    value={newProductForm.stock}
                    onChange={(e) => setNewProductForm({ ...newProductForm, stock: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F] disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#141A17] mb-1">Stock Status</label>
                  <select
                    value={newProductForm.status}
                    onChange={(e) => setNewProductForm({ ...newProductForm, status: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-[#F0EAE1] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E2DAD0] text-[#55665E] hover:bg-[#FAF8F5] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1C3A2F] hover:bg-[#142C23] text-white font-semibold cursor-pointer shadow-xs"
                >
                  {editingProduct ? 'Save Changes' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document PDF Modal */}
      <DocumentPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        documentData={selectedPdfDoc}
      />

    </div>
  );
};

export default ProductsTable;
