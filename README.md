# Smart Fitness Companion

An **AI-powered fitness application** that delivers personalized workout recommendations, intelligent progress tracking, and secure user experiences—built using a modern microservices architecture.

---

## Table of Contents
- [Overview](#overview)
- [Key Features (Planned)](#key-features-planned)
- [Technology Stack](#technology-stack)
- [Microservice Architecture](#microservice-architecture)
- [User Microservice](#user-microservice)
  - [Features](#features)
  - [Key Implementation Details](#key-implementation-details)
  - [API Endpoints](#api-endpoints)
  - [Request & Response DTOs](#request--response-dtos)
  - [Configuration](#configuration)
  - [Running Locally](#running-locally)
  - [Current Progress](#current-progress)
- [Activity Service](#activity-service)
  - [Features Implemented](#features-implemented)
  - [API Endpoints of Activity Service](#api-endpoints-of-activity-service)
  - [Tested Endpoints](#tested-endpoints)
  - [Technical Summary](#technical-summary)
  - [How to Test](#how-to-test)

---

## Overview

Smart Fitness Companion leverages cutting-edge technologies and AI to transform the fitness journey for users. Designed with scalability, security, and personalization at its core, this platform aims to empower users to achieve their fitness goals through tailored workout plans, progress analytics, and seamless, secure access.

---

## Key Features (Planned)

- **Personalized Workouts:** AI-driven routines and recommendations using Gemini AI.
- **Progress Tracking:** Intelligent analytics to monitor improvements and suggest next steps.
- **User Security:** Enterprise-grade authentication and authorization powered by Keycloak.
- **Modern Microservices:** Each functional domain (user management, workouts, tracking, etc.) is isolated for agility and scalability.
- **Robust Communication:** Asynchronous service integration via RabbitMQ.
- **Flexible Data Storage:** Support for PostgreSQL/MySQL.
- **Service Discovery & Gateway:** Eureka and Spring Cloud Gateway for dynamic routing and service registration.
- **Web Interface:** Responsive frontend with React.

---

## Technology Stack

- **Frontend:** React (planned)
- **Backend:** Spring Boot Microservices
- **Service Discovery:** Eureka
- **API Gateway:** Spring Cloud Gateway
- **Authentication & Authorization:** Keycloak
- **Messaging:** RabbitMQ
- **Database:** PostgreSQL/MySQL
- **AI/ML:** Gemini AI (planned integration)
- **DevOps:** Docker, CI/CD pipelines (planned)

---

## Microservice Architecture

Each feature domain (users, activity etc.) is implemented as a separate microservice for scalability and maintainability. The current focus is the **user microservice**.

---

## User Microservice

### Features

- User registration and retrieval
- Role-based access via `UserRole` enum
- Secure data persistence using PostgreSQL
- RESTful API endpoints for core user operations

### Key Implementation Details

- **User entity** and **UserRole enum** defined in the domain layer.
- **Database connection** configured via `application.yml`.
- **Repository, service interface, and implementation** layers structured for clean separation of concerns.
- **UserController** exposes REST endpoints for creating and fetching users.
- **DTOs** used for request/response mapping, ensuring clean API contracts.
- **Endpoints verified** using HTTP request definitions in the `api-requests` directory.

### API Endpoints

| Method | Endpoint        | Description             |
|--------|----------------|-------------------------|
| POST   | `/register`       | Create a new user       |
| GET    | `/users/{id}`  | Retrieve user by ID     |

> See the `api-requests` directory for example HTTP requests.

### Request & Response DTOs

- **UserRequestDTO**: Used for user creation requests.
- **UserResponseDTO**: Used for user responses.


### Configuration

- Database connection settings are managed in `src/main/resources/application.yml`.


### Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/PritiAryal/Smart-Fitness-Companion.git
   cd Smart-Fitness-Companion
   ```

2. **Set up PostgreSQL** and configure your credentials in `application.yml`.

3. **Build and run the user microservice:**
   ```bash
   ./mvnw spring-boot:run
   ```

4. **Test endpoints** using sample HTTP requests in the `api-requests` directory.

![img.png](user-service/assets/img.png)
![img_1.png](user-service/assets/img_1.png)
![img_2.png](user-service/assets/img_2.png)



### Current Progress

The initial phase focuses on building a robust **user service** as the foundation for secure and scalable user management. This includes:

- User registration and authentication endpoints
- Integration plans for Keycloak (OAuth2)
- Data persistence with relational databases (PostgreSQL)
- Microservice-ready architecture using Spring Boot

> **Note:** Details on endpoints, usage, and deployment instructions will be included as the implementation progresses.

> The codebase is evolving; as of now, the primary focus is on the backend user service. Additional microservices and the frontend will be introduced in subsequent phases.

---

## Activity Service

The `activity-service` is a dedicated Spring Boot microservice within the Smart Fitness Companion ecosystem, responsible for recording and retrieving user activity data with a focus on scalability, maintainability, and clean architecture.

### Features Implemented

- **MongoDB Integration**: Configured via `application.yml` for flexible, document-oriented storage of activity records.
- **Activity Domain Model**:
    - Comprehensive entity representing user activity, including type, duration, calories burned, timestamps, and extensible `additionalMetrics` (e.g., distance, speed, heart rate).
- **DTO Layer**:
    - `ActivityRequestDTO` and `ActivityResponseDTO` for decoupled, validated request and response handling.
- **Repository**:
    - Spring Data MongoDB interface for efficient, type-safe data access.
- **Service Layer**:
    - Interface-driven business logic and implementation to handle activity persistence and retrieval.
- **REST Controller**:
    - Exposes APIs for activity management.
- **API Test Coverage**:
    - HTTP request test files located in `api-requests/activity-service` for endpoint verification and documentation.

### API Endpoints of Activity Service

| Method | Endpoint                        | Description                                   | Notes                          |
|--------|----------------------------------|-----------------------------------------------|--------------------------------|
| POST   | `/api/activities`                | Track a new activity                          | Requires JSON body             |
| GET    | `/api/activities`                | Retrieve all activities for a user            | Requires `X-User-Id` header    |
| GET    | `/api/activities/{activityId}`   | Retrieve a specific activity by its ID        |                                |

#### Tested Endpoints

![img.png](activity-service/assets/img.png)
![img_3.png](activity-service/assets/img_3.png)
![img_4.png](activity-service/assets/img_4.png)
![img_5.png](activity-service/assets/img_5.png)

### Technical Summary

- Built with Java and Spring Boot, following industry-standard microservice practices.
- MongoDB chosen for its scalability and support for dynamic activity metrics.
- Clearly separated layers (DTO, Repository, Service, Controller) for maintainability and extensibility.
- All endpoints covered with HTTP request tests for reliability and easy onboarding.

### How to Test

- Sample HTTP requests can be found in `api-requests/activity-service`.
- Ensure MongoDB is running and configured as specified in `application.yml`.

**Note:** The activity-service is fully integrated into the Smart Fitness Companion architecture and ready for production-level use and future feature expansions.

---