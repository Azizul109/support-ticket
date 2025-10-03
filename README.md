📖 Overview
A full-stack customer support ticketing system with real-time chat built with Laravel 10, React 18, and MySQL.

Live Demo: https://support-ticket-md-azizul-arif.up.railway.app

🚀 Quick Start
Default Login Credentials
Admin: admin@support.com / password

Customer: customer@demo.com / password

Features
✅ User authentication & role management

✅ Ticket creation & management

✅ Real-time chat between customers and admins

✅ File attachments

✅ Comments system

✅ Responsive design

Installation Steps
Clone the repository

bash
git clone <your-repo-url>
cd support-ticketing-system
Install PHP dependencies

bash
composer install
Install Node.js dependencies

bash
npm install
Setup environment

bash
cp .env.example .env
php artisan key:generate
Configure database
Edit .env file:

env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=support_ticketing
DB_USERNAME=root
DB_PASSWORD=your_password
Run migrations & seed data

bash
php artisan migrate
php artisan db:seed
Build frontend assets

bash

# Development

npm run dev

# Production

npm run build
Start development server

bash
php artisan serve

📱 API Documentation
Authentication Endpoints
Register User
http
POST /api/register
Content-Type: application/json

{
"name": "John Doe",
"email": "john@example.com",
"password": "password",
"password_confirmation": "password"
}
Login
http
POST /api/login
Content-Type: application/json

{
"email": "admin@support.com",
"password": "Admin123!"
}
Response:

json
{
"access_token": "token_here",
"token_type": "Bearer",
"user": { ... }
}
Logout
http
POST /api/logout
Authorization: Bearer {token}
Ticket Endpoints
Get All Tickets
http
GET /api/tickets
Authorization: Bearer {token}
Create Ticket
http
POST /api/tickets
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
"subject": "Login issue",
"description": "Cannot login to my account",
"category": "technical",
"priority": "high",
"attachment": [file]
}
Get Single Ticket
http
GET /api/tickets/{id}
Authorization: Bearer {token}
Update Ticket
http
PATCH /api/tickets/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
"status": "in_progress",
"assigned_admin_id": 1
}
Comment Endpoints
Add Comment
http
POST /api/tickets/{ticketId}/comments
Authorization: Bearer {token}
Content-Type: application/json

{
"content": "This is a comment"
}
Chat Endpoints
Get Chat Messages
http
GET /api/tickets/{ticketId}/chat
Authorization: Bearer {token}
Send Message
http
POST /api/tickets/{ticketId}/chat
Authorization: Bearer {token}
Content-Type: application/json

{
"message": "Hello, how can I help?"
}

💬 Real-time Chat System
Overview
Technology: Polling-based real-time updates (2-second intervals)

Security: Private chat rooms per ticket

Participants: Ticket creator + assigned admin

Features: Read receipts, message history, file sharing

How It Works
Users open chat from ticket detail page

Messages are stored in database

Frontend polls for new messages every 2 seconds

Messages marked as read when viewed

Chat Interface
Customer View: Chat with assigned admin

Admin View: Chat with ticket creator

Real-time: Messages appear without page refresh
