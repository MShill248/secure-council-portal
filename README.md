# ECHO - Secure Council Portal

ted features with correct name
ali feature branch

b's features

Docker Setup

This project can be run entirely in Docker using Docker Compose.

Prerequisites

Docker Desktop
 installed and running.

Run the application
docker compose up --build -d


--build builds the images if needed.

-d runs the containers in the background.

Services started
Service	Port	Description
scp-api	3000	Node/Express API
scp-db	5432	PostgreSQL database seeded from scp-database.sql
Check it’s working

Open http://localhost:3000/user
 to see user data coming from the database.

Stop the containers
docker compose down
