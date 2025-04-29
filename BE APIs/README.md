# TeamTasker Backend

A .NET 8.0 application built with clean architecture principles.

## Documentation

Comprehensive documentation is available in the `docs` folder:

- [Architecture Diagram](docs/ArchitectureDiagram.md) - Detailed architecture diagrams and component relationships
- [Database Schema](docs/DatabaseSchema.md) - Complete database schema with tables, columns, and relationships
- [API Structure](docs/APIStructure.md) - RESTful API structure and implementation details
- [Clean Architecture Improvements](docs/CleanArchitectureImprovements.md) - Improvements made to align with clean architecture principles
- [User Guide](docs/user-guide.md) - Business-oriented guide to the main features and usage of TeamTasker

## Architecture Overview

This solution follows clean architecture principles with the following layers:

- **Domain Layer**: Contains enterprise logic and entities
- **Application Layer**: Contains business logic and use cases
- **Infrastructure Layer**: Contains implementation details and external concerns
- **API Layer**: Contains controllers and API endpoints

For a more detailed architecture overview with diagrams, see the [Architecture Documentation](docs/ArchitectureDiagram.md).

## Key Features

- Clean Architecture with clear separation of concerns
- Domain-Driven Design principles
- Rich Domain Model with encapsulated business logic
- Value Objects for domain concepts
- Domain Services for complex business logic
- CQRS pattern with MediatR
- Entity Framework Core 8.0
- Repository pattern with Unit of Work
- Caching strategy for performance optimization
- Fluent Validation with validation pipeline
- Standardized command response pattern
- Global exception handling
- Unit testing with xUnit
- Swagger documentation

## Project Structure

- **TeamTasker.Domain**: Contains domain entities, value objects, and domain events
- **TeamTasker.Application**: Contains application services, commands, queries, and validators
- **TeamTasker.Infrastructure**: Contains data access, external services, and infrastructure concerns
- **TeamTasker.API**: Contains API controllers and configuration
- **TeamTasker.SharedKernel**: Contains shared abstractions and base classes

For a detailed database schema, including tables, columns, relationships, and constraints, see the [Database Schema Documentation](docs/DatabaseSchema.md).

## Getting Started

### Prerequisites

- .NET 8.0 SDK
- SQLite (configured by default) or SQL Server

### Setup

1. Clone the repository
2. The default configuration uses SQLite with a local database file. If you want to use SQL Server, update the connection string in `appsettings.Development.json`
3. Install the EF Core tools if you haven't already: `dotnet tool install --global dotnet-ef`
4. Run migrations: `cd src/Presentation/TeamTasker.API && dotnet ef database update`
5. Run the application: `cd src/Presentation/TeamTasker.API && dotnet run`
6. Access the Swagger UI at: `http://localhost:5220/swagger`

### API Endpoints

The following API endpoints are available:

#### Projects
- **GET /api/projects** - Get all projects
- **GET /api/projects/{id}** - Get a specific project by ID
- **POST /api/projects** - Create a new project
- **PUT /api/projects/{id}** - Update an existing project
- **DELETE /api/projects/{id}** - Delete a project

#### Tasks
- **GET /api/tasks** - Get all tasks with filtering and pagination
- **GET /api/tasks/{id}** - Get a specific task by ID
- **GET /api/tasks?taskType=assigned** - Get tasks assigned to current user
- **GET /api/tasks?taskType=created** - Get tasks created by current user
- **GET /api/tasks?includeTags=true** - Get tasks with their tags
- **POST /api/tasks** - Create a new task
- **PUT /api/tasks/{id}** - Update an existing task
- **DELETE /api/tasks/{id}** - Delete a task

#### Teams
- **GET /api/teams** - Get all teams
- **GET /api/teams/{id}** - Get a specific team by ID
- **POST /api/teams** - Create a new team
- **PUT /api/teams/{id}** - Update an existing team
- **DELETE /api/teams/{id}** - Delete a team
- **GET /api/teams/{id}/members** - Get members of a team
- **POST /api/teams/{id}/members** - Add a member to a team
- **DELETE /api/teams/{id}/members/{memberId}** - Remove a member from a team

#### Authentication
- **POST /api/auth/register** - Register a new user
- **POST /api/auth/login** - Login and get JWT token
- **GET /api/auth/me** - Get current user information
- **POST /api/auth/logout** - Logout user
- **POST /api/auth/forgot-password** - Request password reset
- **POST /api/auth/reset-password** - Reset password with token
- **POST /api/auth/change-password** - Change password for authenticated user

