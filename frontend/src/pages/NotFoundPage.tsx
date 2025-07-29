import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const NotFoundPage = () => {
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 20;
      const y = (clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-160px)] flex items-center justify-center px-6 py-12 overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-accent/5 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className={`relative text-center transform transition-all duration-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        {/* 404 Text with 3D effect */}
        <div 
          className="relative mb-8"
          style={{
            transform: `perspective(1000px) rotateX(${mousePosition.y * 0.1}deg) rotateY(${mousePosition.x * 0.1}deg)`
          }}
        >
          <h1 className="text-[12rem] font-bold text-gray-100 select-none">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Page Not Found
            </div>
          </div>
        </div>
        
        {/* Animated message */}
        <p className="mt-6 text-gray-600 max-w-lg mx-auto text-lg animate-fade-in">
          Oops! Looks like you've ventured into uncharted territory.
        </p>
        
        {/* Interactive buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center">
          <Link 
            to="/"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl px-8 py-4 font-medium text-white transition-all duration-300 ease-out hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary-dark to-primary group-hover:bg-gradient-to-l"></div>
            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 h-full w-full bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <div className="relative flex items-center justify-center">
              <svg 
                className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="transition-transform duration-300 group-hover:-translate-x-1">Return Home</span>
            </div>
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-white px-8 py-4 font-medium text-gray-700 shadow-md transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
            <div className="relative flex items-center justify-center">
              <svg 
                className="w-5 h-5 mr-2 text-gray-600 transition-transform duration-300 group-hover:-translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="transition-transform duration-300 group-hover:-translate-x-1">Go Back</span>
            </div>
          </button>
        </div>

        {/* Search suggestion */}
        <div className="mt-12 space-y-4">
          <p className="text-gray-500">Looking for something specific?</p>
          <Link 
            to="/search"
            className="group inline-flex items-center text-primary hover:text-primary-dark transition-all duration-300 hover:scale-105"
          >
            <svg 
              className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="transition-transform duration-300 group-hover:translate-x-1">Try searching our site</span>
          </Link>
        </div>

        {/* Help text */}
        <div className="mt-8 text-sm text-gray-500 animate-fade-in animation-delay-500">
          <p>Need assistance? <Link to="/contact" className="text-primary hover:text-primary-dark underline">Contact our support team</Link></p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

// Add these styles to your index.css or tailwind.config.js
const style = `
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-in forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`; 