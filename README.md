# Aletheia – Intelligent Platform for Training & Professional Certifications
## Overview
Aletheia is a next-generation intelligent platform dedicated to the management of corporate training and professional certifications. It was designed to transform corporate learning into a fluid, secure, and data-driven experience.
Built on a Microservices architecture, Aletheia offers total modularity, allowing organizations to manage complex pedagogical paths, massive digital resource libraries, and rigorous certification processes, while integrating real-time interactions.
## Contributors & Core Modules
Aletheia's success is driven by five core areas of expertise, each leading a critical business microservice:
Leader	Module	Business Focus
Manef Akrim	Course Management	Instructional engineering, module structuring, and course lifecycle management.
Jasser Noomani	Library Management	Intelligent digital asset management and centralized training resource hub.
Skander Ferjani	Certification Management	Advanced assessment engine, anti-cheat algorithms (Shuffle), real-time scoring, and pedagogical feedback.
Saif Ayed	Offer Management	Monetization strategies, discount management, and training offer marketing.
Ayoub Bel Gacem	Live Room	High-performance synchronous collaboration hub and virtual classrooms.

## Key Features
### Smart Learning Experience
Intelligent Certification Center:
Randomization Engine: A shuffling algorithm for questions and options to ensure a unique attempt for every learner.
Advanced Correction Mode: A post-exam review system allowing learners to analyze their mistakes against best practices.
Visual Feedback: Gamification features including interactive progress bars and success celebrations (Confetti UI).
Live Collaboration: Real-time interactive sessions designed to break the isolation of remote learning.
### Professional Administration
Catalog Management: Intuitive content creation tools for instructors.
Centralized Resources: Instant access to a structured multimedia library.
Commercial Management: Revenue optimization through a flexible offer and discount module.
## Tech Stack
Framework: Angular 16+
Styling: Bootstrap 5 & SCSS (Custom theme)
State & Logic: RxJS (Reactive programming)
Animations: Canvas-Confetti & CSS Transitions
Backend (Distributed System)
Framework: Spring Boot 3.x
Cloud Infrastructure:
Netflix Eureka: Service Discovery for seamless inter-service communication.
Spring Cloud Gateway: Single entry point managing intelligent routing (Port 8089).
Data & Persistence: Spring Data JPA (Hibernate) & MySQL.
Logging & Debug: Detailed TRACE/INFO levels for precise monitoring of Gateway flows.
## System Architecture
Aletheia utilizes a distributed ecosystem where each service is autonomous:
Eureka Server: Centralized service registry (Port 8761).
API Gateway: Dynamic routing of Frontend requests to specific microservices.
Business Microservices:
courses-service (Port 8081): The core of learning and certifications.
library-service (Port 8082): Storage and document management.
aletheia-platform (Port 8080): Profile management and security.
## Getting Started
Installation
Clone the Repository:
code
Bash
git clone https://github.com/Ma9nef/pi-dev_OG-s.git
### Backend Startup Sequence :
Launch the Eureka Server microservice first.
Start the business microservices (Course, Library, User, etc.).
Launch the API Gateway last to enable external access.
### Frontend Startup :
cd frontend
npm install
ng serve
Access the platform via: http://localhost:4200
## Academic Context
his project was developed as part of the engineering curriculum at ESPRIT. It demonstrates the implementation of microservices architecture patterns to solve complex business challenges in the EdTech sector.
## Acknowledgments
The ESPRIT teaching staff for technical mentorship.
The Spring and Angular communities for their rich ecosystems.
