# 🍽️ Foodable - Food Donation Platform

<div align="center">

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0.12-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-1.2.0-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)

**A modern, full-stack web platform connecting food donors with those in need**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Architecture](#-architecture) • [Testing](#-testing) • [Contributing](#-contributing)

</div>

---

## 📖 About Foodable

Foodable is a comprehensive food donation platform designed to tackle world hunger and reduce food waste by connecting three key stakeholders:

- **🎁 Donors**: Individuals and organizations who want to donate surplus food
- **🤝 Receivers**: People in need who can access available food packages
- **🏦 Foodbanks**: Organizations that coordinate and distribute food donations

### Mission

Our focus is to tackle world hunger with healthy food packages that meet people's different dietary requirements while simultaneously reducing food waste by allowing people to donate items that might otherwise be discarded.

---

## ✨ Features

### For Donors
- 📦 **Easy Donation Process**: Simple interface to list food items for donation
- 🎯 **Dietary Specifications**: Specify dietary requirements (vegetarian, vegan, gluten-free, etc.)
- 🏆 **Rewards System**: Earn rewards for consistent donations
- 📊 **Donation History**: Track your contribution impact
- 📍 **Location-Based**: Find nearby foodbanks for drop-off

### For Receivers
- 🔍 **Browse Available Food**: Search and filter available food packages
- 🗺️ **Interactive Maps**: Locate nearby foodbanks with Google Maps integration
- 📋 **Detailed Item Lists**: View comprehensive information about available items
- ⚡ **Real-time Updates**: Get notified about new donations

### For Foodbanks
- 📍 **Location Management**: Manage multiple foodbank locations
- 📊 **Inventory Tracking**: Monitor incoming and outgoing donations
- 👥 **User Management**: Coordinate between donors and receivers
- 📞 **Contact Integration**: Easy communication with stakeholders

### General Features
- 🔐 **Secure Authentication**: JWT-based user authentication
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- 📧 **Email Integration**: Contact forms with EmailJS
- 🗺️ **Google Maps Integration**: Interactive location services
- 🎨 **Modern UI/UX**: Clean, intuitive interface with smooth animations
- ♿ **Accessibility**: WCAG compliant design

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18.2.0 with TypeScript
- **Build Tool**: Vite 5.0.12 (fast HMR, optimized builds)
- **Routing**: React Router DOM v6
- **Styling**: CSS3 with modular components
- **Icons**: Font Awesome
- **Maps**: Google Maps React API
- **Forms**: EmailJS for contact functionality

### Backend
- **Runtime**: Node.js
- **API**: RESTful API with Spring Boot (Java)
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: (Backend configuration in Back-End folder)

### Development & Testing
- **Language**: TypeScript 5.3.3 (full type safety)
- **Testing Framework**: Vitest 1.2.0
- **Testing Library**: React Testing Library 14.0.0
- **Test Coverage**: 125 tests passing ✅
- **Package Manager**: npm
- **Version Control**: Git

### Code Quality
- **Type Checking**: Strict TypeScript configuration
- **Async Patterns**: Modern async/await throughout
- **Error Handling**: Comprehensive try/catch blocks
- **Code Organization**: Feature-based folder structure

---

## 🚀 Getting Started

### Prerequisites

```bash
# Node.js (v18 or higher)
node --version

# npm (v9 or higher)
npm --version
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/BenDXC/Foodable-Web-Dev.git
   cd Foodable-Web-Dev
   ```

2. **Install frontend dependencies**
   ```bash
   cd "Foodable Website/Front-End/foodable"
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file (if needed)
   cp .env.example .env
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

### Backend Setup

```bash
cd "Foodable Website/Back-End/Foodable"
# Follow backend-specific setup instructions
```

---

## 📁 Project Structure

```
Foodable-Web-Dev/
├── Foodable Website/
│   ├── Front-End/
│   │   └── foodable/
│   │       ├── src/
│   │       │   ├── Components/
│   │       │   │   ├── Axios/          # API configuration
│   │       │   │   ├── MPComponents/   # Reusable UI components
│   │       │   │   │   ├── Button.tsx
│   │       │   │   │   ├── Cards.tsx
│   │       │   │   │   ├── Navbar.tsx
│   │       │   │   │   └── Footer.tsx
│   │       │   │   └── pages/          # Page components
│   │       │   │       ├── Home.tsx
│   │       │   │       ├── Login.tsx
│   │       │   │       ├── Registration.tsx
│   │       │   │       ├── Donator.tsx
│   │       │   │       ├── Receiver.tsx
│   │       │   │       ├── Foodbank.tsx
│   │       │   │       ├── Profile.tsx
│   │       │   │       ├── Reward.tsx
│   │       │   │       ├── About.tsx
│   │       │   │       └── Contact.tsx
│   │       │   ├── types/              # TypeScript type definitions
│   │       │   ├── App.tsx             # Main app component
│   │       │   └── index.tsx           # Entry point
│   │       ├── public/                 # Static assets
│   │       ├── tsconfig.json           # TypeScript config
│   │       ├── vite.config.ts          # Vite configuration
│   │       └── package.json
│   └── Back-End/
│       └── Foodable/                   # Spring Boot backend
└── README.md
```

---

## 🏗️ Architecture

### Frontend Architecture

```
┌─────────────────────────────────────────┐
│           User Interface                 │
│  (React Components with TypeScript)      │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         State Management                 │
│     (React Hooks + Local State)         │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│          API Layer                       │
│  (Axios with async/await patterns)      │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Backend API                      │
│    (Spring Boot REST API)               │
└─────────────────────────────────────────┘
```

### Component Hierarchy

```
App
├── Navbar (with authentication state)
├── Routes
│   ├── Home (public)
│   ├── About (public)
│   ├── Login (public)
│   ├── Registration (public)
│   ├── Donator (authenticated)
│   ├── Receiver (authenticated)
│   ├── Foodbank (public)
│   ├── Profile (authenticated)
│   ├── Reward (authenticated)
│   └── Contact (public)
└── Footer
```

---

## 🧪 Testing

The project includes comprehensive test coverage with 125 passing tests.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### Test Structure

- **Component Tests**: Test React components in isolation
- **Integration Tests**: Test component interactions
- **API Tests**: Test axios instance and API calls
- **Form Tests**: Test user input and validation
- **Async Tests**: All tests use modern async/await patterns

### Test Coverage Areas

- ✅ Button components and variants
- ✅ Card components and navigation
- ✅ Navbar with authentication states
- ✅ Footer with all links
- ✅ Login form with validation
- ✅ Home page with user data
- ✅ Contact form with email integration
- ✅ About page content
- ✅ Reward items display
- ✅ HTTP client configuration

---

## 🔐 Authentication Flow

```
1. User registers/logs in
   ↓
2. Backend validates credentials
   ↓
3. JWT token generated and returned
   ↓
4. Token stored in sessionStorage
   ↓
5. Token included in API request headers
   ↓
6. Backend validates token for protected routes
```

---

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Responsive Layout**: Mobile-first approach
- **Smooth Animations**: CSS transitions and transforms
- **Intuitive Navigation**: Clear user flow
- **Form Validation**: Real-time feedback
- **Loading States**: User feedback during async operations
- **Error Handling**: User-friendly error messages
- **Accessibility**: Keyboard navigation and screen reader support

---

## 📦 Available Scripts

### Development
```bash
npm run dev          # Start development server with HMR
npm run build        # Build for production
npm run preview      # Preview production build locally
```

### Testing
```bash
npm test             # Run test suite
npm run test:ui      # Run tests with interactive UI
npm run test:coverage # Generate coverage report
```

---

## 🌍 Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_USER_ID=your_user_id
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Standards
- Write TypeScript with strict type checking
- Use async/await for asynchronous operations
- Write tests for new features
- Follow existing code style and conventions
- Update documentation as needed

---

## 📝 License

This project is part of a university coursework project.

---

## 👥 Team

Developed by students as part of a Web Development project.

---

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite team for the blazing-fast build tool
- TypeScript team for type safety
- All open-source contributors

---

## 📞 Support

For support, email foodable7@gmail.com or create an issue in the repository.

---

<div align="center">

**Made with ❤️ for a better world**

[⬆ Back to Top](#️-foodable---food-donation-platform)

</div>
