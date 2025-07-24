import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselProps {
  images: { id: string | number; image: string }[];
  altText: string;
}

const Carousel: React.FC<CarouselProps> = ({ images, altText }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="h-48 w-full bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500">No Image Available</span>
      </div>
    );
  }

  const goToPrevious = () => {
    const isFirstImage = currentIndex === 0;
    const newIndex = isFirstImage ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastImage = currentIndex === images.length - 1;
    const newIndex = isLastImage ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <div className="relative h-full w-full group">
      <div className="h-full w-full overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((img) => (
            <img
              key={img.id}
              src={img.image}
              alt={altText}
              className="w-full h-full object-cover flex-shrink-0"
            />
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/80 text-gray-800 p-1 rounded-full hover:bg-white transition-all opacity-0 group-hover:opacity-100 focus:outline-none"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goToNext();
            }}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/80 text-gray-800 p-1 rounded-full hover:bg-white transition-all opacity-0 group-hover:opacity-100 focus:outline-none"
          >
            <ChevronRight size={20} />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                className={`h-1.5 w-1.5 rounded-full ${
                  currentIndex === index ? "bg-white" : "bg-white/50"
                } transition-all`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Carousel;
