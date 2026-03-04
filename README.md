#Aletheia – Intelligent Platform for Training & Professional Certifications
## Overview
Aletheia est une plateforme intelligente de nouvelle génération dédiée à la gestion des formations et des certifications professionnelles. Elle a été conçue pour transformer l'apprentissage en entreprise en une expérience fluide, sécurisée et axée sur les données.
Grâce à son architecture Microservices, Aletheia offre une modularité totale, permettant aux organisations de gérer des parcours pédagogiques complexes, des bibliothèques de ressources massives et des processus de certification rigoureux, tout en intégrant des interactions en temps réel.
## Contributors & Core Modules
Le succès d'Aletheia repose sur la collaboration de cinq pôles d'expertise, chacun pilotant un microservice métier critique :
Leader	Module	Focus Métier
Manef Akrim	Course Management	Ingénierie pédagogique, structuration des modules et gestion du cycle de vie des cours.
Jasser Noomani	Library Management	Gestion intelligente des actifs numériques et centralisation des ressources de formation.
Skander Ferjani	Certification Management	Moteur d'évaluation avancé, algorithmes anti-triche (Shuffle), scoring en temps réel et correction pédagogique.
Saif Ayed	Offre Management	Stratégies de monétisation, gestion des remises et marketing des offres de formation.
Ayoub Bel Gacem	Live Room	Hub de collaboration synchrone et salles de classe virtuelles haute performance.
## Key Features
### Smart Learning Experience
Centre de Certification Intelligent :
Randomization Engine : Algorithme de mélange (Shuffle) des questions et des options pour garantir l'unicité de chaque tentative.
Advanced Correction Mode : Système de revue post-examen permettant aux apprenants d'analyser leurs erreurs par rapport aux meilleures pratiques.
Visual Feedback : Gamification avec barre de progression interactive et célébrations de succès (Confetti UI).
Collaboration Live : Sessions interactives en temps réel pour briser l'isolement de l'apprentissage à distance.
### Professional Administration
Pilotage de Catalogue : Création intuitive de contenus par les instructeurs.
Ressources Centralisées : Accès instantané à une bibliothèque multimédia structurée.
Gestion Commerciale : Optimisation des revenus grâce à un module d'offres flexible.
## Tech Stack
Frontend (User Interface)
Framework : Angular 16+
Styling : Bootstrap 5 & SCSS (Custom theme)
State & Logic : RxJS (Programmation réactive)
Animations : Canvas-Confetti & CSS Transitions
Backend (Distributed System)
Framework : Spring Boot 3.x
Infrastructure Cloud :
Netflix Eureka : Service Discovery pour une communication fluide entre services.
Spring Cloud Gateway : Point d'entrée unique gérant le routage intelligent (Port 8089).
Data & Persistence : Spring Data JPA (Hibernate) & MySQL.
Logging & Debug : Niveaux de trace TRACE/INFO pour une supervision précise des flux Gateway.
## System Architecture
Aletheia utilise un écosystème distribué où chaque service est autonome :
Eureka Server : Annuaire centralisé des instances (Port 8761).
Api Gateway : Routage dynamique des requêtes Frontend vers les microservices.
Microservices Métiers :
courses-service (Port 8081) : Cœur de l'apprentissage et des certifications.
library-service (Port 8082) : Stockage et gestion documentaire.
aletheia-platform (Port 8080) : Gestion des profils et de la sécurité.
## Getting Started
Installation
Clone the Repository :
git clone https://github.com/Ma9nef/pi-dev_OG-s.git
### Backend Startup Sequence :
Lancez d'abord le microservice Eureka Server.
Démarrez ensuite les microservices métiers (Course, Library, etc.).
Enfin, lancez l'Api Gateway pour activer l'accès externe.
### Frontend Startup :
cd frontend
npm install
ng serve
Accédez à la plateforme via : http://localhost:4200
## Academic Context
Ce projet a été développé dans le cadre du cursus d'ingénieur à l'ESPRIT. Il illustre la mise en œuvre de patterns d'architecture microservices pour répondre à des problématiques métier complexes dans le domaine de la EdTech.
## Acknowledgments
L'équipe pédagogique d'ESPRIT pour le mentorat technique.
Les communautés Spring et Angular pour la richesse de leurs écosystèmes.
