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
  Eye
} from 'lucide-react';
import { DocumentPdfModal } from '../DocumentPdfModal';
import { createMasterRegisterPdfData, downloadDirectPdf } from '../../../utils/pdfGenerator';

export const ProductsTable = ({ onCreateProduct }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState('All');
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortAsc, setSortAsc] = useState(false);
  const [activeRowMenuId, setActiveRowMenuId] = useState(null);
  const [selectedPdfDoc, setSelectedPdfDoc] = useState(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const initialProducts = [
    {
      id: 1,
      sku: 'FUR-OCH-001',
      name: 'Olive Velvet Lounge Chair',
      category: 'Living Room Seating',
      costPrice: '₹ 14,200.00',
      salesPrice: '₹ 24,500.00',
      stock: '18 units',
      status: 'In Stock',
      statusDot: 'bg-[#10B981]',
      statusStyle: 'bg-[#E5F7ED] text-[#1E7445]',
    },
    {
      id: 2,
      sku: 'FUR-MCR-002',
      name: 'Minimalist Oak Credenza',
      category: 'Storage & Cabinetry',
      costPrice: '₹ 28,000.00',
      salesPrice: '₹ 46,000.00',
      stock: '6 units',
      status: 'Low Stock',
      statusDot: 'bg-[#F59E0B]',
      statusStyle: 'bg-[#FEF7EC] text-[#D97706]',
    },
    {
      id: 3,
      sku: 'FUR-BSO-003',
      name: 'Nordic Royal Blue Sofa (3-Seater)',
      category: 'Living Room Sofas',
      costPrice: '₹ 42,000.00',
      salesPrice: '₹ 72,000.00',
      stock: '12 units',
      status: 'In Stock',
      statusDot: 'bg-[#10B981]',
      statusStyle: 'bg-[#E5F7ED] text-[#1E7445]',
    },
    {
      id: 4,
      sku: 'FUR-WDT-004',
      name: 'Walnut Solid Wood Dining Table',
      category: 'Dining Furniture',
      costPrice: '₹ 32,500.00',
      salesPrice: '₹ 58,000.00',
      stock: '9 units',
      status: 'In Stock',
      statusDot: 'bg-[#10B981]',
      statusStyle: 'bg-[#E5F7ED] text-[#1E7445]',
    },
    {
      id: 5,
      sku: 'FUR-RAC-005',
      name: 'Handcrafted Rattan Accent Chair',
      category: 'Accent Furniture',
      costPrice: '₹ 9,500.00',
      salesPrice: '₹ 18,200.00',
      stock: '24 units',
      status: 'In Stock',
      statusDot: 'bg-[#10B981]',
      statusStyle: 'bg-[#E5F7ED] text-[#1E7445]',
    },
  ];

  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch('/api/products', { headers });
        if (res.ok) {
          const json = await res.json();
          if (json.products && Array.isArray(json.products) && json.products.length > 0) {
            const mapped = json.products.map((p, idx) => {
              const cp = `₹ ${Number(p.costPrice || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
              const sp = `₹ ${Number(p.salesPrice || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
              const sku = p.code || `UF-PRD-${String(idx + 1).padStart(3, '0')}`;
              const inStock = p.status === 'active';

              return {
                id: p._id || idx + 1,
                sku,
                name: p.name,
                type: p.type || 'Goods',
                category: p.category || 'General Furniture',
                costPrice: cp,
                salesPrice: sp,
                stock: inStock ? '15 units' : '0 units',
                status: inStock ? 'In Stock' : 'Out of Stock',
                statusDot: inStock ? 'bg-[#10B981]' : 'bg-[#EF4444]',
                statusStyle: inStock ? 'bg-[#E5F7ED] text-[#1E7445]' : 'bg-[#FDECE7] text-[#C95426]'
              };
            });
            if (isMounted) setProducts(mapped);
          }
        }
      } catch (err) {
        console.warn('Live products fetch error, using fallback:', err.message);
      } finally {
        if (isMounted) setIsLoading(false);
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
    status: 'In Stock',
  });

  const filterTabs = ['All', 'Living Room', 'Dining Furniture', 'Storage', 'Low Stock'];

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (activeFilterTab === 'Low Stock') result = result.filter((p) => p.status === 'Low Stock');
    else if (activeFilterTab !== 'All') result = result.filter((p) => p.category.toLowerCase().includes(activeFilterTab.toLowerCase()));

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) =>
        p.sku.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => {
      return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    });
    return result;
  }, [products, searchQuery, activeFilterTab, sortAsc]);

  const itemsPerPage = 5;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const handleOpenCreateModal = () => {
    if (onCreateProduct) {
      onCreateProduct();
    } else {
      setIsCreateModalOpen(true);
    }
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!newProductForm.sku || !newProductForm.name || !newProductForm.salesPrice) return;

    const nextId = products.length + 1;
    const isLowStock = newProductForm.status === 'Low Stock';
    const statusStyle = isLowStock ? 'bg-[#FEF7EC] text-[#D97706]' : 'bg-[#E5F7ED] text-[#1E7445]';
    const statusDot = isLowStock ? 'bg-[#F59E0B]' : 'bg-[#10B981]';

    const newEntry = {
      id: nextId,
      sku: newProductForm.sku,
      name: newProductForm.name,
      category: newProductForm.category,
      costPrice: newProductForm.costPrice.startsWith('₹') ? newProductForm.costPrice : `₹ ${newProductForm.costPrice}`,
      salesPrice: newProductForm.salesPrice.startsWith('₹') ? newProductForm.salesPrice : `₹ ${newProductForm.salesPrice}`,
      stock: newProductForm.stock.includes('units') ? newProductForm.stock : `${newProductForm.stock} units`,
      status: newProductForm.status,
      statusDot,
      statusStyle,
    };

    setProducts([newEntry, ...products]);
    setIsCreateModalOpen(false);
    setNewProductForm({
      sku: '',
      name: '',
      category: 'Living Room Seating',
      costPrice: '',
      salesPrice: '',
      stock: '',
      status: 'In Stock',
    });
  };

  const handleToggleStockStatus = (productId) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const nextStatus = p.status === 'In Stock' ? 'Low Stock' : 'In Stock';
          const nextStyle = nextStatus === 'In Stock' ? 'bg-[#E5F7ED] text-[#1E7445]' : 'bg-[#FEF7EC] text-[#D97706]';
          const nextDot = nextStatus === 'In Stock' ? 'bg-[#10B981]' : 'bg-[#F59E0B]';
          return { ...p, status: nextStatus, statusStyle: nextStyle, statusDot: nextDot };
        }
        return p;
      })
    );
    setActiveRowMenuId(null);
  };

  const handleViewProductPdf = (p) => {
    const pdfData = {
      type: 'PRODUCT',
      title: 'PRODUCT VALUATION & INVENTORY SPECIFICATION',
      documentNo: p.sku,
      date: '02 Sep 2025',
      dueDate: 'Current Stock Valuation',
      status: p.status,
      partner: {
        name: p.name,
        company: `Category: ${p.category}`,
        city: 'Ahmedabad, Gujarat',
      },
      tableData: {
        headers: ['Specification Field', 'Details'],
        rows: [
          ['Item Name', p.name],
          ['SKU Code', p.sku],
          ['Category', p.category],
          ['Cost Price (Materials & Labor)', p.costPrice],
          ['Catalog Sales Price (MSRP)', p.salesPrice],
          ['Warehouse Inventory Stock', `${p.stock} (${p.status})`],
        ],
      },
      notes: 'Official product valuation catalog item synchronized with Urban Furniture central inventory.',
    };

    setSelectedPdfDoc(pdfData);
    setIsPdfModalOpen(true);
    setActiveRowMenuId(null);
  };

  const handleDownloadProductPdfDirect = (p) => {
    const pdfData = {
      type: 'PRODUCT',
      title: 'PRODUCT VALUATION & INVENTORY SPECIFICATION',
      documentNo: p.sku,
      date: '02 Sep 2025',
      dueDate: 'Current Stock Valuation',
      status: p.status,
      partner: {
        name: p.name,
        company: `Category: ${p.category}`,
        city: 'Ahmedabad, Gujarat',
      },
      tableData: {
        headers: ['Specification Field', 'Details'],
        rows: [
          ['Item Name', p.name],
          ['SKU Code', p.sku],
          ['Category', p.category],
          ['Cost Price (Materials & Labor)', p.costPrice],
          ['Catalog Sales Price (MSRP)', p.salesPrice],
          ['Warehouse Inventory Stock', `${p.stock} (${p.status})`],
        ],
      },
      notes: 'Official product valuation catalog item synchronized with Urban Furniture central inventory.',
    };

    downloadDirectPdf(pdfData);
    setActiveRowMenuId(null);
  };

  const handleExportPdf = () => {
    const headers = ['SKU', 'Product Name', 'Category', 'Cost Price', 'Sales Price', 'Stock', 'Status'];
    const rows = filteredProducts.map((p) => [
      p.sku,
      p.name,
      p.category,
      p.costPrice,
      p.salesPrice,
      p.stock,
      p.status,
    ]);

    const pdfData = createMasterRegisterPdfData('Products & Finished Goods Inventory Register', headers, rows);
    downloadDirectPdf(pdfData);
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E8E1D5] shadow-xs overflow-hidden transition-all duration-300">
      
      {/* 1. Header */}
      <div className="p-5 sm:p-6 border-b border-[#F0EAE1] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#F4EFE6] text-[#1C3A2F] flex items-center justify-center border border-[#E5DDD0] shadow-2xs shrink-0">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#141A17] tracking-tight">
              Products & Inventory Master
            </h2>
            <p className="text-xs text-[#6B7A74] mt-0.5">
              Manage furniture catalog items, bill of materials, and selling prices.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
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
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button 
            type="button" 
            onClick={() => setSortAsc(!sortAsc)}
            className="inline-flex items-center gap-1.5 bg-white border border-[#E2DAD0] hover:bg-[#F5EFE6] text-[#4A5952] text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors cursor-pointer shadow-2xs"
            title="Toggle alphabetical sort"
          >
            <Filter className="w-3.5 h-3.5 text-[#738C80]" />
            <span>{sortAsc ? 'Name (A-Z)' : 'Name (Z-A)'}</span>
          </button>
          <button 
            type="button" 
            onClick={handleExportPdf}
            className="inline-flex items-center gap-1.5 bg-white border border-[#E2DAD0] hover:bg-[#F5EFE6] text-[#4A5952] text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors cursor-pointer shadow-2xs"
            title="Generate & Export PDF"
          >
            <Download className="w-3.5 h-3.5 text-[#738C80]" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* 3. Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-187.5">
          <thead>
            <tr className="border-b border-[#EAE3D7] bg-[#F7F4EE] text-[11px] font-bold text-[#55665E] uppercase tracking-wider">
              <th className="py-3.5 pl-6 pr-3">SKU</th>
              <th className="py-3.5 px-3">Product Name</th>
              <th className="py-3.5 px-3">Category</th>
              <th className="py-3.5 px-3">Cost Price</th>
              <th className="py-3.5 px-3">Sales Price</th>
              <th className="py-3.5 px-3">Stock</th>
              <th className="py-3.5 px-3">Status</th>
              <th className="py-3.5 pr-6 pl-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0EAE1] text-xs text-[#141A17]">
            {paginatedProducts.map((p) => {
              const isMenuOpen = activeRowMenuId === p.id;

              return (
                <tr key={p.id} className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="py-3.5 pl-6 pr-3">
                    <button
                      type="button"
                      onClick={() => handleViewProductPdf(p)}
                      className="font-semibold text-[#1C3A2F] hover:underline font-mono inline-flex items-center gap-1.5 cursor-pointer text-left group"
                      title="Click to view product specification PDF"
                    >
                      <span>{p.sku}</span>
                      <FileText className="w-3 h-3 text-[#738C80] group-hover:text-[#1C3A2F]" />
                    </button>
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-[#141A17]">{p.name}</td>
                  <td className="py-3.5 px-3 text-[#55665E]">{p.category}</td>
                  <td className="py-3.5 px-3 text-[#55665E] font-serif">{p.costPrice}</td>
                  <td className="py-3.5 px-3 font-bold font-serif text-[#141A17]">{p.salesPrice}</td>
                  <td className="py-3.5 px-3 font-medium text-[#141A17]">{p.stock}</td>
                  <td className="py-3.5 px-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${p.statusStyle} shadow-2xs`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${p.statusDot}`} />
                      <span>{p.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 pr-6 pl-3 text-right">
                    <div className="flex items-center justify-end gap-1 relative">
                      <button 
                        type="button" 
                        onClick={() => handleDownloadProductPdfDirect(p)}
                        className="p-1.5 rounded-lg text-[#738C80] hover:text-[#1C3A2F] hover:bg-[#EAE4DC] transition-colors cursor-pointer"
                        title="Download Product Specification PDF"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setActiveRowMenuId(isMenuOpen ? null : p.id)}
                        className="p-1.5 rounded-lg text-[#738C80] hover:text-[#141A17] hover:bg-[#EAE4DC] transition-colors cursor-pointer"
                        title="More options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Context Menu */}
                      {isMenuOpen && (
                        <div className="absolute right-0 top-8 z-30 w-48 bg-white rounded-xl shadow-lg border border-[#E8E1D5] py-1 text-left">
                          <button
                            type="button"
                            onClick={() => handleViewProductPdf(p)}
                            className="w-full px-3.5 py-2 text-xs text-[#141A17] hover:bg-[#FAF8F5] flex items-center gap-2 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#1C3A2F]" />
                            <span>View Spec PDF</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownloadProductPdfDirect(p)}
                            className="w-full px-3.5 py-2 text-xs text-[#141A17] hover:bg-[#FAF8F5] flex items-center gap-2 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5 text-[#1C3A2F]" />
                            <span>Download PDF</span>
                          </button>
                          <div className="border-t border-[#F0EAE1] my-1"></div>
                          <button
                            type="button"
                            onClick={() => handleToggleStockStatus(p.id)}
                            className="w-full px-3.5 py-2 text-xs text-[#1C3A2F] font-semibold hover:bg-[#FAF8F5] flex items-center gap-2 cursor-pointer"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>{p.status === 'In Stock' ? 'Mark Low Stock' : 'Mark In Stock'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 4. Pagination */}
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
            className="p-1.5 rounded-lg border border-[#E2DAD0] bg-white hover:bg-[#F2ECE4] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
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
            className="p-1.5 rounded-lg border border-[#E2DAD0] bg-white hover:bg-[#F2ECE4] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Create Product Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-[#E8E1D5] shadow-2xl max-w-md w-full overflow-hidden text-left animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-[#F0EAE1] flex items-center justify-between bg-[#FAF8F5]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#1C3A2F] text-white flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-luxury font-bold text-base text-[#141A17]">Add Product Item</h3>
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
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#141A17] mb-1">SKU Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FUR-TBL-006"
                    value={newProductForm.sku}
                    onChange={(e) => setNewProductForm({ ...newProductForm, sku: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F] focus:ring-1 focus:ring-[#1C3A2F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#141A17] mb-1">Type</label>
                  <select
                    value={newProductForm.type}
                    onChange={(e) => setNewProductForm({ ...newProductForm, type: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
                  >
                    <option value="Goods">Goods (Stockable)</option>
                    <option value="Service">Service</option>
                    <option value="Combo">Combo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#141A17] mb-1">Category</label>
                  <select
                    value={newProductForm.category}
                    onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
                  >
                    <option value="Living Room Seating">Living Room Seating</option>
                    <option value="Living Room Sofas">Living Room Sofas</option>
                    <option value="Dining Furniture">Dining Furniture</option>
                    <option value="Storage & Cabinetry">Storage & Cabinetry</option>
                    <option value="Accent Furniture">Accent Furniture</option>
                    <option value="General Furniture">General Furniture</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#141A17] mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scandinavian Teak Wood Coffee Table"
                  value={newProductForm.name}
                  onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#141A17] mb-1">Cost Price (INR)</label>
                  <input
                    type="text"
                    placeholder="e.g. 12000"
                    value={newProductForm.costPrice}
                    onChange={(e) => setNewProductForm({ ...newProductForm, costPrice: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#141A17] mb-1">Sales Price (INR)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 21500"
                    value={newProductForm.salesPrice}
                    onChange={(e) => setNewProductForm({ ...newProductForm, salesPrice: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#141A17] mb-1">Stock Quantity</label>
                  <input
                    type="text"
                    placeholder="e.g. 15"
                    value={newProductForm.stock}
                    onChange={(e) => setNewProductForm({ ...newProductForm, stock: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
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
                  className="px-4 py-2 rounded-xl bg-[#1C3A2F] hover:bg-[#142C23] text-white font-semibold cursor-pointer shadow-xs"
                >
                  Save Product
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
