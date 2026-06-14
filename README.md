# IncidentPilot

AI Incident Management System
🧠 Overview

This project is an AI-powered incident management system built with Next.js (App Router).
It allows users to submit technical incidents, receive AI-generated support responses, and escalate issues into structured support tickets for administrative review.

The system integrates:

OpenAI-compatible LLM API (Groq / LLaMA 3.1)
Serverless API routes (Next.js Route Handlers)
In-memory ticketing system
Incident prioritization via AI classification
Admin-ready ticket retrieval endpoint
🏗️ Architecture
app/
 ├── form/
 │    └── page.js            # User incident submission UI
 │
 ├── api/
 │    ├── ai/
 │    │    └── route.js      # AI support agent endpoint
 │    │
 │    └── tickets/
 │         ├── create/route.js
 │         └── list/route.js # Admin ticket retrieval
 │
 ├── lib/
 │    └── tickets.js         # In-memory ticket store

⚙️ Core Features
1. 🧾 Incident Submission

Users submit:

Full name
Email
Location
Incident description

Stored in a temporary conversation state and sent to AI.

2. 🤖 AI Support Agent

Endpoint:

POST /api/ai
Behavior:
Acts as a technical IT support agent
Maintains conversation context
Returns structured JSON:
{
  "message": "Technical response or question",
  "priority": "low | medium | high | critical"
}
Prompt constraints:
Must not hallucinate physical actions
Must escalate unresolved issues
Must classify severity dynamically
3. 🚨 Ticket Creation System

Endpoint:

POST /api/tickets/create
Features:

Generates unique ticket ID:

TCK-{timestamp}
Stores:
user
email
location
conversation history
AI-assigned priority
Performs basic abuse filtering (keyword-based moderation)
Logs ticket server-side
4. 📦 Ticket Storage Layer

File:

app/lib/tickets.js
export const tickets = [];

In-memory persistence model:

Non-persistent (resets on server restart)
Suitable for prototype / MVP
5. 📊 Ticket Listing API (Admin Panel Backend)

Endpoint:

GET /api/tickets/list

Returns:

[
  {
    "id": "TCK-123456789",
    "user": "John Doe",
    "email": "john@email.com",
    "location": { "address": "Barcelona" },
    "conversation": [],
    "status": "OPEN",
    "priority": "high"
  }
]
🧠 AI Prompt Engineering

System prompt defines strict behavior:

IT technical support assistant
Must ask clarifying questions if needed
Must never promise physical interventions
Must escalate unresolved cases
Must respond in structured JSON format
🎯 Incident Priority Model

Priority is assigned by AI:

Level	Meaning
low	minor issue / informational
medium	service degradation
high	system not working
critical	total outage / data loss
🖥️ Frontend Flow
User submits form (/form)
Request sent to /api/ai
AI returns structured response
UI displays:
AI message
priority badge
User can:
follow up
escalate to ticket
mark as solved
🚨 Escalation Flow

When user clicks:

🚨 Escalar Incidencia

System:

Sends conversation to /api/tickets/create
Generates ticket object
Assigns priority from AI
Stores in memory
Returns success response
🧪 Known Limitations
❌ No persistent database (tickets are in-memory)
❌ No authentication layer
❌ No real-time admin dashboard yet
❌ No WebSocket updates
❌ AI responses depend on external API latency
📡 Tech Stack
Next.js 13+ (App Router)
React (Client Components)
Groq API (LLaMA 3.1)
Node.js serverless functions
In-memory state storage
🔐 Security Notes
Basic profanity filtering implemented
No user authentication currently
API keys stored via environment variables
No persistent storage (reduces data exposure risk)
-------------------------------------------------------------------------------------------------
🚀 Future Improvements
PostgreSQL / MongoDB integration
Admin dashboard /incidencias
Ticket filtering by priority
Authentication (JWT / NextAuth)
Real-time updates (WebSockets)
AI memory per user session
SLA tracking system
📌 Summary

This project implements a minimal SaaS-style IT support system powered by AI, combining:

Incident intake
AI-based triage
Ticket escalation
Admin-ready data pipeline