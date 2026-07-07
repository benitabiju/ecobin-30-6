import React, { useState } from 'react';
import { getMediaUrl } from '../utils/media';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Image as ImageIcon } from 'lucide-react';

export const ImageGallery = ({ images = [] }) => {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [scale, setScale] = useState(1);

  if (!images || images.length === 0) return null;

  const openLightbox = (idx) => {
    setLightboxIndex(idx);
    setScale(1);
  };

  const closeLightbox = () => setLightboxIndex(null);

  const prevImage = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    setScale(1);
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    setScale(1);
  };

  const handleZoom = (e, factor) => {
    e.stopPropagation();
    setScale(prev => Math.max(0.5, Math.min(prev + factor, 4)));
  };

  return (
    <div className="space-y-3 mt-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((img, idx) => (
          <div 
            key={img.image_id || idx} 
            className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:opacity-90 bg-gray-100 flex flex-col items-center justify-center group"
            onClick={() => openLightbox(idx)}
          >
            <img 
              src={getMediaUrl(img.image)} 
              alt="Preview" 
              className="w-full h-full object-cover" 
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden absolute inset-0 flex-col items-center justify-center text-muted gap-2">
              <ImageIcon className="w-6 h-6 opacity-50" />
              <span className="text-[10px] font-medium uppercase tracking-wider">Not Found</span>
            </div>
            {img.image_type && (
              <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] p-1.5 font-bold truncate text-center backdrop-blur-sm group-hover:bg-[#387478]/80 transition-colors">
                {img.image_type === 'citizen_upload' ? 'Citizen Upload' : img.image_type === 'collector_proof' ? 'Collector Proof' : 'Citizen Verification'}
              </div>
            )}
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4" 
          onClick={closeLightbox}
        >
          {/* Top Bar */}
          <div className="absolute top-0 inset-x-0 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent z-10" onClick={e => e.stopPropagation()}>
            <div className="text-white/80 text-sm font-medium">
              Image {lightboxIndex + 1} of {images.length}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/10 rounded-full p-1 backdrop-blur-sm">
                <button className="p-2 hover:bg-white/20 rounded-full text-white transition-colors" onClick={(e) => handleZoom(e, -0.25)}>
                  <ZoomOut className="w-5 h-5" />
                </button>
                <span className="text-xs font-bold text-white min-w-[4ch] text-center">{Math.round(scale * 100)}%</span>
                <button className="p-2 hover:bg-white/20 rounded-full text-white transition-colors" onClick={(e) => handleZoom(e, 0.25)}>
                  <ZoomIn className="w-5 h-5" />
                </button>
              </div>
              <button className="p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors" onClick={closeLightbox}>
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          {images.length > 1 && (
            <>
              <button 
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full backdrop-blur-sm transition-all z-10"
                onClick={prevImage}
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button 
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full backdrop-blur-sm transition-all z-10"
                onClick={nextImage}
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          {/* Main Image Container */}
          <div 
            className="w-full h-full flex items-center justify-center overflow-auto p-10"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative inline-block transition-transform duration-200 origin-center" style={{ transform: `scale(${scale})` }}>
              <img 
                src={getMediaUrl(images[lightboxIndex].image)} 
                alt="Full preview" 
                className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl shadow-2xl" 
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden flex-col items-center justify-center text-white/50 gap-4 min-w-[300px] min-h-[200px] bg-white/5 rounded-2xl border border-white/10">
                <ImageIcon className="w-12 h-12" />
                <span className="text-sm font-medium">Image could not be loaded</span>
              </div>
            </div>
          </div>
          
          {/* Metadata Footer */}
          <div className="absolute bottom-0 inset-x-0 p-6 flex flex-col items-center bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
            {images[lightboxIndex].image_type && (
              <div className="inline-block px-3 py-1 bg-[#387478] text-white rounded-full text-xs font-bold mb-2 shadow-lg">
                {images[lightboxIndex].image_type === 'citizen_upload' ? 'Citizen Upload' : images[lightboxIndex].image_type === 'collector_proof' ? 'Collector Proof' : 'Citizen Verification'}
              </div>
            )}
            {images[lightboxIndex].uploader_name && (
              <div className="text-white/80 text-sm font-semibold mb-1">
                By: {images[lightboxIndex].uploader_name}
              </div>
            )}
            {images[lightboxIndex].uploaded_at && (
              <div className="text-white/60 text-xs font-medium">
                Uploaded: {new Date(images[lightboxIndex].uploaded_at).toLocaleString()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
