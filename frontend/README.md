# Tripffer - Modern Trip Comparison Platform

A beautiful, modern React application for comparing and booking travel experiences. Built with TypeScript, Tailwind CSS, and React Query for optimal performance and user experience.

## Features

### Core Functionality
- **Advanced Search**: Smart filtering system with destination, dates, budget, and travel type filters
- **Trip Comparison**: Interactive price comparison grid with real-time sorting
- **User Authentication**: Complete registration and login system with form validation
- **Trip Management**: Detailed trip views with photo galleries and pricing breakdowns
- **User Dashboard**: Personal dashboard for managing bookings and favorites
- **Responsive Design**: Mobile-first design that works perfectly on all devices

### Technical Features
- **TypeScript**: Full type safety for better development experience
- **React Query**: Efficient data fetching with caching and background updates
- **React Router**: Client-side routing for smooth navigation
- **React Hook Form**: Performant form validation
- **Tailwind CSS**: Utility-first styling with custom design system
- **Atomic Design**: Component architecture following atomic design principles

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd tripffer
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

4. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=Tripffer
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components (Button, Input, Card, etc.)
│   ├── layout/         # Layout components (Header, Footer)
│   └── features/       # Feature-specific components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── services/           # API service layer
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── contexts/           # React contexts
└── config/             # Configuration files
```

## API Integration

The application is designed to work with a Django REST API backend. The API service layer (`src/services/api.ts`) handles all HTTP requests and includes:

- Authentication (login, register, user management)
- Trip search and retrieval
- Booking management
- Favorites functionality

### Django Backend Requirements

Your Django backend should provide the following endpoints:

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/me` - Get current user profile

#### Trips
- `GET /trips/search` - Search trips with filters
- `GET /trips/{id}` - Get trip details
- `GET /trips/featured` - Get featured trips

#### Bookings
- `POST /bookings` - Create new booking
- `GET /bookings/my` - Get user's bookings
- `POST /bookings/{id}/cancel` - Cancel booking

#### Favorites
- `POST /favorites/{trip_id}` - Add trip to favorites
- `DELETE /favorites/{trip_id}` - Remove from favorites
- `GET /favorites` - Get user's favorite trips

### Mock API

For development purposes, the application includes a mock API service that simulates all backend functionality. To switch between mock and real API:

1. Open `src/services/api.ts`
2. Change `USE_MOCK_API` to `false`
3. Ensure your Django backend is running

## Deployment

### Build for Production

```bash
npm run build
```

The built application will be in the `dist/` directory.

### Environment Setup

For production deployment, ensure these environment variables are set:

- `VITE_API_BASE_URL`: Your production API URL
- `VITE_APP_NAME`: Your application name

## Component Architecture

### Atomic Design Structure

- **Atoms**: Basic UI components (Button, Input, Card)
- **Molecules**: Simple component combinations (SearchForm, BookingWidget)
- **Organisms**: Complex components (Header, HotelSearch)
- **Templates**: Page layouts
- **Pages**: Full page components

### Key Components

#### UI Components (`src/components/ui/`)
- `Button`: Flexible button component with multiple variants
- `Input`: Form input with validation and icon support
- `Card`: Reusable card container with hover effects
- `LoadingSpinner`: Animated loading indicator
- `SkeletonLoader`: Skeleton loading states

#### Feature Components (`src/components/features/`)
- `SearchForm`: Advanced search form with filters
- `BookingWidget`: Booking interface with room selection
- `HotelSearch`: Hotel search and filtering functionality

#### Layout Components (`src/components/layout/`)
- `Header`: Navigation header with user menu
- `Footer`: Site footer with links and branding

## Styling

The application uses Tailwind CSS with a custom design system:

### Color Palette
- Primary: Blue (#2563EB)
- Secondary: White (#ffffff)
- Accent: Various shades for success, warning, error states
- Neutral: Gray scale for text and backgrounds

### Typography
- Headings: Bold, clear hierarchy
- Body: Readable with proper line spacing
- Maximum 3 font weights used throughout

### Spacing
- Consistent 8px spacing system
- Proper alignment and visual balance

## Performance Optimizations

- **React Query**: Efficient data fetching with caching
- **Lazy Loading**: Code splitting for better initial load times
- **Optimized Images**: Responsive images with proper compression
- **Memoization**: React.memo and useMemo for expensive computations

## Testing

Run the test suite:

```bash
npm run test
```

The application includes:
- Unit tests for utility functions
- Component tests for UI components
- Integration tests for API services

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.