#### User Management
- **GET /api/users** - Get list of users with filtering and pagination
- **GET /api/users/{id}** - Get a specific user by ID
- **GET /api/users/profile** - Get current user profile
- **PATCH /api/users/profile** - Update current user profile

For more detailed API documentation, including request/response formats and implementation details, see the [API Structure Documentation](docs/APIStructure.md).

## Testing

The application includes comprehensive unit tests for all layers:

- Domain layer tests
- Application layer tests
- Infrastructure layer tests
- API layer tests

### Running Tests

To run all tests:

```bash
dotnet test
```

### Code Coverage

To generate code coverage reports:

```bash
dotnet test --collect:"XPlat Code Coverage"
```

To view the coverage report in HTML format, install the ReportGenerator tool:

```bash
dotnet tool install -g dotnet-reportgenerator-globaltool
reportgenerator -reports:"tests/*/TestResults/*/coverage.cobertura.xml" -targetdir:"coveragereport" -reporttypes:Html
```

## Feature Details

### Authentication System

The application implements a comprehensive authentication system with JWT tokens:

- **User Registration**: Create new user accounts with validation
- **User Login**: Authenticate users and issue JWT tokens
- **Password Management**: Secure password hashing and verification
- **Password Reset Flow**: Complete forgot password and reset password functionality
- **Token-based Authentication**: JWT tokens with claims-based identity

### User Management

The application provides user management capabilities:

- **User Profiles**: View and update user profiles
- **User Listing**: List users with pagination, filtering, and sorting
- **Search Functionality**: Search users by name, email, or username
- **Department Filtering**: Filter users by department

### Error Handling and Validation

The application implements robust error handling and validation:

- **Global Exception Handling**: Consistent error responses across the API
- **Validation**: Input validation using data annotations and FluentValidation
- **Logging**: Comprehensive logging for debugging and auditing

## Microservices Readiness

The application is designed to be easily transitioned into a microservices architecture:

- Each bounded context is isolated with clear boundaries
- Domain events for cross-context communication
- Independent data persistence capabilities
- Modular design for easy extraction of services

For more details on the microservices architecture approach, see the [Architecture Documentation](docs/ArchitectureDiagram.md#microservices-readiness).

## Documentation

For more detailed documentation, see the following:

- [API Structure Documentation](docs/APIStructure.md) - Detailed information about API endpoints, request/response formats, and implementation details
- [Architecture Diagram](docs/ArchitectureDiagram.md) - Overview of the application architecture, including layers, components, and their interactions
- [Database Schema](docs/DatabaseSchema.md) - Detailed information about the database schema, including tables, columns, relationships, and constraints
- [Clean Architecture Improvements](docs/CleanArchitectureImprovements.md) - Detailed information about the improvements made to align with clean architecture principles
- [User Guide](docs/user-guide.md) - Business-oriented guide to the main features and usage of TeamTasker

## Current Status and Future Plans

### Implemented Features

- ✅ Clean Architecture with Domain, Application, Infrastructure, and API layers
- ✅ Rich Domain Model with encapsulated business logic
- ✅ Value Objects for domain concepts (Email, DateRange, Percentage)
- ✅ Domain Services for complex business logic
- ✅ CQRS pattern with MediatR
- ✅ Entity Framework Core 8.0 with SQLite
- ✅ Repository pattern with Unit of Work
- ✅ Caching strategy for performance optimization
- ✅ Project management functionality (CRUD operations)
- ✅ Task management functionality (CRUD operations)
- ✅ Team and team member management
- ✅ Authentication and Authorization with JWT
- ✅ User management functionality with profile management
- ✅ Password reset and change functionality
- ✅ Pagination, filtering, and sorting for listings
- ✅ Global exception handling and improved error responses
- ✅ Standardized command response pattern
- ✅ Improved validation with FluentValidation
- ✅ Performance monitoring for long-running requests
- ✅ Unit tests for all layers
- ✅ Swagger documentation
- ✅ Comprehensive documentation (Architecture, Database Schema, API Structure, Clean Architecture Improvements, User Guide)

### Planned Features

- ⏳ Role-based authorization
- ⏳ Advanced user management for administrators
- ⏳ Email notifications with real email service
- ⏳ Improved test coverage (target: 80%)
- ⏳ CI/CD pipeline
- ⏳ API versioning
