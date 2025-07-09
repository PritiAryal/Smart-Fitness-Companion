# Smart Fitness Companion

An **AI-powered fitness application** that delivers personalized workout recommendations, intelligent progress tracking, and secure user experiences—built using a modern microservices architecture.

## Overview

Smart Fitness Companion leverages cutting-edge technologies and AI to transform the fitness journey for users. Designed with scalability, security, and personalization at its core, this platform aims to empower users to achieve their fitness goals through tailored workout plans, progress analytics, and seamless, secure access.

## Key Features (Planned)

- **Personalized Workouts:** AI-driven routines and recommendations using Gemini AI.
- **Progress Tracking:** Intelligent analytics to monitor improvements and suggest next steps.
- **User Security:** Enterprise-grade authentication and authorization powered by Keycloak.
- **Modern Microservices:** Each functional domain (user management, workouts, tracking, etc.) is isolated for agility and scalability.
- **Robust Communication:** Asynchronous service integration via RabbitMQ.
- **Flexible Data Storage:** Support for PostgreSQL/MySQL.
- **Service Discovery & Gateway:** Eureka and Spring Cloud Gateway for dynamic routing and service registration.
- **Web Interface:** Responsive frontend with React.

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

## Current Progress

### User Service

The initial phase focuses on building a robust **user service** as the foundation for secure and scalable user management. This includes:

- User registration and authentication endpoints
- Integration plans for Keycloak (OAuth2)
- Data persistence with relational databases (PostgreSQL/MySQL)
- Microservice-ready architecture using Spring Boot

![img.png](user-service/assets/img.png)
![img_1.png](user-service/assets/img_1.png)
![img_2.png](user-service/assets/img_2.png)

> **Note:** Details on endpoints, usage, and deployment instructions will be included as the implementation progresses.

## Repository Structure

> The codebase is evolving; as of now, the primary focus is on the backend user service. Additional microservices and the frontend will be introduced in subsequent phases.