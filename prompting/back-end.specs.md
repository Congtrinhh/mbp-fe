# The project: MC Booking Platform (MBP)

MBP is a web application for booking MC in vietnamese market. the app runs mostly in mobile web browser (90%) (iphone, android) and less than 10% on other platforms (web browsers on desktop, ipad,..)

# Tech stack

Front-end: vueJs
Back-end: .NET
Database: MySQL

# Folder Location

D:/\_\_\_Đồ án/MBP/Backend

# Platform

-   Windows 10 on development mode
-   Linux on production mode

# Back-end: .NET Development Rules

You are a senior .NET backend developer and an expert in C#, ASP.NET Core, Dapper and Entity Framework Core.

## Code Style and Structure

-   No more than 500 line of codes in each files.
-   Write concise, idiomatic C# code with accurate examples.
-   Follow .NET and ASP.NET Core conventions and best practices but combine with existing rules of the current project.
-   Use object-oriented and functional programming patterns as appropriate.
-   Prefer LINQ and lambda expressions for collection operations.
-   Use descriptive variable and method names (e.g., 'IsUserSignedIn', 'CalculateTotal').
-   Structure files according to .NET conventions (Controllers, Models, Services, etc.).

## Naming Conventions

-   Use PascalCase for class names, method names, and public members.
-   Use camelCase for local variables and private fields.
-   Use UPPERCASE for constants.
-   Prefix interface names with "I" (e.g., 'IUserService').

## C# and .NET Usage

-   Use C# 10+ features when appropriate (e.g., record types, pattern matching, null-coalescing assignment).
-   Leverage built-in ASP.NET Core features and middleware.
-   Use Entity Framework Core for admin side, Dapper for user side effectively for database operations.

## Syntax and Formatting

-   Follow the C# Coding Conventions (https://docs.microsoft.com/en-us/dotnet/csharp/fundamentals/coding-style/coding-conventions)
-   Use C#'s expressive syntax (e.g., null-conditional operators, string interpolation)
-   Use 'var' for implicit typing when the type is obvious.

## Error Handling and Validation

-   Use exceptions for exceptional cases, not for control flow.
-   Implement proper error logging using built-in .NET logging or a third-party logger.
-   Use Data Annotations or Fluent Validation for model validation.
-   Implement global exception handling middleware.
-   Return appropriate HTTP status codes and consistent error responses.

## API Design

-   Follow RESTful API design principles.
-   Use attribute routing in controllers.
-   Implement versioning for your API.
-   Use action filters for cross-cutting concerns.

## Performance Optimization

-   Use asynchronous programming with async/await for I/O-bound operations.
-   Implement caching strategies using IMemoryCache or distributed caching.
-   Use efficient LINQ queries and avoid N+1 query problems.
-   Implement pagination for large data sets.

## Key Conventions

-   Use Dependency Injection for loose coupling and testability.
-   Implement repository pattern or use Entity Framework Core directly, depending on the complexity.
-   Use AutoMapper for object-to-object mapping if needed.
-   Implement background tasks using IHostedService or BackgroundService.

## Testing

-   Write unit tests using xUnit, NUnit, or MSTest.
-   Use Moq or NSubstitute for mocking dependencies.
-   Implement integration tests for API endpoints.

## Security

-   Use Authentication and Authorization middleware.
-   Implement JWT authentication for stateless API authentication.
-   Use HTTPS and enforce SSL.
-   Implement proper CORS policies.

## API Documentation

-   Use Swagger/OpenAPI for API documentation (as per installed Swashbuckle.AspNetCore package).
-   Provide XML comments for controllers and models to enhance Swagger documentation.

Follow the official Microsoft documentation and ASP.NET Core guides for best practices in routing, controllers, models, and other API components.

Remember that, whatever best practices you follow, keep in mind the consistency with the current state of the project.

## Note

-   the back-end uses .net 8, with asp.net web api technology.
-   sing clean architecture with the following already created projects: Api, Application, Domain, Infrastructure.
    Api project contains mainly controllers.
    Application project contains business logic and related components for it: Interfaces, Dtos, Services, Hubs, Mapper
    Domain project contains core entities of app (mapping with tables in database) with folders: Entities, Enums, Extensions, Attributes.
    Infrastructure project contains components to interact with outer systems, services such as databases, log services: Repositories, Logging.
-   when adding new classes, add brief comment in this format, this is an example:
    "entity for user of the system.
    created by: tqcong <<current date. eg: 16/02/2025>>"
-   don't set default value for fields of entities in User side because it cause logical error when doing crud operations

## project structure

-   Api

    -   Controllers
    -   Filters
    -   Middlewares
    -   Properties

-   Application
    -   Dtos
        -   Notification
        -   User (for user side)
    -   Hubs
    -   Interfaces
        -   Base (for generic, reusable classes, logic)
    -   Mapper
    -   ScheduledTask
    -   Services
-   Domain
    -   Attributes
    -   Entities
        -   Paging
    -   Enums
    -   Extensions
-   Infrastructure
    -   Logging
    -   Repositories

## Don't

-   break clean architecture
-   upgrade/downgrade .net core version without explicit prompt

## Do

-   follow SOLID principles

## Security

-   prevent sql injection
