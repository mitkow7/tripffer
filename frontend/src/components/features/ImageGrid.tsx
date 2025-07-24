import React, { useState } from "react";
import ImageViewer from "./ImageViewer";

interface ImageGridProps {
  images: { id: string | number; image: string }[];
  onShowAll: () => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, onShowAll }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  if (!images || images.length === 0) {
    return (
      <div className="bg-gray-200 h-96 w-full rounded-lg flex items-center justify-center">
        <span className="text-gray-500">No Images Available</span>
      </div>
    );
  }

  const mainImage = images[0];
  const otherImages = images.slice(1, 5);

  return (
    <>
      <div className="relative h-[450px] rounded-xl overflow-hidden group">
        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-full">
          <div
            className="col-span-2 row-span-2 cursor-pointer overflow-hidden"
            onClick={() => setSelectedImageIndex(0)}
          >
            <img
              src={mainImage.image}
              alt="Hotel view"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          {otherImages.slice(0, 2).map((img, index) => (
            <div
              key={img.id}
              className="overflow-hidden cursor-pointer"
              onClick={() => setSelectedImageIndex(index + 1)}
            >
              <img
                src={img.image}
                alt="Hotel view"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ))}
          {otherImages.slice(2, 4).map((img, index) => (
            <div
              key={img.id}
              className="overflow-hidden cursor-pointer"
              onClick={() => setSelectedImageIndex(index + 3)}
            >
              <img
                src={img.image}
                alt="Hotel view"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <button
          onClick={onShowAll}
          className="absolute bottom-4 right-4 bg-white text-sm font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-gray-100 transition-all"
        >
          Show all photos
        </button>
      </div>

      <ImageViewer
        images={images}
        initialIndex={selectedImageIndex || 0}
        isOpen={selectedImageIndex !== null}
        onClose={() => setSelectedImageIndex(null)}
      />
    </>
  );
};

export default ImageGrid;
