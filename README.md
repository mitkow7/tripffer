# 🏨 Tripffer - Modern Hotel Booking Platform

<div align="center">

![Tripffer Logo](https://via.placeholder.com/400x100/4F46E5/FFFFFF?text=TRIPFFER)

**Your Gateway to Seamless Hotel Bookings**

[![Django](https://img.shields.io/badge/Django-4.2.7-092E20?style=for-the-badge&logo=django&logoColor=white)](https://djangoproject.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![AWS S3](https://img.shields.io/badge/AWS_S3-FF9900?style=for-the-badge&logo=amazons3&logoColor=white)](https://aws.amazon.com/s3/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org/)

[🚀 Live Demo](https://tripffer.vercel.app) • [📚 API Docs](#api-documentation) • [🐛 Report Bug](https://github.com/yourusername/tripffer/issues) • [✨ Request Feature](https://github.com/yourusername/tripffer/issues)

</div>

---

## 🌟 What is Tripffer?

Tripffer is a **full-stack hotel booking platform** that connects travelers with their perfect accommodation. Built with modern web technologies, it offers a seamless experience for both travelers seeking hotels and hotel owners managing their properties.

### ✨ Key Features

#### 🧑‍💼 For Travelers

- 🔍 **Smart Hotel Search** - Find hotels by city, dates, guests, and amenities
- 📅 **Real-time Availability** - See live room availability and pricing
- 👤 **User Profiles** - Manage personal information with S3-powered image uploads
- ❤️ **Favorites System** - Save and organize your favorite hotels
- 📱 **Responsive Design** - Perfect experience on any device
- ⭐ **Reviews & Ratings** - Read and write authentic hotel reviews

#### 🏨 For Hotel Owners

- 🏢 **Hotel Management Dashboard** - Complete property management suite
- 🛏️ **Room Management** - Add, edit, and manage room inventory
- 📊 **Booking Analytics** - Track reservations and revenue
- 🖼️ **Media Management** - Upload and organize hotel photos
- ✅ **Approval System** - Admin-moderated hotel listings
- 💰 **Dynamic Pricing** - Set flexible pricing strategies

#### 👨‍💻 For Administrators

- 🛡️ **Admin Interface** - Powerful Django admin with custom styling
- 🔒 **User Management** - Comprehensive user and role management
- ✅ **Hotel Approval** - Quality control for hotel listings
- 📈 **System Analytics** - Monitor platform usage and performance

---

## 🛠 Tech Stack

### Backend

- **🐍 Django 4.2.7** - Robust web framework
- **🔗 Django REST Framework** - Powerful API development
- **🗄️ PostgreSQL** - Reliable database with Supabase hosting
- **☁️ AWS S3** - Scalable file storage for images
- **🚀 Render** - Production deployment platform
- **🔐 JWT Authentication** - Secure token-based auth

### Frontend

- **⚛️ React 18** - Modern UI library
- **📘 TypeScript** - Type-safe development
- **🎨 Tailwind CSS** - Utility-first styling
- **🔄 React Query** - Efficient data fetching
- **🛣️ React Router** - Client-side routing
- **📱 Responsive Design** - Mobile-first approach

### DevOps & Tools

- **🔧 Vite** - Lightning-fast build tool
- **📦 npm** - Package management
- **🌐 Vercel** - Frontend deployment
- **🎯 ESLint** - Code quality enforcement

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **PostgreSQL** (v12 or higher)
- **Git**

### 🔧 Local Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/tripffer.git
cd tripffer
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# On macOS/Linux:
source .venv/bin/activate
# On Windows:
.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
```

**Configure your `.env` file:**

```env
# Django Settings
SECRET_KEY=your-super-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (Use your PostgreSQL credentials)
DATABASE_URL=postgresql://username:password@localhost:5432/tripffer

# AWS S3 Configuration (Optional - uses local storage if not set)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_STORAGE_BUCKET_NAME=your-bucket-name
AWS_S3_REGION_NAME=eu-north-1

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

```bash
# Apply database migrations
python manage.py migrate

# Create superuser for admin access
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic --noinput

# Start development server
python manage.py runserver
```

🎉 **Backend running at:** `http://localhost:8000`

#### 3. Frontend Setup

```bash
# Navigate to frontend directory (new terminal)
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

**Configure your `.env.local` file:**

```env
VITE_API_URL=http://localhost:8000
VITE_MEDIA_URL=http://localhost:8000
```

```bash
# Start development server
npm run dev
```

🎉 **Frontend running at:** `http://localhost:5173`

---

## 📖 How to Use Tripffer

### 🧑‍💼 As a Traveler

#### 1. **Create Your Account**

- Visit the registration page
- Provide your email, name, and password
- Upload a profile picture
- Start exploring hotels!

#### 2. **Search for Hotels**

- Use the search form on the homepage
- Filter by:
  - 🏙️ **City/Location**
  - 📅 **Check-in/Check-out dates**
  - 👥 **Number of guests**
  - 🛏️ **Number of beds**
- Browse results with photos, ratings, and pricing

#### 3. **Book Your Stay**

- Select your preferred hotel
- Choose available rooms
- Review booking details
- Confirm your reservation

#### 4. **Manage Your Profile**

- Update personal information
- Change profile picture (stored securely in AWS S3)
- View booking history
- Manage favorite hotels

### 🏨 As a Hotel Owner

#### 1. **Register as Hotel Owner**

- Create account with "Hotel" role
- Wait for admin approval
- Access hotel management dashboard

#### 2. **Set Up Your Hotel**

- Add hotel information:
  - Name, address, description
  - Star rating and amenities
  - Contact information
  - Upload high-quality photos

#### 3. **Manage Rooms**

- Add room types and descriptions
- Set capacity and bed configurations
- Upload room photos
- Configure pricing

#### 4. **Handle Bookings**

- View incoming reservations
- Update booking status
- Manage room availability
- Track revenue analytics

### 👨‍💻 As an Administrator

#### 1. **Access Admin Panel**

- Navigate to `/admin`
- Login with superuser credentials
- Enjoy the custom-styled interface

#### 2. **Manage Platform**

- **Approve/Reject** hotel registrations
- **Monitor** user activity
- **Moderate** reviews and content
- **Manage** system settings

---

## 🔌 API Documentation

### Authentication Endpoints

| Method  | Endpoint                         | Description             |
| ------- | -------------------------------- | ----------------------- |
| POST    | `/api/accounts/register/`        | Register new user       |
| POST    | `/api/accounts/login/`           | User login              |
| GET/PUT | `/api/accounts/profile/`         | User profile management |
| POST    | `/api/accounts/change-password/` | Change password         |

### Hotel Endpoints

| Method | Endpoint                     | Description                |
| ------ | ---------------------------- | -------------------------- |
| GET    | `/api/hotels/search/`        | Search hotels with filters |
| GET    | `/api/hotels/search/{id}/`   | Get hotel details          |
| GET    | `/api/hotels/my-hotel/`      | Hotel owner's property     |
| PUT    | `/api/hotels/my-hotel/{id}/` | Update hotel information   |

### Booking Endpoints

| Method | Endpoint                     | Description           |
| ------ | ---------------------------- | --------------------- |
| GET    | `/api/hotels/bookings/`      | List user bookings    |
| POST   | `/api/hotels/bookings/`      | Create new booking    |
| PUT    | `/api/hotels/bookings/{id}/` | Update booking status |

### Room Endpoints

| Method | Endpoint                  | Description         |
| ------ | ------------------------- | ------------------- |
| GET    | `/api/hotels/rooms/`      | List hotel rooms    |
| POST   | `/api/hotels/rooms/`      | Add new room        |
| PUT    | `/api/hotels/rooms/{id}/` | Update room details |

### Example API Usage

```javascript
// Search hotels in Sofia
const response = await fetch("/api/hotels/search/?city=Sofia&adults=2&beds=1");
const hotels = await response.json();

// Create booking
const booking = await fetch("/api/hotels/bookings/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer your-jwt-token",
  },
  body: JSON.stringify({
    room: roomId,
    start_date: "2025-01-15",
    end_date: "2025-01-20",
    guests: 2,
  }),
});
```

---

## 🎨 Features Deep Dive

### 🔒 Advanced Authentication System

- **Email-based login** (no usernames required)
- **JWT token authentication**
- **Role-based access control** (User/Hotel Owner/Admin)
- **Secure password handling**

### 🖼️ Smart File Management

- **AWS S3 integration** for scalable image storage
- **Automatic image optimization**
- **Secure file upload** with validation
- **CDN-powered delivery** for fast loading

### 🔍 Intelligent Search System

- **Real-time availability checking**
- **Complex filtering logic**
- **Date-based room availability**
- **Geographic search capabilities**

### 📱 Responsive Design

- **Mobile-first approach**
- **Tailwind CSS** for consistent styling
- **Interactive UI components**
- **Smooth animations** and transitions

---

## 🚀 Deployment

### Backend (Render)

1. Connect your GitHub repository to Render
2. Set environment variables in Render dashboard
3. Configure build command: `pip install -r requirements.txt`
4. Set start command: `python manage.py collectstatic --noinput && gunicorn backend.wsgi:application`

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Configure environment variables
4. Deploy automatically on push

---

## 🤝 Contributing

We love contributions! Here's how you can help make Tripffer even better:

### 🐛 Bug Reports

- Use the [issue tracker](https://github.com/yourusername/tripffer/issues)
- Include detailed reproduction steps
- Provide system information

### ✨ Feature Requests

- Check existing [feature requests](https://github.com/yourusername/tripffer/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement)
- Describe the feature and its benefits
- Include mockups if applicable

### 🛠️ Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests if applicable
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Create a Pull Request

### 📋 Development Guidelines

- Follow PEP 8 for Python code
- Use TypeScript for new frontend features
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly

---

## 📊 Project Structure

```
tripffer/
├── 🗄️ backend/              # Django REST API
│   ├── accounts/           # User management
│   ├── hotels/            # Hotel & booking logic
│   ├── backend/           # Core settings
│   ├── media/             # Local file storage
│   ├── static/            # Static files
│   └── requirements.txt   # Python dependencies
│
├── 🎨 frontend/             # React Application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Route components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── types/         # TypeScript definitions
│   │   └── config/        # Configuration files
│   ├── public/            # Static assets
│   └── package.json       # Node dependencies
│
└── 📖 README.md            # You are here!
```

---

## 🎯 Roadmap

### 🚧 Upcoming Features

- [ ] **Payment Integration** (Stripe/PayPal)
- [ ] **Multi-language Support**
- [ ] **Mobile App** (React Native)
- [ ] **Advanced Analytics** Dashboard
- [ ] **Real-time Chat** Support
- [ ] **Social Login** Integration
- [ ] **Email Notifications** System
- [ ] **Advanced Search Filters**

### 🔮 Future Enhancements

- [ ] **AI-Powered Recommendations**
- [ ] **Virtual Hotel Tours**
- [ ] **Loyalty Program**
- [ ] **Dynamic Pricing Engine**

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

<div align="center">

**Built with ❤️ by the Tripffer Team**

[🐦 Twitter](https://twitter.com/tripffer) • [💼 LinkedIn](https://linkedin.com/company/tripffer) • [📧 Contact](mailto:team@tripffer.com)

</div>

---

## 🙏 Acknowledgments

- **Django Community** for the amazing framework
- **React Team** for the fantastic library
- **Tailwind CSS** for beautiful, utility-first styling
- **AWS** for reliable cloud infrastructure
- **All contributors** who help make Tripffer better

---

<div align="center">

**⭐ Star us on GitHub if you find this project useful!**

**Happy Booking! 🏨✈️**

</div>
