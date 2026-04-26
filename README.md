# Aletheia – Library Management & E-Learning Platform

## Overview

This project was developed as part of the **PIDEV – 4th Year Engineering Program** at **Esprit School of Engineering** (Academic Year 2025–2026).

Aletheia is a full-stack microservices-based web application for library management and e-learning. It enables learners to browse and purchase digital library resources, explore and enroll in courses, track their learning progress, book campus resources, and attend virtual events. Instructors can create and manage course content, while administrators oversee users, library inventory, offers, and platform analytics. The application also features an immersive **3D campus exploration** experience built with Three.js.

## Features

### Learner

- 🔐 **Authentication & Authorization** – JWT-based login/register with role-based access (Admin, Instructor, Learner)
- 🌌 **3D Campus Explorer** – Walk an interactive 3D campus with six buildings, a central fountain, stone benches, and animated lighting, all built with Three.js
- 📚 **Digital Library** – Browse, search, and filter library resources (books, PDFs, exams, children materials) with category-colored cards and real-time stock indicators
- 🛒 **Shopping Cart & Checkout** – Add library items to cart and complete purchases
- 🎓 **Course Catalog** – Explore available courses with descriptions, categories, and offers
- 📖 **Course Learning** – Enroll in and progress through course lessons and videos
- 📝 **Assessments** – Take course assessments and view results
- 🏆 **Certificates** – Earn and verify course completion certificates (QR-code based)
- 🎥 **Video Rooms** – Join live or recorded video sessions
- 📅 **Events** – Browse and register for platform events
- 💼 **Offers & Subscriptions** – Access discounted course offers and subscription plans
- 📊 **Learner Dashboard** – Track enrolled courses, purchases, and progress
- 👤 **User Profile** – Manage personal info and upload avatar via Cloudinary
- 🗓️ **Resource Booking** – Check availability and reserve rooms, devices, and materials

### Instructor / Trainer

- ✏️ **Course Management** – Create, edit, and publish courses and lessons
- 📋 **Assessment Management** – Build and manage quizzes and assessments
- 🎓 **Certificate Management** – Issue certificates to learners
- 📊 **Trainer Dashboard** – Overview of own courses and learner activity

### Admin

- 👥 **User Management** – View, create, update, and deactivate platform users
- 📚 **Library Admin** – Manage library products, stock levels, and categories
- 🗓️ **Resource Admin** – Manage rooms, devices, materials, and reservations
- 🗓️ **Events Admin** – Create and manage platform events
- 💼 **Offers & Flash Sales** – Configure course offers, flash sales, and coupons
- 💳 **Subscriptions** – Manage subscription plans and member allocations
- 📊 **Admin Analytics** – Platform-wide analytics and reporting dashboard
- 🌗 **Dark/Light Theme** – Toggle between dark and light UI modes

## Tech Stack

### Frontend


| Technology        | Version | Purpose                    |
| ----------------- | ------- | -------------------------- |
| **Angular**       | 16      | SPA framework              |
| **TypeScript**    | 5.1     | Language                   |
| **Three.js**      | 0.183   | 3D campus rendering        |
| **Bootstrap**     | 5.3     | UI components              |
| **RxJS**          | 7.x     | Reactive programming       |
| **Chart.js**      | –       | Analytics charts           |
| **jsPDF**         | –       | Certificate PDF generation |
| **QRCode**        | –       | Certificate QR codes       |
| **Signature Pad** | –       | Digital signature support  |


### Backend


| Technology                | Version         | Purpose                        |
| ------------------------- | --------------- | ------------------------------ |
| **Java**                  | 17              | Language                       |
| **Spring Boot**           | 3.3 / 4.0       | Microservice framework         |
| **Spring Cloud**          | 2023.x / 2025.x | Service discovery & gateway    |
| **Spring Security + JWT** | –               | Authentication & authorization |
| **Spring Data JPA**       | –               | Database ORM                   |
| **MySQL**                 | 8               | Relational database            |
| **Lombok**                | –               | Boilerplate reduction          |
| **MapStruct**             | –               | DTO mapping                    |
| **Cloudinary**            | –               | Image/avatar upload            |
| **Springdoc OpenAPI**     | –               | Swagger UI API docs            |
| **Maven**                 | 3.8+            | Build tool                     |


## Microservices Architecture


| Service                | Port | Description                                              |
| ---------------------- | ---- | -------------------------------------------------------- |
| **Eureka**             | 8761 | Service discovery server                                 |
| **API Gateway**        | 8080 | Centralized routing via Spring Cloud Gateway             |
| **User Service**       | 8081 | User authentication, profiles, and management            |
| **Courses**            | 8082 | Course management, enrollment, assessments, certificates |
| **Library**            | 8083 | Library products, stock, cart, and checkout              |
| **ResourceManagement** | 8094 | Room/device/material availability and reservations       |
| **Events**             | 8085 | Event creation and registration                          |
| **Offer**              | 8086 | Offers, flash sales, coupons, and subscriptions          |


## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                      Angular Frontend                        │
│         (Angular 16 · Bootstrap 5 · Three.js 0.183)          │
└────────────────────────┬─────────────────────────────────────┘
                         │ HTTP / REST
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                       API Gateway                            │
│               (Spring Cloud Gateway – WebFlux)               │
└───┬──────────┬──────────┬──────────┬──────────┬─────────┬───┘
    │          │          │          │          │         │
    ▼          ▼          ▼          ▼          ▼         ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│  User  │ │Courses │ │Library │ │Resource│ │ Events │ │ Offer  │
│Service │ │Service │ │Service │ │  Mgmt  │ │Service │ │Service │
└───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘
    │          │          │          │           │          │
    └──────────┴──────────┴──────────┴───────────┴──────────┘
                               │
                               ▼
                  ┌────────────────────────┐
                  │    MySQL Database(s)    │
                  └────────────────────────┘

         All services registered via Eureka Service Discovery
```

## Project Structure

```
Aletheia/
├── frontend/                  # Angular 16 SPA
│   └── src/app/
│       ├── front-office/      # Learner-facing pages
│       │   ├── explore3d/     # Three.js 3D campus
│       │   ├── library/       # Digital library & cart
│       │   ├── resources/     # Resource booking
│       │   ├── catalog/       # Course catalog
│       │   ├── course-learning/
│       │   ├── events/
│       │   ├── offers-list/
│       │   └── dashboard/
│       ├── back-office/       # Admin / trainer pages
│       │   ├── manage-library/
│       │   ├── manage-users/
│       │   ├── resources/
│       │   ├── events/
│       │   ├── admin-offers/
│       │   ├── admin-analytics/
│       │   └── ...
│       └── core/              # Services, guards, models
├── backend/
│   ├── eureka/                # Service discovery
│   ├── config-server/         # Config centralisée
│   ├── ApiGateway/            # Gateway routing
│   ├── microservices/         # 7 services (branche type course-managment)
│   │   ├── user-service/      # Auth & comptes
│   │   ├── courses/           # Formations, évaluations, certificats
│   │   ├── Library/           # Médiathèque, panier
│   │   ├── offer/             # Offres & abonnements (Java)
│   │   ├── events/
│   │   ├── ResourceManagement/
│   │   └── Notification/      # API notifications (Python / FastAPI)
│   └── ml/                    # optionnel
│       └── offer-recommendation/  # Python (reco abonnement) + données
└── README.md
```

## Getting Started

### Prerequisites

- **Java** 17+
- **Node.js** 18+ & **npm**
- **Angular CLI** 16
- **Maven** 3.8+
- **MySQL** 8+

### Backend Setup

Start services in this order (Eureka must be first):

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
   cd backend/microservices/user-service
   ./mvnw spring-boot:run
  ```
4. **Start the Courses Service**
  ```bash
   cd backend/microservices/courses
   ./mvnw spring-boot:run
  ```
5. **Start the Library Service**
  ```bash
   cd backend/microservices/Library
   ./mvnw spring-boot:run
  ```
6. **Start the Resource Management Service**
  ```bash
   cd backend/microservices/ResourceManagement
   ./mvnw spring-boot:run
  ```
7. **Start the Events Service**
  ```bash
   cd backend/microservices/events
   ./mvnw spring-boot:run
  ```
8. **Start the Offer Service**
  ```bash
   cd backend/microservices/offer
   ./mvnw spring-boot:run
  ```

Machine learning (recommandation d’abonnement) : scripts Python dans `backend/ml/offer-recommendation/`. L’image Docker y copie ce dossier vers `/app/ml/offer-recommendation/`.

> ⚠️ Make sure MySQL is running and the required databases are created before starting services. Update `application.properties` in each service with your database credentials.

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

### Default Routes


| URL                 | Page               |
| ------------------- | ------------------ |
| `/`                 | Landing / Home     |
| `/explore`          | 3D Campus Explorer |
| `/front/library`    | Digital Library    |
| `/front/resources`  | Resource Booking   |
| `/front/courses`    | Course Catalog     |
| `/front/offers`     | Offers & Plans     |
| `/dashboardLearner` | Learner Dashboard  |
| `/dashboardAdmin`   | Admin Dashboard    |


## API Documentation

Once services are running, Swagger UI is available at:

- User Service: `http://localhost:8081/swagger-ui.html`
- Library Service: `http://localhost:8083/swagger-ui.html`
- Resource Management: `http://localhost:8094/swagger-ui.html`

## Contributors


| Name | Role | GitHub |
| ---- | ---- | ------ |
|      |      |        |
|      |      |        |
|      |      |        |
|      |      |        |


## Academic Context

Developed at **Esprit School of Engineering – Tunisia**  
**PIDEV – 4SAE9** | Academic Year 2025–2026

## Acknowledgments

- **Esprit School of Engineering** – For providing the academic framework and guidance
- **Spring Boot & Spring Cloud** – Microservices framework
- **Angular** – Frontend framework
- **Three.js** – 3D visualization library
- All open-source contributors whose libraries made this project possible

