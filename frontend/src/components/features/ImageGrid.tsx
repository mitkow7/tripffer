import React from "react";

interface ImageGridProps {
  images: { id: string | number; image: string }[];
  onShowAll: () => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, onShowAll }) => {
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-96">
      <div className="h-full w-full">
        <img
          src={mainImage.image}
          alt="Main hotel view"
          className="w-full h-full object-cover rounded-l-lg"
        />
      </div>
      <div className="grid grid-cols-2 gap-2 h-full">
        {otherImages.map((img, index) => (
          <div key={img.id} className="h-full w-full">
            <img
              src={img.image}
              alt={`Hotel view ${index + 2}`}
              className={`w-full h-full object-cover ${
                index === 1 ? "rounded-tr-lg" : ""
              } ${index === 3 ? "rounded-br-lg" : ""}`}
            />
          </div>
        ))}
        {images.length > 5 && (
          <div className="relative h-full w-full">
            <button
              onClick={onShowAll}
              className="absolute inset-0 w-full h-full bg-black bg-opacity-50 text-white flex items-center justify-center text-lg font-bold hover:bg-opacity-70 transition rounded-br-lg"
            >
              Show all photos
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGrid;
