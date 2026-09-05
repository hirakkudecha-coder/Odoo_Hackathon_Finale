import React from 'react';
import { 
  X, 
  Download, 
  FileText, 
  CheckCircle2 
} from 'lucide-react';
import { generatePdfHtml, downloadDirectPdf } from '../../utils/pdfGenerator';

export const DocumentPdfModal = ({ isOpen, onClose, documentData }) => {
  if (!isOpen || !documentData) return null;

  const htmlContent = generatePdfHtml(documentData);

  const handleDownloadPdf = () => {
    downloadDirectPdf(documentData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#141A17]/60 backdrop-blur-xs animate-in fade-in duration-200">
      
      {/* Modal Card */}
      <div className="bg-[#FAF8F5] w-full max-w-5xl h-[92vh] max-h-[900px] rounded-3xl border border-[#E8E1D5] shadow-2xl flex flex-col overflow-hidden text-[#141A17]">
        
        {/* Top Header Bar */}
        <div className="px-6 py-4 bg-white border-b border-[#EAE3D7] flex items-center justify-between gap-4 shrink-0">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F4EFE6] text-[#1C3A2F] flex items-center justify-center border border-[#E5DDD0] shadow-2xs shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-luxury font-bold text-base sm:text-lg text-[#141A17] tracking-tight">
                  {documentData.title || 'Document Preview'}
                </h3>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-[#FAF4EB] text-[#1C3A2F] border border-[#E5DDD0]">
                  {documentData.documentNo || 'REF-001'}
                </span>
              </div>
              <p className="text-[11px] text-[#6B7A74] mt-0.5">
                Audited & verified official document ready for instant PDF download.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Direct PDF Download CTA */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#1C3A2F] hover:bg-[#142C23] text-[#FAF8F5] text-xs font-semibold rounded-xl shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer"
              title="Download official PDF directly"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-[#738C80] hover:text-[#141A17] hover:bg-[#ECE6DC] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Document Preview Canvas (Simulated A4 Paper) */}
        <div className="flex-1 bg-[#EBE5DB] overflow-y-auto p-4 sm:p-8 flex justify-center items-start">
          <div className="w-full max-w-212.5 bg-white shadow-xl rounded-xl border border-[#D8CFBF] overflow-hidden">
            <iframe
              title="PDF Document Preview"
              srcDoc={htmlContent}
              className="w-full h-225 border-none block"
            />
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="px-6 py-3 bg-white border-t border-[#EAE3D7] flex items-center justify-between text-xs text-[#55665E] shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
            <span className="text-[11px]">
              Ready for statutory GST filing, customer delivery, and internal archiving.
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#8A9B93]">
            Format: Standard A4 High-DPI Vector PDF
          </span>
        </div>

      </div>

    </div>
  );
};

export default DocumentPdfModal;
