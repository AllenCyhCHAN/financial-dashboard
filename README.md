# Financial Dashboard

A modern, comprehensive financial tracking application built with React, TypeScript, and Material-UI. Monitor your income, expenses, investments, and analyze financial trends with interactive charts and real-time insights.

## ✨ Features

### 📊 Dashboard Overview
- **Financial Summary**: Comprehensive overview of income, expenses, assets, liabilities, and net worth
- **Interactive Charts**: Monthly trends, category breakdowns, and comparative analytics
- **Real-time Insights**: Automated calculations for savings rates and spending patterns
- **Period Filtering**: View data by all time, yearly, monthly, or weekly periods

### 💰 Transaction Management
- **Complete CRUD Operations**: Add, edit, delete, and manage all transaction types
- **Smart Categorization**: Organized by income, expense, investment, asset, and liability types
- **Advanced Filtering**: Search and filter by type, category, date range, and amount
- **Data Table**: Sortable and paginated transaction history with bulk operations

### 📈 Investment Tracking
- **Portfolio Management**: Track stocks, bonds, crypto, real estate, and mutual funds
- **Performance Analytics**: Real-time gain/loss calculations with percentage tracking
- **Multi-currency Support**: Handle investments in different currencies with conversion
- **Historical Analysis**: Track purchase dates, price changes, and portfolio growth

### 🎯 Analytics & Insights
- **Trend Analysis**: Visual representation of financial trends over time
- **Category Breakdowns**: Detailed pie charts for spending and income patterns
- **Comparative Charts**: Month-over-month and year-over-year analysis
- **Financial Metrics**: Savings rate, average transactions, and spending insights

### 🎨 User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark Theme**: Modern dark purple theme with consistent styling
- **Intuitive Navigation**: Clean sidebar navigation with permanent desktop layout
- **Local Storage**: Complete data persistence without backend requirements

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI) v5
- **Charts**: Recharts
- **State Management**: Zustand with persistence
- **Routing**: React Router v6
- **Date Handling**: date-fns + MUI Date Pickers
- **Code Quality**: ESLint + Prettier
- **Environment**: Environment variables for secure configuration

## 📁 Project Architecture

```
src/
├── components/          # Reusable UI components
│   ├── charts/          # Chart components (Recharts)
│   ├── cards/           # Card components
│   ├── dialogs/         # Modal and dialog components
│   ├── forms/           # Form field components
│   ├── tables/          # Data table components
│   └── ...
├── pages/               # Page components
│   ├── Dashboard.tsx    # Main dashboard with analytics
│   ├── Transactions.tsx # Transaction management
│   ├── Investments.tsx  # Investment tracking
│   ├── InitialSetup.tsx # Onboarding wizard
│   └── Settings.tsx     # Application settings
├── services/            # Data and API services
│   ├── currencyService.ts # Currency conversion
│   └── mockData.ts      # Local storage service
├── store/               # Zustand state management
│   └── index.ts         # Store definitions
├── types/               # TypeScript interfaces
│   └── index.ts         # Type definitions
├── utils/               # Helper functions
│   ├── index.ts         # Utility functions
│   └── validation.ts    # Validation schemas
├── constants/           # Application constants
│   └── index.ts         # Configuration values
├── theme/               # MUI theme configuration
│   └── index.ts         # Theme definitions
└── hooks/               # Custom React hooks
    └── useDataInitialization.ts
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd financial-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your financial data:
   ```env
   # Banking Accounts (Assets)
   VITE_BOC_BALANCE=0
   VITE_MOX_BALANCE=0
   
   # Debts (Liabilities)
   VITE_MOX_DEBT=0
   VITE_MPOWER_DEBT=0
   VITE_TRAVEL_PLUS_DEBT=0
   VITE_UNI_LOAN_DEBT=0
   
   # Investments (Assets)
   VITE_BINANCE_INVESTMENT=0
   VITE_FUTU_INVESTMENT=0
   
   # Currencies
   VITE_BANKING_CURRENCY=USD
   VITE_INVESTMENT_CURRENCY_USD=USD
   VITE_INVESTMENT_CURRENCY_HKD=HKD
   VITE_DEBT_CURRENCY=USD
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🔒 Security & Privacy

### Environment Variables
This application uses environment variables to keep your sensitive financial data secure:

- **`.env` file**: Contains your actual financial data (DO NOT commit to git)
- **`.env.example`**: Template file with example values (safe to commit)
- **`.gitignore`**: Automatically excludes `.env` files from version control

### Data Storage
- **Local Storage**: All data is stored locally in your browser
- **No Backend**: No data is sent to external servers
- **Privacy First**: Your financial data never leaves your device

### Best Practices
1. **Never commit `.env` files** to version control
2. **Use `.env.example`** as a template for other developers
3. **Keep backups** of your `.env` file in a secure location
4. **Regular updates** to keep dependencies secure

## 🏗️ Architecture

### State Management
- **Zustand**: Lightweight state management with persistence
- **Local Storage**: Data persistence without backend dependency
- **Type Safety**: Full TypeScript support throughout

### Component Architecture
- **Reusable Components**: Modular, composable UI components
- **Custom Hooks**: Encapsulated logic for data management
- **Service Layer**: Abstracted API layer ready for backend integration

### Data Flow
1. **Initialization**: Load data from localStorage on app start
2. **User Actions**: Update Zustand store and localStorage
3. **UI Updates**: Reactive updates based on store changes
4. **Persistence**: Automatic data persistence to localStorage

## 🔮 Future Roadmap

### Backend Integration
- **API Ready**: Service layer prepared for REST/GraphQL APIs
- **Authentication**: User accounts and data synchronization
- **Real-time Updates**: WebSocket support for live data

### Advanced Features
- **Budget Planning**: Set and track budget goals
- **Goal Tracking**: Financial goals and progress monitoring
- **Reports**: PDF export and advanced reporting
- **Bank Integration**: Connect to financial institutions
- **Mobile App**: React Native mobile application

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use Prettier for code formatting
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Material-UI](https://mui.com/) for the comprehensive component library
- [Recharts](https://recharts.org/) for beautiful, interactive charts
- [Zustand](https://zustand-demo.pmnd.rs/) for simple state management
- [React Router](https://reactrouter.com/) for client-side routing
- [Vite](https://vitejs.dev/) for the lightning-fast build tool

---

**Built with ❤️ using React, TypeScript, and Material-UI**
