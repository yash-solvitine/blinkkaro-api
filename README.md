# BlinkKaro Backend

A scalable and modular service booking platform built with Node.js, Express, and TypeScript.

## Features

- 🔐 User authentication with JWT
- 👥 Service provider onboarding
- 📋 Service listing and management
- 📅 Booking creation and status tracking
- 🛡️ Role-based access control
- 📝 Input validation with Zod
- 🚨 Centralized error handling
- 📊 Structured logging with Winston
- 📚 API documentation with Swagger
- ✅ Unit testing with Jest

## Tech Stack

- Node.js & Express
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Zod Validation
- Winston Logger
- Swagger/OpenAPI
- Jest Testing

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- npm or yarn

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/blinkkaro_backend.git
   cd blinkkaro_backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   - Copy `.env.example` to `.env`
   - Update the variables with your configuration

4. Set up the database:

   ```bash
   npm run db:migrate   # Run database migrations
   npm run db:generate  # Generate Prisma client
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The server will start on http://localhost:3000 (or the port specified in your .env file)

## API Documentation

Once the server is running, you can access the Swagger documentation at:

```
http://localhost:3000/api-docs
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run linting
- `npm run db:migrate` - Run database migrations
- `npm run db:generate` - Generate Prisma client
- `npm run db:studio` - Open Prisma Studio

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── services/       # Business logic
├── repositories/   # Data access layer
├── routes/         # API routes
├── middleware/     # Express middleware
├── utils/          # Utility functions
├── types/          # TypeScript types
├── domain/         # Domain entities and interfaces
│   ├── entities/
│   ├── interfaces/
│   └── schemas/    # Validation schemas
├── app.ts         # Express app setup
└── server.ts      # Server entry point
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support, email support@blinkkaro.com or open an issue in the repository.
