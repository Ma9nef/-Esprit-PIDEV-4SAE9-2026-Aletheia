# Aletheia – Library Management & E-Learning Platform

## Overview

This project was developed as part of the **PIDEV – 3rd Year Engineering Program** at **Esprit School of Engineering** (Academic Year 2025–2026).

Aletheia is a full-stack microservices-based web application for library management and e-learning. It enables learners to browse and access a digital library, explore courses, and track their learning progress. Instructors can manage courses and content, while administrators oversee users, library resources, and the overall platform. The application also features an immersive **3D exploration** experience.

## Features

- 🔐 **Authentication & Authorization** – Secure JWT-based login/register with role-based access (Admin, Instructor, Learner)
- 📚 **Library Management** – Browse, search, and manage digital library resources
- 🎓 **Course Catalog** – Explore available courses with detailed descriptions
- 📖 **Course Learning** – Enroll in and progress through course content
- 👥 **User Management** – Admin panel for managing platform users
- 🌌 **3D Exploration** – Interactive 3D experience using Three.js
- 📊 **Role-Based Dashboards** – Dedicated dashboards for Admins, Instructors, and Learners
- 👤 **User Profiles** – Manage personal profile and uploaded avatar via Cloudinary
- 🌗 **Dark/Light Theme** – Toggle between dark and light modes
- 🔍 **Search** – Global search functionality across courses

## Tech Stack

### Frontend

- **Angular** 16
- **TypeScript** 5.1
- **Bootstrap** 5
- **Three.js** – 3D rendering and exploration
- **RxJS** – Reactive programming

### Backend

- **Java** 17
- **Spring Boot** 3.3 / 4.0
- **Spring Cloud** (2023.x / 2025.x)
- **Spring Security** – Authentication & authorization with JWT
- **Spring Data JPA** – Database access
- **Spring Data REST** – RESTful API exposure
- **MySQL** – Relational database
- **Lombok** – Boilerplate reduction
- **MapStruct** – DTO mapping
- **Cloudinary** – Image/avatar upload
- **Springdoc OpenAPI** – API documentation (Swagger UI)
- **Maven** – Build tool

### Microservices Architecture

| Service         | Description                                   |
|-----------------|-----------------------------------------------|
| **Eureka**      | Service discovery server                      |
| **API Gateway** | Centralized routing via Spring Cloud Gateway  |
| **User Service**| User authentication, profiles, and management |
| **Courses**     | Course management and enrollment              |
| **Library**     | Library resource management                   |

## Architecture

The application follows a **microservices architecture** with the following components:

```
┌────────────────────────────────────────────────────────┐
│                   Angular Frontend                     │
│         (Angular 16 + Bootstrap 5 + Three.js)          │
└──────────────────────┬─────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│                     API Gateway                          │
│           (Spring Cloud Gateway - WebFlux)                │
└──────────┬──────────┬──────────────┬─────────────────────┘
           │          │              │
           ▼          ▼              ▼
   ┌──────────┐ ┌──────────┐ ┌──────────────┐
   │  User    │ │ Courses  │ │   Library    │
   │ Service  │ │ Service  │ │   Service    │
   └────┬─────┘ └────┬─────┘ └──────┬───────┘
        │             │              │
        ▼             ▼              ▼
   ┌──────────────────────────────────────┐
   │             MySQL Database(s)         │
   └──────────────────────────────────────┘

   All services registered via Eureka Service Discovery
```

## Contributors

<!-- Add your team members here -->
| Name | Role | GitHub |
|------|------|--------|
|      |      |        |
|      |      |        |
|      |      |        |
|      |      |        |

## Academic Context

Developed at **Esprit School of Engineering – Tunisia**  
**PIDEV – 4SAE9** 2025–2026

> This project was developed as part of the PIDEV – 4th Year Engineering Program at **Esprit School of Engineering** (Academic Year 2025–2026).

## Getting Started

### Prerequisites

- **Java** 17+
- **Node.js** 18+ & **npm**
- **Angular CLI** 16
- **Maven** 3.8+
- **MySQL** 8+

### Backend Setup

1. **Start the Eureka Server**
   ```bash
   cd backend/eureka
   ./mvnw spring-boot:run
   ```

2. **Start the API Gateway**
   ```bash
   cd backend/ApiGateway
   ./mvnw spring-boot:run
   ```

3. **Start the User Service**
   ```bash
   cd backend/user-service
   ./mvnw spring-boot:run
   ```

4. **Start the Courses Service**
   ```bash
   cd backend/courses
   ./mvnw spring-boot:run
   ```

5. **Start the Library Service**
   ```bash
   cd backend/Library
   ./mvnw spring-boot:run
   ```

> ⚠️ Make sure MySQL is running and the required databases are created before starting the backend services. Update `application.properties` in each service with your database credentials.

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Run the development server**
   ```bash
   ng serve
   ```

3. Open your browser and navigate to `http://localhost:4200`

## Acknowledgments

- **Esprit School of Engineering** – For providing the academic framework and guidance
- **Spring Boot & Spring Cloud** – Microservices framework
- **Angular** – Frontend framework
- **Three.js** – 3D visualization library
- All open-source contributors whose libraries made this project possible
