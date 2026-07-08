# IncidentPilot

AI-Powered Field Service & Incident Management Platform

---

# 🧠 Overview

IncidentPilot is an intelligent incident management platform developed with **Next.js (App Router)** and powered by **Artificial Intelligence (Groq - Llama 3.1)**.

The platform assists users during the creation of IT incidents, automatically classifies their priority, generates technical summaries for support staff, assigns incidents to technicians and records the complete intervention history.

The goal is to reduce response times while improving communication between customers, technicians and administrators.

---

# 🚀 Main Features

## 👤 Customer Portal

Customers can:

- Report technical incidents
- Chat with the AI assistant
- Receive troubleshooting suggestions
- Escalate unresolved issues into an incident ticket

Collected information:

- Name
- Company
- Email
- Phone
- Address
- Conversation history

---

## 🤖 AI Assistant

Powered by:

- Groq API
- Llama 3.1 8B Instant

The AI:

- Guides the customer through troubleshooting
- Detects urgency
- Assigns incident priority
- Generates a technical summary for technicians
- Escalates unresolved issues

Example response:

```json
{
  "priority": "high",
  "summary": "Network connectivity failure affecting the office. Router appears operational but clients cannot access internal services."
}
```

---

# 🎫 Incident Management

Every incident includes:

- Incident ID
- Customer information
- Company
- Contact details
- Address
- Conversation
- AI Summary
- Priority
- Status
- Assigned technician
- Intervention history

Example:

```
INC-1783123456789
```

---

# 👨‍💼 Administrator Panel

The administrator can:

- View all incidents
- Delete incidents
- Filter by priority
- Filter by technician
- Assign technicians
- Reassign technicians
- Review the full AI conversation

---

# 👷 Technician Portal

Each technician has their own dashboard showing only assigned incidents.

For every incident they can view:

- Customer information
- AI technical summary
- Current status
- Intervention history

Technicians can update the incident through several stages:

- Assigned
- On the way
- At customer
- In progress
- Pending
- Completed

Each action is automatically stored in the incident history.

Example:

```
09:45
John Smith

Technician arrived on site
```

---

# 📖 Incident History

Every status update generates a permanent log entry including:

- Technician
- Action performed
- Timestamp

This creates a complete timeline of the intervention.

---

# 🤖 AI Summary

Instead of reading the full customer conversation, technicians receive an automatically generated summary containing only the relevant technical information.

Example:

> Internet connectivity lost after power outage.
> Router operational.
> Internal network unavailable.
> Customer already restarted equipment.

---

# 📋 Technician Completion Form

When an intervention is completed, technicians fill in a structured report including:

- Problem description
- Solution applied
- Replaced components
- Resolution status
- Pending work (if applicable)

This information becomes part of the incident record.

---

# 🗂 Current Storage

Current version:

```
tickets.json
```

This is temporary storage used during development.

Future versions will migrate to:

- SQLite
- Prisma ORM

without modifying the application logic.

---

# 🏗 Project Structure

```
app/

 ├── admin/
 │     ├── incidencias/
 │     └── trabajadores/
 │
 ├── worker/
 │     ├── dashboard/
 │     └── incidencia/
 │            └── [id]/
 │                 └── finalizar/
 │
 ├── api/
 │     ├── ai/
 │     ├── tickets/
 │     │      ├── create/
 │     │      ├── get/
 │     │      ├── list/
 │     │      ├── assign/
 │     │      ├── update-status/
 │     │      └── finalize/
 │     │
 │     └── workers/
 │
 └── lib/
        tickets.js
```

---

# ⚙ Technologies

- Next.js 16
- React
- App Router
- Groq API
- Llama 3.1
- Node.js
- JSON Storage (temporary)

Future:

- SQLite
- Prisma
- PDF generation
- Email notifications

---

# 🔐 Security

- Environment Variables
- Server-side API Routes
- Basic validation
- Abuse detection
- AI prompt restrictions

---

# 🚀 Roadmap

## Completed

- AI chat assistant
- Automatic incident creation
- AI priority classification
- AI-generated technical summaries
- Administrator dashboard
- Technician dashboard
- Technician assignment
- Incident history
- Status management
- Incident completion form

---

## In Progress

- Pending intervention workflow
- AI assistant for technicians
- SLA timers
- Technician performance analytics

---

## Planned

- SQLite migration
- Prisma ORM
- PDF intervention reports
- Digital signatures
- Customer satisfaction survey
- Email notifications
- Automatic PDF delivery
- AI-generated intervention report
- Analytics dashboard
- Knowledge base generation
- Multi-company support

---

# 🎯 Project Vision

IncidentPilot aims to become an AI-powered Service Desk platform capable of managing the complete lifecycle of technical incidents:

1. Customer assistance through AI
2. Intelligent incident classification
3. Automatic technician assignment
4. Real-time intervention tracking
5. AI-assisted technician workflow
6. Digital intervention reports
7. Customer validation and signatures
8. Continuous learning through incident history

The project is being developed as a scalable architecture, allowing future migration from local JSON storage to a relational database without changing the business logic.