<img width="811" height="229" alt="Artboard 6 copy" src="https://github.com/user-attachments/assets/99673889-a785-4626-928d-109903083ad4" />



# Madarik Tech Business OS
## Product Requirements Document (PRD)
### Version 1.1 — June 2026 (Updated: 10 Additional Modules)
### Prepared for: Madarik Tech
### Tech Stack: React (Vite + TypeScript) · Laravel · MySQL

---

> *"In the name of Allah, the Most Gracious, the Most Merciful"*
>
> *"And it is He who has subjected the sea for you to eat from it tender meat and to extract from it ornaments which you wear. And you see the ships plowing through it, and [He subjected it] so you may seek of His bounty; and perhaps you will be grateful."* — Quran 16:14

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Business Analysis](#2-business-analysis)
3. [Product Vision](#3-product-vision)
4. [User Personas](#4-user-personas)
5. [Functional Requirements](#5-functional-requirements)
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [System Modules — Detailed Specifications](#7-system-modules--detailed-specifications)
8. [Workflows & Business Logic](#8-workflows--business-logic)
9. [Database Design](#9-database-design)
10. [User Permissions Matrix (RBAC)](#10-user-permissions-matrix-rbac)
11. [Dashboard Design](#11-dashboard-design)
12. [Automation Opportunities](#12-automation-opportunities)
13. [Reporting Architecture](#13-reporting-architecture)
14. [PDF Generation System](#14-pdf-generation-system)
15. [WhatsApp & Email Integration](#15-whatsapp--email-integration)
16. [File Management System](#16-file-management-system)
17. [Client Portal](#17-client-portal)
18. [CRM Sales Pipeline](#18-crm-sales-pipeline)
19. [Future Roadmap](#19-future-roadmap)
20. [Technical Recommendations](#20-technical-recommendations)
21. [MVP Scope — Phase 1](#21-mvp-scope--phase-1)
22. [Phase 2 Scope](#22-phase-2-scope)
23. [Phase 3 Scope](#23-phase-3-scope)
24. [Risks & Challenges](#24-risks--challenges)
25. [Final Recommendations](#25-final-recommendations)

---

## 1. Executive Summary

### 1.1 Overview

**Madarik Tech Business OS** is a comprehensive internal business management platform designed to serve as the central nervous system of Madarik Tech's operations. It consolidates every business function — from lead generation to project delivery, invoicing, collections, and long-term client relationship management — into a single, unified platform.

The system is architected using **React (Vite + TypeScript)** on the frontend, **Laravel** on the backend, and **MySQL** as the database engine. It is designed from day one with **SaaS-readiness** in mind, allowing future commercialization as a multi-tenant platform sold to other businesses in the MENA region.

### 1.2 The Core Problem

Madarik Tech, like most growing software houses and technology agencies, currently suffers from fragmented operations:

- Client data scattered across WhatsApp, Excel, and email
- No unified view of project profitability
- Manual PDF generation for quotations, contracts, and invoices
- No structured sales pipeline or lead tracking
- No client self-service portal
- No automated reminders or follow-up workflows
- No real-time visibility into company financial health

### 1.3 The Solution

A unified **Business Operating System** that replaces all fragmented tools with a single platform covering:

| Domain | Capability |
|--------|-----------|
| Sales | CRM pipeline, lead tracking, quotation management |
| Operations | Project management, task tracking, daily reports |
| Finance | Invoicing, expense tracking, P&L analysis |
| Legal | Contract management with e-signature readiness |
| Communication | WhatsApp + Email integration, notification center |
| Client Relations | Dedicated client portal |
| Intelligence | Executive dashboards, analytics, KPIs |
| Knowledge | Internal knowledge base, SOP management |

### 1.4 Business Impact Targets

| KPI | Current State | Target (12 months post-launch) |
|-----|--------------|-------------------------------|
| Lead-to-client conversion rate | Unknown/manual | Tracked, target 30%+ |
| Invoice collection time | Untracked | Reduced by 40% |
| Report generation time | 30–60 min manual | Under 2 minutes automated |
| Project overrun rate | Unknown | Tracked, target below 15% |
| Client satisfaction | No measurement | Portal adoption 80%+ |
| Revenue visibility | Monthly manual | Real-time dashboard |

---

## 2. Business Analysis

### 2.1 Madarik Tech Business Model Analysis

Madarik Tech operates across **six distinct revenue streams**, each with unique operational requirements:

#### 2.1.1 Software House
- **Revenue Model:** Fixed-price and milestone-based projects
- **Clients:** SMEs, government entities, corporations
- **Key Needs:** Project tracking, milestone billing, progress reports, technical documentation
- **Pain Points:** Scope creep, payment delays, client communication gaps

#### 2.1.2 Marketing Agency
- **Revenue Model:** Retainer-based and campaign-based
- **Clients:** Brands, e-commerce businesses, retail chains
- **Key Needs:** Campaign tracking, monthly reports, recurring invoicing, content deliverable management
- **Pain Points:** Reporting overhead, approval cycles, performance visibility

#### 2.1.3 AI Solutions Provider
- **Revenue Model:** Custom development + subscription licensing
- **Clients:** Enterprises seeking automation
- **Key Needs:** Complex project documentation, ROI reporting, technical proposals
- **Pain Points:** Long sales cycles, technical complexity in proposals

#### 2.1.4 ERP/CRM Provider
- **Revenue Model:** Implementation fees + annual maintenance
- **Clients:** Medium to large businesses
- **Key Needs:** Multi-phase project management, contracts, change orders, SLAs
- **Pain Points:** Change requests, go-live delays, post-delivery support tracking

#### 2.1.5 Mobile App Development
- **Revenue Model:** Fixed-price per platform + maintenance retainers
- **Clients:** Startups, established businesses launching digital products
- **Key Needs:** UI/UX approval workflows, milestone-based billing, testing reports
- **Pain Points:** Design revision cycles, deployment coordination

#### 2.1.6 SaaS Products (POS Pixel Pro, PRO SYS, WhatsApp AI Agent)
- **Revenue Model:** Monthly/annual subscriptions + one-time setup fees
- **Clients:** Retail businesses, restaurants, service companies
- **Key Needs:** Subscription management, license tracking, renewal reminders, usage-based billing
- **Pain Points:** Churn tracking, renewal follow-up, support ticket integration

### 2.2 Competitive Positioning

Madarik Tech's platform is not a generic project management tool. It is a **domain-specific Business OS** designed for:

- Arabic-first market (MENA)
- WhatsApp-native communication (preferred channel in the region)
- Islamic branding and cultural alignment
- Multi-currency awareness (SAR, AED, KWD, USD)
- Compliance with regional business documentation standards

### 2.3 Operational Efficiency Opportunities

| Process | Current State | Optimized State |
|---------|--------------|----------------|
| Quotation creation | Manual Word/Excel | Templated, auto-calculated, one-click send |
| Contract generation | Manual | Template-driven with dynamic field injection |
| Invoice creation | Manual | Auto-generated from approved quotations |
| Client reporting | Manual document | Structured form → auto-PDF → auto-send |
| Payment follow-up | Manual WhatsApp | Automated reminder sequences |
| Lead tracking | WhatsApp/notes | CRM pipeline with stage tracking |
| P&L analysis | Monthly Excel | Real-time per-project dashboard |

---

## 3. Product Vision

### 3.1 Vision Statement

> **"To build the most powerful, culturally-aligned, and operationally complete Business OS for technology companies in the MENA region — starting with Madarik Tech as the first power user, and scaling to a commercial SaaS product serving hundreds of businesses."**

### 3.2 Mission

To eliminate operational friction at every stage of the business lifecycle — from the first lead interaction to the final payment collection — by providing a unified, intelligent, and beautifully designed platform that gives business owners complete visibility and control over their company.

### 3.3 Core Design Principles

| Principle | Description |
|-----------|-------------|
| **Centralization** | Everything in one place. No switching between tools. |
| **Speed** | Every action should take seconds, not minutes. |
| **Professionalism** | Every output (PDF, email, report) must reflect Madarik Tech's brand quality. |
| **Automation** | Repetitive tasks must be automated. Human time should be reserved for high-value work. |
| **Visibility** | Real-time data. No surprises. Complete financial and operational clarity. |
| **Cultural Fit** | Arabic support, Islamic elements, WhatsApp-native workflows. |
| **Scalability** | Built for 1 company today, architected for 1,000 companies tomorrow. |

### 3.4 Success Metrics

- **Operational:** 80% reduction in time spent on document creation
- **Financial:** 100% of invoices tracked with real-time collection status
- **Sales:** Full pipeline visibility with conversion rate tracking
- **Client:** 70%+ of clients actively using the client portal
- **Strategic:** Platform ready for SaaS commercialization within 18 months of MVP launch

---

## 4. User Personas

### Persona 1: The Business Owner (Primary User)

| Attribute | Detail |
|-----------|--------|
| **Name** | Abdullah — Founder & CEO |
| **Role** | Owner, Super Admin |
| **Goals** | Complete visibility over the business, real-time financial health, strategic decision-making |
| **Pain Points** | Lacks a unified view; spends time chasing information across tools |
| **Key Features** | Executive Dashboard, P&L Reports, CRM Pipeline, Project Health Monitor |
| **Usage Pattern** | Daily — first thing in the morning review |
| **Technical Level** | Medium |

---

### Persona 2: The Sales Manager

| Attribute | Detail |
|-----------|--------|
| **Name** | Khalid — Sales Manager |
| **Role** | Sales Manager |
| **Goals** | Convert leads faster, track pipeline, create professional quotations quickly |
| **Pain Points** | No structured pipeline; loses track of follow-ups; quotation creation is slow |
| **Key Features** | CRM Pipeline, Quotations, Reminders, WhatsApp Integration |
| **Usage Pattern** | Multiple times per day |
| **Technical Level** | Medium |

---

### Persona 3: The Project Manager

| Attribute | Detail |
|-----------|--------|
| **Name** | Sara — Project Manager |
| **Role** | Project Manager |
| **Goals** | Deliver projects on time, track tasks, submit progress reports, manage team |
| **Pain Points** | No centralized task management; report creation is manual and time-consuming |
| **Key Features** | Projects, Tasks, Daily Reports, Team Management, Calendar |
| **Usage Pattern** | Continuous throughout the day |
| **Technical Level** | Medium-High |

---

### Persona 4: The Accountant

| Attribute | Detail |
|-----------|--------|
| **Name** | Fatima — Finance Manager |
| **Role** | Accountant |
| **Goals** | Track all invoices, manage expenses, generate P&L reports, follow up on overdue payments |
| **Pain Points** | No real-time financial visibility; payment tracking is manual |
| **Key Features** | Invoices, Expenses, P&L, Payment Tracking, Reports |
| **Usage Pattern** | Daily |
| **Technical Level** | Low-Medium |

---

### Persona 5: The Client

| Attribute | Detail |
|-----------|--------|
| **Name** | Ahmed — Client / Business Owner |
| **Role** | External Client |
| **Goals** | Monitor project progress, review and approve deliverables, download documents |
| **Pain Points** | Has to chase the company for updates; no self-service access |
| **Key Features** | Client Portal — Projects, Reports, Invoices, Quotations, Files |
| **Usage Pattern** | Weekly |
| **Technical Level** | Low |

---

## 5. Functional Requirements

### 5.1 Core Functional Requirements

| ID | Requirement | Priority | Module |
|----|-------------|----------|--------|
| FR-001 | System must allow creation and management of client profiles | Critical | Clients |
| FR-002 | System must support full CRM sales pipeline with stage tracking | Critical | CRM |
| FR-003 | System must generate professional PDF quotations | Critical | Quotations |
| FR-004 | System must convert accepted quotations to projects, contracts, or invoices | Critical | Quotations |
| FR-005 | System must track project progress, costs, and profitability | Critical | Projects |
| FR-006 | System must generate PDF contracts from templates | Critical | Contracts |
| FR-007 | System must manage invoices with full payment lifecycle tracking | Critical | Invoices |
| FR-008 | System must track expenses per project and category | Critical | Expenses |
| FR-009 | System must display real-time P&L per project and company-wide | Critical | P&L |
| FR-010 | System must manage tasks with priorities, deadlines, and status | Critical | Tasks |
| FR-011 | System must generate and send daily progress reports to clients | Critical | Reports |
| FR-012 | System must support PDF generation for all document types | Critical | PDF System |
| FR-013 | System must allow direct WhatsApp sharing of all documents | High | WhatsApp |
| FR-014 | System must provide a secure client portal | High | Client Portal |
| FR-015 | System must maintain a centralized notification center | High | Notifications |
| FR-016 | System must support role-based access control (RBAC) | Critical | Security |
| FR-017 | System must provide an executive dashboard with live KPIs | Critical | Dashboard |
| FR-018 | System must support file attachments linked to all records | High | Files |
| FR-019 | System must maintain a complete activity timeline per client/project | High | Activity |
| FR-020 | System must support global search across all modules | Medium | Search |
| FR-021 | System must provide a company calendar with all events | Medium | Calendar |
| FR-022 | System must support internal knowledge base | Medium | Knowledge |
| FR-023 | System must include reminder system with multi-channel delivery | High | Reminders |
| FR-024 | System must manage company products and services catalog | Medium | Products |
| FR-025 | System must track business opportunities and future ideas | Medium | Opportunities |
| FR-026 | System must support project health scoring | High | Projects |
| FR-027 | System must support project templates for rapid project setup | Medium | Projects |
| FR-028 | System must send automated payment reminders | High | Automation |
| FR-029 | System must support document approval workflow | Medium | Workflow |
| FR-030 | System must centralize all company settings for global template use | Critical | Settings |

---

## 6. Non-Functional Requirements

### 6.1 Performance

| Requirement | Target |
|-------------|--------|
| Page load time | Under 2 seconds |
| API response time | Under 500ms for standard queries |
| PDF generation time | Under 10 seconds |
| Dashboard load time | Under 3 seconds |
| Search response time | Under 1 second |
| Concurrent users supported (MVP) | 20+ |

### 6.2 Security

| Requirement | Detail |
|-------------|--------|
| Authentication | JWT tokens with refresh mechanism |
| Password policy | Minimum 8 characters, mixed case, numbers |
| Session management | Auto-logout after 60 minutes of inactivity |
| Data encryption | All sensitive data encrypted at rest and in transit (HTTPS/TLS) |
| API security | Laravel Sanctum for API authentication |
| Input validation | Server-side validation on all inputs |
| SQL injection prevention | Eloquent ORM with parameterized queries |
| XSS prevention | React's built-in escaping + CSP headers |
| RBAC enforcement | Every API endpoint must verify role permissions |
| Audit logging | All create/update/delete actions logged with user and timestamp |

### 6.3 Reliability & Availability

| Requirement | Target |
|-------------|--------|
| System uptime | 99.5%+ |
| Data backup | Daily automated backups |
| Error handling | Graceful error messages, no raw stack traces exposed |
| Data integrity | Foreign key constraints, transaction-based operations |

### 6.4 Usability

| Requirement | Detail |
|-------------|--------|
| Language support | Arabic (RTL) + English (LTR) with toggle |
| Responsive design | Desktop-first, tablet-friendly |
| UI framework | Tailwind CSS + shadcn/ui components |
| Accessibility | WCAG 2.1 AA compliance |
| Browser support | Chrome, Firefox, Edge, Safari (latest 2 versions) |

### 6.5 Scalability (SaaS-Ready Architecture)

| Requirement | Detail |
|-------------|--------|
| Multi-tenancy readiness | Database schema must include `tenant_id` on all tables from day one |
| Horizontal scaling | Stateless Laravel API, session stored in Redis |
| File storage | Abstract file storage (local in MVP, S3-compatible in production) |
| Queue system | Laravel Queues (Redis) for PDF generation, email, WhatsApp |
| Caching | Redis for dashboard KPIs and frequently accessed data |

---

## 7. System Modules — Detailed Specifications

---

### Module 1: Dashboard

#### 7.1.1 Purpose
The executive command center. Provides instant visibility into every dimension of the business — Islamic inspiration, live business health, financial status, and operational priorities.

#### 7.1.2 Dashboard Sections

**Section A — Islamic Header**
- Bismillah display (Arabic calligraphy style)
- Daily Quran verse (fetched from Quran API or stored locally, rotating daily)
- Daily motivational quote (Arabic and English)
- Current Hijri date alongside Gregorian date

**Section B — Live Clock & Date**
- Real-time clock display
- Current Gregorian and Hijri date

**Section C — Business Overview Cards**

| Card | Metric | Color Coding |
|------|--------|-------------|
| Total Clients | Count | Blue |
| Active Clients | Count | Green |
| Closed Clients | Count | Gray |
| Total Projects | Count | Blue |
| Projects In Progress | Count | Yellow |
| Completed Projects | Count | Green |
| Delayed Projects | Count | Red |

**Section D — Financial Overview Cards**

| Card | Metric | Detail |
|------|--------|--------|
| Total Revenue | Sum of all paid invoices | Current month + YTD |
| Outstanding Receivables | Sum of unpaid invoice amounts | With overdue indicator |
| Total Paid | Confirmed payments received | Current month + YTD |
| Total Expenses | Sum of all recorded expenses | Current month + YTD |
| Net Profit | Revenue minus expenses | With margin % |

**Section E — Productivity Overview**

| Widget | Content |
|--------|---------|
| Today's Tasks | Count of tasks due today |
| Upcoming Tasks | Tasks due in next 7 days |
| Upcoming Deadlines | Project deadlines within 14 days |
| Urgent Projects | Projects flagged as urgent or critical health |

**Section F — Active Projects Table**

Columns:
- Project Name (clickable link)
- Client Name
- Progress % (visual progress bar)
- Status badge (color-coded)
- Remaining Days
- Health Score
- Deadline Indicator (green/yellow/red)

Color logic for deadline indicator:
- **Green:** More than 14 days remaining
- **Yellow:** 7–14 days remaining
- **Red:** Under 7 days or overdue

**Section G — Sales Pipeline Snapshot**
- Total leads by stage (mini funnel visualization)
- Pipeline value (sum of estimated deal values of active leads)
- Leads requiring follow-up today

**Section H — Recent Activity Feed**
- Last 10 activities across all modules
- Timestamp, user, action, affected record

---

### Module 2: CRM Sales Pipeline

#### 7.2.1 Purpose
Track every potential opportunity from first contact to won deal. Eliminate lost leads due to lack of follow-up. Measure and improve conversion rates.

#### 7.2.2 Lead Stages (Kanban Pipeline)

```
New Lead → Contacted → Follow Up → Meeting Scheduled → Proposal Sent → Negotiation → Won / Lost
```

Each stage is a column in a Kanban board. Cards can be dragged between stages.

#### 7.2.3 Lead Data Model

| Field | Type | Required |
|-------|------|----------|
| Lead Name | Text | Yes |
| Company Name | Text | No |
| Mobile Number | Phone | Yes |
| WhatsApp Number | Phone | No (defaults to mobile) |
| Email | Email | No |
| Source | Enum | Yes |
| Country | Dropdown | No |
| Estimated Deal Value | Currency | No |
| Expected Closing Date | Date | No |
| Assigned To | User | No |
| Stage | Enum | Yes |
| Priority | Enum (Low/Medium/High) | No |
| Notes | Long text | No |
| Tags | Multi-select | No |
| Created At | Timestamp | Auto |
| Last Activity | Timestamp | Auto |

#### 7.2.4 Lead Sources

- Website Contact Form
- WhatsApp Direct
- Referral (with referrer name field)
- Facebook Ads
- Instagram
- LinkedIn
- Google Ads
- Cold Outreach
- Exhibition/Event
- Manual Entry
- Other

#### 7.2.5 CRM Actions

**On each lead card:**
- Move stage (drag or dropdown)
- Open WhatsApp directly
- Send email
- Add note
- Schedule follow-up reminder
- Convert to Client
- Create Quotation
- Create Project (only when Won)
- Log activity

#### 7.2.6 CRM Dashboard KPIs

| KPI | Calculation |
|-----|-------------|
| Total Leads | Count of all active leads |
| Total Opportunities | Leads in Proposal Sent, Negotiation |
| Pipeline Value | Sum of estimated deal values of non-Won/Lost leads |
| Closed Won Revenue | Sum of estimated deal values of Won leads |
| Conversion Rate | Won / (Won + Lost) × 100 |
| Average Deal Size | Total pipeline value / count of opportunities |
| Average Time to Close | Average days from creation to Won |
| Leads by Source | Breakdown chart |
| Stage Distribution | Count of leads per stage |

#### 7.2.7 Automations
- **Won lead:** Prompt to convert to Client, create Quotation, create Project
- **Follow-up due:** Automated reminder notification
- **No activity in X days:** Alert to assigned user
- **New lead from website:** Auto-created via API webhook

---

### Module 3: Clients

#### 7.3.1 Purpose
The master record for every business relationship. All activity — past, present, and future — is accessible from one client profile.

#### 7.3.2 Client Data Model

**Basic Information**

| Field | Type | Required |
|-------|------|----------|
| Client Name | Text | Yes |
| Company Name | Text | No |
| Mobile Number | Phone | Yes |
| WhatsApp Number | Phone | No |
| Email | Email | No |
| Country | Dropdown | No |
| City | Text | No |
| Industry | Dropdown | No |
| Client Type | Enum (Individual/Company) | Yes |
| Status | Enum | Yes |
| Assigned To | User | No |
| Source | Enum (from CRM) | Auto |
| Converted From Lead | Link | Auto |
| Tags | Multi-select | No |
| Notes | Long text | No |
| Created At | Timestamp | Auto |

**Client Status Enum:**
- Lead (pre-sale interest)
- Prospect (in active discussion)
- Active (current paying client)
- On Hold (paused relationship)
- Closed (completed all engagement)
- Churned (lost)

#### 7.3.3 Client Profile Tabs

Each client has a profile page with the following tabs:

| Tab | Contents |
|-----|----------|
| **Overview** | Summary cards, contact info, quick actions |
| **Projects** | All projects linked to this client |
| **Quotations** | All quotations created for this client |
| **Contracts** | All contracts linked to this client |
| **Invoices** | All invoices + payment status summary |
| **Expenses** | All expenses incurred for this client |
| **Tasks** | All tasks related to this client |
| **Reports** | All daily reports sent to this client |
| **Files** | All files linked to this client |
| **Notes** | Private internal notes with timestamps |
| **Activity** | Complete timeline of all interactions |

#### 7.3.4 Quick Action Buttons

Every client profile must have instant action buttons:
- 📱 Open WhatsApp (deep link to chat)
- 📧 Send Email
- 📄 New Quotation
- 🚀 New Project
- 🧾 New Invoice
- 📋 New Contract

#### 7.3.5 Client Financial Summary

Visible at the top of the client profile:

| Metric | Calculation |
|--------|-------------|
| Total Revenue | Sum of all paid invoices |
| Outstanding | Sum of unpaid invoice amounts |
| Total Projects | Count |
| Active Projects | Count of in-progress projects |

---

### Module 4: Quotations

#### 7.4.1 Purpose
Generate professional, branded quotations that can be shared instantly. Automate the conversion to projects, contracts, and invoices on acceptance.

#### 7.4.2 Quotation Data Model

| Field | Type | Required |
|-------|------|----------|
| Quotation Number | Auto-generated | Auto |
| Client | Link to Client | Yes |
| Project Name | Text | Yes |
| Issue Date | Date | Auto |
| Expiry Date | Date | Yes |
| Currency | Dropdown | Yes |
| Line Items | Array | Yes |
| Subtotal | Calculated | Auto |
| Discount % | Number | No |
| Discount Amount | Calculated | Auto |
| Tax % (VAT) | Number | No |
| Tax Amount | Calculated | Auto |
| Total | Calculated | Auto |
| Payment Terms | Text | Yes |
| Notes | Long text | No |
| Terms & Conditions | Long text | Defaults from Settings |
| Status | Enum | Auto |
| Attachments | Files/Links | No |
| Created By | User | Auto |
| Sent At | Timestamp | Auto |

#### 7.4.3 Line Items Structure

Each line item contains:
- Item Type (Service / Product)
- Item Name (searchable from Products catalog)
- Description
- Quantity
- Unit Price
- Discount %
- Total

Items can be added from the Products/Services catalog or entered manually.

#### 7.4.4 Quotation Status Workflow

```
Draft → Sent → Under Review → Accepted / Rejected
```

| Status | Description |
|--------|-------------|
| Draft | Being created, not yet sent |
| Sent | Delivered to client |
| Under Review | Client is evaluating |
| Accepted | Client approved |
| Rejected | Client declined |
| Expired | Expiry date passed without response |

#### 7.4.5 Post-Acceptance Actions

When a quotation is marked **Accepted**, the system prompts:

```
✅ Quotation Accepted — What would you like to do next?
[ Create Project ]  [ Create Contract ]  [ Create Invoice ]  [ Do all three ]
```

Auto-population: all linked records inherit client info, quotation value, line items.

#### 7.4.6 Sharing Options
- Generate PDF → Download
- Send via Email (pre-filled template with quotation PDF attached)
- Send via WhatsApp (generates PDF → opens WhatsApp with message + PDF)
- Generate shareable link (for client portal viewing)

#### 7.4.7 Attachments Support
- Direct file upload (PDF, images, documents)
- Google Drive links
- Any external URL with title/description

---

### Module 5: Projects

#### 7.5.1 Purpose
The operational core of every client engagement. Track progress, manage financials, coordinate tasks, maintain documentation, and ensure delivery.

#### 7.5.2 Project Data Model

**General Information**

| Field | Type | Required |
|-------|------|----------|
| Project Name | Text | Yes |
| Project Number | Auto-generated | Auto |
| Client | Link | Yes |
| Description | Long text | No |
| Project Type | Enum | Yes |
| Template Used | Link | No |
| Start Date | Date | Yes |
| Expected End Date | Date | Yes |
| Actual End Date | Date | No |
| Priority | Enum (Low/Normal/High/Urgent) | Yes |
| Status | Enum | Auto |
| Assigned Manager | User | Yes |
| Team Members | Multi-user | No |
| Progress % | Number (manual or calculated) | Auto |
| Health Score | Calculated | Auto |
| Linked Quotation | Link | No |
| Created By | User | Auto |
| Created At | Timestamp | Auto |

**Project Types:**
- Website Development
- Mobile Application
- ERP/CRM System
- AI Solution
- Marketing Campaign
- Design Project
- Maintenance & Support
- Consulting
- Other

#### 7.5.3 Project Status Workflow

```
Planning → In Progress → On Hold → Completed / Cancelled
```

#### 7.5.4 Project Profile Tabs

| Tab | Contents |
|-----|----------|
| **Overview** | General info, health score, progress, key dates |
| **Financials** | Revenue, cost, profit, margin |
| **Tasks** | Project-specific tasks with Kanban/list view |
| **Milestones** | Key delivery milestones with status |
| **Reports** | All daily reports for this project |
| **Documents** | Quotations, contracts, invoices linked |
| **Expenses** | All expenses charged to this project |
| **Files** | All uploaded files and links |
| **Team** | Assigned team members |
| **Activity** | Complete audit timeline |
| **Notes** | Internal team notes |

#### 7.5.5 Project Financial Dashboard

| Metric | Calculation | Display |
|--------|-------------|---------|
| Contract Value | From linked contract/quotation | Currency |
| Invoiced Amount | Sum of all invoices | Currency |
| Paid Amount | Sum of paid invoices | Currency |
| Outstanding | Invoiced - Paid | Currency |
| Total Expenses | Sum of project expenses | Currency |
| Net Profit | Paid - Total Expenses | Currency |
| Profit Margin | Net Profit / Contract Value × 100 | Percentage |
| Budget Used % | Total Expenses / Contract Value × 100 | Progress bar |

#### 7.5.6 Project Health Score System

Health score (0–100) calculated from five weighted dimensions:

| Dimension | Weight | Calculation |
|-----------|--------|-------------|
| Timeline Health | 30% | Days remaining vs days elapsed ratio |
| Budget Health | 25% | Expenses vs budget ratio |
| Task Completion | 20% | Completed tasks / total tasks |
| Payment Status | 15% | Paid amount / invoiced amount |
| Activity Recency | 10% | Days since last update |

**Health Levels:**

| Score | Level | Color | Action Required |
|-------|-------|-------|----------------|
| 80–100 | Excellent | Green | None |
| 60–79 | Good | Blue | Monitor |
| 40–59 | Warning | Yellow | Review immediately |
| 0–39 | Critical | Red | Escalate urgently |

#### 7.5.7 Project Milestones

Each milestone has:
- Title
- Due Date
- Deliverables description
- Status (Pending / In Progress / Completed / Delayed)
- Linked payment (optional — triggers invoice generation on completion)

#### 7.5.8 Project Templates

Templates allow instant project setup. Each template contains:
- Default task list with titles and relative due dates
- Milestone structure
- Default team roles
- Report structure
- Document checklist

**Built-in Templates:**
- Website Development (12 tasks, 4 milestones)
- Mobile App (18 tasks, 5 milestones)
- Marketing Campaign (10 tasks, 3 milestones)
- ERP Implementation (25 tasks, 7 milestones)
- CRM Setup (20 tasks, 6 milestones)
- AI Solution (15 tasks, 5 milestones)

---

### Module 6: Contracts

#### 7.6.1 Purpose
Generate legally structured, professionally formatted contracts linked to clients, projects, and quotations. Eliminate manual contract creation.

#### 7.6.2 Contract Data Model

| Field | Type | Required |
|-------|------|----------|
| Contract Number | Auto-generated | Auto |
| Contract Title | Text | Yes |
| Client | Link | Yes |
| Project | Link | No |
| Quotation | Link | No |
| Contract Type | Enum | Yes |
| Contract Value | Currency | Yes |
| Start Date | Date | Yes |
| End Date | Date | No |
| Payment Schedule | Array of milestones | No |
| Template Used | Link | Yes |
| Dynamic Fields | JSON | Auto |
| Status | Enum | Auto |
| Signed By Client | Boolean | No |
| Signed Date | Date | No |
| Signatory Name | Text | No |
| Notes | Long text | No |
| Created By | User | Auto |

#### 7.6.3 Contract Status Workflow

```
Draft → Internal Review → Approved → Sent to Client → Signed / Rejected → Expired
```

#### 7.6.4 Contract Builder

The contract builder provides:
- **Template selection** (pre-built or custom templates)
- **Dynamic field injection:** Client name, project name, dates, amounts auto-filled
- **Rich text editor** for content customization
- **Section management:** Add, remove, reorder contract sections
- **Preview mode:** See exactly how the final PDF will look
- **Signature block:** Designated areas for signatures
- **E-signature readiness:** Integration placeholder for DocuSign/HelloSign (Phase 2)

#### 7.6.5 Contract Templates

System includes base templates for:
- Software Development Agreement
- Marketing Services Agreement
- SaaS Subscription Agreement
- Maintenance & Support Agreement
- Consulting Agreement
- Non-Disclosure Agreement (NDA)
- Freelancer/Outsourcing Agreement

---

### Module 7: Invoices

#### 7.7.1 Purpose
Professional invoice management with complete payment lifecycle tracking — from creation to collection.

#### 7.7.2 Invoice Data Model

| Field | Type | Required |
|-------|------|----------|
| Invoice Number | Auto-generated | Auto |
| Client | Link | Yes |
| Project | Link | No |
| Contract | Link | No |
| Quotation | Link | No |
| Issue Date | Date | Auto |
| Due Date | Date | Yes |
| Currency | Dropdown | Yes |
| Line Items | Array | Yes |
| Subtotal | Calculated | Auto |
| Discount | Number | No |
| Tax (VAT) | Number | No |
| Total | Calculated | Auto |
| Paid Amount | Number | Manual/Auto |
| Remaining Amount | Calculated | Auto |
| Payment Method | Enum | No |
| Payment Reference | Text | No |
| Status | Enum | Auto |
| Notes | Long text | No |
| Terms | Long text | Default from Settings |
| Created By | User | Auto |
| Sent At | Timestamp | Auto |

#### 7.7.3 Invoice Status Workflow

```
Draft → Sent → Partially Paid → Paid / Overdue
```

| Status | Condition |
|--------|-----------|
| Draft | Not yet sent |
| Sent | Delivered to client |
| Partially Paid | Paid Amount > 0 but < Total |
| Paid | Paid Amount = Total |
| Overdue | Due Date passed, Remaining Amount > 0 |
| Cancelled | Voided |

#### 7.7.4 Payment Recording

When recording a payment:
- Payment date
- Amount received
- Payment method (Bank Transfer / Cash / Cheque / Online / Other)
- Reference number
- Notes
- System auto-calculates remaining balance
- If remaining = 0, status auto-updates to **Paid**

#### 7.7.5 Collections Dashboard

Visible in Invoices module and Dashboard:

| Section | Content |
|---------|---------|
| Current | Invoices sent, not yet due |
| Due Soon | Due within 7 days |
| Overdue | Past due date with days overdue count |
| Partially Paid | Have payments but not complete |

**Per-client collection view:**
- Total invoiced
- Total paid
- Outstanding amount
- Oldest outstanding invoice

#### 7.7.6 Automated Payment Reminders

Configurable reminder sequence:
- Reminder 1: 3 days before due date
- Reminder 2: On due date
- Reminder 3: 3 days after due date
- Reminder 4: 7 days after due date
- Reminder 5: 14 days after due date (escalation alert)

Channels: Email + WhatsApp (configurable per client)

---

### Module 8: Expenses

#### 7.8.1 Purpose
Track every cost incurred by the company — per project, per category, per period — to ensure accurate profitability calculation.

#### 7.8.2 Expense Data Model

| Field | Type | Required |
|-------|------|----------|
| Expense Title | Text | Yes |
| Category | Enum | Yes |
| Amount | Currency | Yes |
| Currency | Dropdown | Yes |
| Date | Date | Yes |
| Project | Link | No |
| Client | Link | No |
| Vendor/Supplier | Text | No |
| Receipt | File | No |
| Notes | Long text | No |
| Approved By | User | No |
| Created By | User | Auto |

#### 7.8.3 Expense Categories

- 💻 Development (contractor/outsourcing payments)
- 🎨 Design
- 📣 Marketing & Advertising
- ☁️ Hosting & Servers
- 🛠️ Software & Subscriptions
- 👥 Outsourcing & Freelancers
- ✈️ Travel & Transportation
- 🏢 Office & Operations
- 📞 Communication
- 🏦 Banking & Finance Fees
- 📦 Other

#### 7.8.4 Expense Analytics

- Expenses by category (pie chart)
- Expenses by project (bar chart)
- Expenses by month (trend line)
- Top expense categories
- Expense vs revenue ratio

---

### Module 9: Profit & Loss

#### 7.9.1 Purpose
Real-time financial intelligence. Know exactly how profitable every project and the overall business is at any point in time.

#### 7.9.2 P&L Views

**Company-wide P&L:**
- Period selector: This Week / This Month / This Quarter / This Year / Custom
- Revenue (from paid invoices)
- Expenses (all categories)
- Gross Profit
- Operating margin %
- Month-over-month comparison chart

**Per-Project P&L:**

| Metric | Value |
|--------|-------|
| Contract Value | From linked documents |
| Total Invoiced | Sum of invoices |
| Total Collected | Sum of payments |
| Total Expenses | Sum of project expenses |
| Gross Profit | Collected - Expenses |
| Profit Margin | Gross Profit / Contract Value × 100 |
| Outstanding | Invoiced - Collected |

**Per-Client P&L:**
- Aggregated across all projects for each client
- Shows client lifetime value

#### 7.9.3 Visualizations

- Revenue vs Expenses line chart (monthly trend)
- Profit margin by project (bar chart)
- Revenue by client (pie chart)
- Expense breakdown by category (donut chart)
- Cash flow projection chart

---

### Module 10: Tasks

#### 7.10.1 Purpose
Manage all daily operational work — company tasks, project tasks, client tasks — with clear ownership, deadlines, and priorities.

#### 7.10.2 Task Data Model

| Field | Type | Required |
|-------|------|----------|
| Title | Text | Yes |
| Description | Long text | No |
| Client | Link | No |
| Project | Link | No |
| Assigned To | User | Yes |
| Created By | User | Auto |
| Due Date | Date | No |
| Due Time | Time | No |
| Priority | Enum | Yes |
| Status | Enum | Auto |
| Estimated Hours | Number | No |
| Actual Hours | Number | No |
| Tags | Multi-select | No |
| Parent Task | Link (for subtasks) | No |
| Attachments | Files | No |

**Priority Enum:** Low / Normal / High / Urgent

**Status Enum:** Pending / In Progress / Completed / Delayed / Cancelled

#### 7.10.3 Task Views

- **List View:** Filterable, sortable table
- **Kanban View:** Columns by status
- **Calendar View:** Tasks plotted on calendar
- **My Tasks:** Filtered to current user
- **Today's Tasks:** Due today
- **Overdue Tasks:** Past due date, not completed

#### 7.10.4 Task Automation

- Task assigned → Notification to assignee
- Task due date tomorrow → Reminder notification
- Task overdue → Alert to task creator and assignee
- Project template applied → Bulk tasks created with calculated due dates

---

### Module 11: Daily Reports

#### 7.11.1 Purpose
Structured progress reports sent to clients, maintaining professional communication and eliminating ad-hoc WhatsApp updates.

#### 7.11.2 Report Data Model

| Field | Type | Required |
|-------|------|----------|
| Report Title | Text | Auto |
| Project | Link | Yes |
| Client | Link | Auto (from project) |
| Report Date | Date | Auto |
| Report Period | Enum (Daily/Weekly/Milestone) | Yes |
| Work Completed | Rich text | Yes |
| Issues & Blockers | Rich text | No |
| Next Steps | Rich text | Yes |
| Completion % | Number | Yes |
| Hours Logged | Number | No |
| Attachments | Files/Links | No |
| Status | Enum (Draft/Sent) | Auto |
| Sent Via | Enum (Email/WhatsApp/Both) | Auto |
| Sent At | Timestamp | Auto |
| Created By | User | Auto |

#### 7.11.3 Report Generation Workflow

1. Click "New Report" from project or reports module
2. System auto-populates: client, project, date, previous completion %
3. Fill in structured sections
4. Preview PDF in browser
5. Choose delivery: Email, WhatsApp, or Both
6. System generates PDF → sends immediately
7. Report logged in timeline

#### 7.11.4 Report PDF Format

Professional layout including:
- Company header (from Settings)
- Report title and date
- Project name and client
- Completion percentage (visual bar)
- Sections: Work Done, Issues, Next Steps
- Attachments section
- Company footer with QR code

---

### Module 12: Products & Services

#### 7.12.1 Purpose
Maintain a complete catalog of Madarik Tech's offerings. Used in quotation line item selection.

#### 7.12.2 Product/Service Data Model

| Field | Type | Required |
|-------|------|----------|
| Name | Text | Yes |
| Category | Enum (SaaS/Service/Maintenance) | Yes |
| Description | Rich text | Yes |
| Short Description | Text (for quotations) | Yes |
| Base Price | Currency | No |
| Pricing Model | Enum | Yes |
| Currency | Dropdown | Yes |
| Features List | Array of text | No |
| Attachments | Files | No |
| Sales Material | Files | No |
| Active | Boolean | Yes |

**Pricing Models:**
- Fixed Price
- Hourly Rate
- Monthly Subscription
- Annual Subscription
- Custom (manual entry per quotation)

#### 7.12.3 Madarik Tech Product Catalog

**SaaS Products:**
| Product | Type | Notes |
|---------|------|-------|
| POS Pixel Pro | SaaS - POS System | Subscription-based |
| PRO SYS | SaaS - Business Management | Subscription-based |
| WhatsApp AI Agent | SaaS - AI Automation | Subscription-based |

**Services:**
| Service | Category |
|---------|----------|
| Website Development | Development |
| Mobile App Development | Development |
| E-Commerce Development | Development |
| ERP System Implementation | Enterprise |
| CRM System Implementation | Enterprise |
| AI Solutions Development | AI |
| Digital Marketing | Marketing |
| SEO Services | Marketing |
| Social Media Management | Marketing |
| UI/UX Design | Design |
| Branding | Design |
| IT Consulting | Consulting |
| System Maintenance | Support |

---

### Module 13: Opportunities & Future Ideas

#### 7.13.1 Purpose
Capture and nurture strategic ideas, product concepts, and market opportunities without losing them in informal conversations.

#### 7.13.2 Opportunity Data Model

| Field | Type | Required |
|-------|------|----------|
| Title | Text | Yes |
| Description | Rich text | Yes |
| Category | Enum | Yes |
| Status | Enum | Yes |
| Estimated Revenue | Currency | No |
| Estimated Cost | Currency | No |
| Estimated ROI | Calculated | Auto |
| Priority | Enum | Yes |
| Target Date | Date | No |
| Assigned To | User | No |
| Notes | Long text | No |
| Files | Attachments | No |

**Status Enum:** Idea / Research / Planning / Ready to Build / In Development / Launched / Archived

**Categories:** New Product / New Service / Market Expansion / Partnership / Internal Improvement / Other

---

### Module 14: Reminders

#### 7.14.1 Purpose
Never miss a follow-up, deadline, payment, or contract renewal.

#### 7.14.2 Reminder Data Model

| Field | Type | Required |
|-------|------|----------|
| Title | Text | Yes |
| Description | Text | No |
| Reminder Type | Enum | Yes |
| Linked Record | Polymorphic Link | No |
| Remind At | DateTime | Yes |
| Repeat | Enum (None/Daily/Weekly/Monthly) | No |
| Channels | Multi-select (In-App/Email/WhatsApp) | Yes |
| Assigned To | User | Yes |
| Status | Enum (Active/Dismissed/Fired) | Auto |

**Reminder Types:**
- Deadline
- Follow-up
- Payment Due
- Contract Renewal
- Task Due
- Meeting
- Custom

---

### Module 15: Knowledge Base

#### 7.15.1 Purpose
Centralize all company processes, scripts, templates, and SOPs to eliminate knowledge silos.

#### 7.15.2 Knowledge Base Structure

| Category | Examples |
|----------|----------|
| Processes | Client onboarding, project kick-off, invoice collection |
| SOPs | Step-by-step operational procedures |
| Checklists | Project launch, website deployment, app release |
| Sales Scripts | Discovery call script, objection handling, closing script |
| Product Information | Features, pricing, comparison sheets |
| Project Templates | Document structures per project type |
| Meeting Notes | Structured meeting records |
| HR & Team | Employee handbook, policies |

#### 7.15.3 Features

- Rich text editor (with image support)
- Hierarchical categories and subcategories
- Article search (full-text)
- Article versioning (track changes over time)
- Public/Private visibility toggle
- Related articles linking

---

### Module 16: Calendar

#### 7.16.1 Purpose
Unified view of all time-sensitive events across the business.

#### 7.16.2 Event Sources (auto-populated)

| Source | Event Type |
|--------|-----------|
| Projects | Deadlines, milestones |
| Tasks | Due dates |
| Invoices | Due dates, overdue alerts |
| Contracts | Expiry dates |
| Reminders | All reminder due times |
| CRM | Meetings, follow-ups |
| Manual | Custom events |

#### 7.16.3 Calendar Views

- **Daily:** Hourly breakdown of events
- **Weekly:** 7-day view with events per day
- **Monthly:** Full month with event count per day
- **Agenda:** Chronological list of upcoming events

#### 7.16.4 Event Colors

| Color | Represents |
|-------|-----------|
| Blue | Meetings |
| Red | Deadlines |
| Orange | Follow-ups |
| Green | Milestones completed |
| Yellow | Payments due |
| Purple | Contract events |

---

### Module 17: Team Management

#### 7.17.1 Purpose
Track team members, their assignments, and productivity across projects.

#### 7.17.2 Employee Data Model

| Field | Type | Required |
|-------|------|----------|
| Full Name | Text | Yes |
| Position/Role | Text | Yes |
| Department | Enum | Yes |
| Mobile | Phone | Yes |
| Email | Email | Yes |
| System Role | RBAC Role | Yes |
| Active | Boolean | Yes |
| Joined Date | Date | No |
| Notes | Text | No |

#### 7.17.3 Team Dashboard

Per employee view:
- Assigned projects (count and list)
- Active tasks (count and list)
- Tasks completed this month
- Tasks overdue

---

### Module 18: Settings

#### 7.18.1 Purpose
Single source of truth for all company branding and configuration. Every generated document uses these settings.

#### 7.18.2 Settings Categories

**Company Profile**

| Setting | Type |
|---------|------|
| Company Name (Arabic) | Text |
| Company Name (English) | Text |
| Logo | Image upload |
| License/CR Number | Text |
| Phone Number | Phone |
| WhatsApp Number | Phone |
| Email Address | Email |
| Website URL | URL |
| Address (Arabic) | Text |
| Address (English) | Text |
| Country | Dropdown |

**Branding**

| Setting | Type |
|---------|------|
| Primary Brand Color | Color picker |
| Secondary Brand Color | Color picker |
| Signature Image | Image upload |
| Official Stamp Image | Image upload |
| QR Code | Generated from website URL |
| Social Media Links | Array (platform + URL) |

**Document Defaults**

| Setting | Type |
|---------|------|
| Default Currency | Dropdown |
| Default VAT % | Number |
| Default Payment Terms | Text |
| Default T&C for Quotations | Rich text |
| Default T&C for Contracts | Rich text |
| Default T&C for Invoices | Rich text |
| Invoice Prefix | Text |
| Quotation Prefix | Text |
| Contract Prefix | Text |

**Notification Settings**

| Setting | Type |
|---------|------|
| Default Email Sender Name | Text |
| Default Email Templates | Per document type |
| WhatsApp Business Number | Phone |
| Auto-reminder sequences | Toggle per type |

**User & Security**

| Setting | Type |
|---------|------|
| Password policy | Configuration |
| Session timeout | Minutes |
| Two-factor authentication | Toggle |
| IP whitelist | Optional |

---

### Module 19: Notification Center

#### 7.19.1 Notification Events

| Event | Who Gets Notified | Channels |
|-------|-----------------|----------|
| New lead created | Sales Manager, Owner | In-App |
| Lead stage changed | Assigned user, Owner | In-App |
| Quotation accepted | Sales Manager, Owner | In-App, Email |
| New project created | Project Manager, Owner | In-App |
| Task assigned | Assignee | In-App, Email |
| Task overdue | Assignee, Manager | In-App, Email |
| Project deadline approaching (7 days) | PM, Owner | In-App, Email |
| Invoice sent | Accountant, Owner | In-App |
| Payment received | Accountant, Owner | In-App, Email |
| Invoice overdue | Accountant, Owner | In-App, Email, WhatsApp |
| Contract expiring (30 days) | Owner, Account Manager | In-App, Email |
| Daily report sent | Owner | In-App |
| New file uploaded | Relevant team | In-App |

#### 7.19.2 In-App Notification Bell

- Badge count of unread notifications
- Dropdown with latest 10 notifications
- "Mark all as read" action
- Link to full notification center
- Real-time updates (WebSocket or polling)

---

## 8. Workflows & Business Logic

### 8.1 Lead-to-Revenue Workflow

```
[New Lead Entered]
        ↓
[CRM Pipeline — Stage Progression]
        ↓
[Proposal Stage → Create Quotation]
        ↓
[Quotation Accepted by Client]
        ↓
[Auto-prompt: Convert to →]
  ├── [New Project Created]
  ├── [Contract Generated]
  └── [Invoice Created]
        ↓
[Project Starts → Tasks Created (from template or manual)]
        ↓
[Daily Reports → Sent to Client]
        ↓
[Milestones Completed → Invoice Triggered]
        ↓
[Invoice Sent → Payment Reminder Sequence Activated]
        ↓
[Payment Received → P&L Updated → Lead Marked Won]
```

### 8.2 Document Generation Workflow

```
[User clicks "Generate PDF"]
        ↓
[System fetches company settings (logo, colors, signature)]
        ↓
[Data merged into template]
        ↓
[PDF rendered (Laravel + DomPDF/Snappy)]
        ↓
[File stored in storage/documents]
        ↓
[User chooses: Download / Email / WhatsApp]
        ↓
[If WhatsApp: PDF converted to sendable format → WhatsApp API]
[If Email: PDF attached → Mailable sent via queue]
```

### 8.3 Document Approval Workflow

```
[Document Created → Status: Draft]
        ↓
[Creator submits for review → Status: Under Review]
        ↓
[Reviewer notified (in-app + email)]
        ↓
[Reviewer: Approve or Request Changes]
        ↓
[If Approved → Status: Approved → Enable Send/Share]
[If Changes Requested → Back to Draft with comments]
        ↓
[Sent to Client → Status: Sent]
```

### 8.4 Project Closure Workflow

```
[All tasks marked complete]
        ↓
[PM marks project as Completed]
        ↓
[System checks: Any unpaid invoices?]
  ├── Yes → Alert: Outstanding invoices exist
  └── No → Project formally closed
        ↓
[Final P&L calculated and locked]
        ↓
[Client satisfaction note prompted]
        ↓
[Client status optionally updated to "Closed"]
```

### 8.5 Client Portal Access Workflow

```
[Client created in system]
        ↓
[Admin invites client to portal (email sent)]
        ↓
[Client sets password via secure link]
        ↓
[Client logs in → sees only their data]
        ↓
[Client can: view projects, approve quotations, download docs, upload files]
        ↓
[Client actions create internal notifications for the team]
```

---

## 9. Database Design

### 9.1 Database Architecture Principles

- **MySQL 8.0+** with InnoDB engine for all tables
- All tables include `tenant_id` (INT, indexed) for future multi-tenancy
- All tables include `created_at` and `updated_at` timestamps
- Soft deletes (`deleted_at`) on critical tables to prevent data loss
- UUID or auto-increment IDs (recommend auto-increment with prefixed display numbers)
- Polymorphic relationships used for files, notes, activities

### 9.2 Core Tables

#### users
```
id, tenant_id, name, email, password, role_id, position, mobile, 
avatar, is_active, email_verified_at, last_login_at, 
created_at, updated_at, deleted_at
```

#### roles
```
id, tenant_id, name, slug, permissions (JSON), is_system, 
created_at, updated_at
```

#### tenants (for future SaaS)
```
id, name, slug, plan, settings (JSON), is_active, 
trial_ends_at, created_at, updated_at
```

#### leads
```
id, tenant_id, name, company_name, mobile, whatsapp, email, 
source, country, stage, priority, estimated_value, currency_id, 
expected_close_date, assigned_to (FK users), 
converted_to_client_id (FK clients), notes, tags (JSON), 
created_by, created_at, updated_at, deleted_at
```

#### clients
```
id, tenant_id, name, company_name, mobile, whatsapp, email, 
country, city, industry, type (individual/company), status, 
source, lead_id (FK leads), assigned_to (FK users), tags (JSON), 
notes, portal_access (boolean), portal_password, 
created_by, created_at, updated_at, deleted_at
```

#### projects
```
id, tenant_id, project_number, name, client_id (FK), description, 
type, template_id (FK), start_date, expected_end_date, actual_end_date, 
priority, status, progress_percent, health_score, 
assigned_manager (FK users), contract_value, currency_id, 
created_by, created_at, updated_at, deleted_at
```

#### project_members
```
id, project_id (FK), user_id (FK), role, created_at
```

#### project_milestones
```
id, tenant_id, project_id (FK), title, description, due_date, 
status, payment_linked (boolean), invoice_id (FK), 
created_at, updated_at
```

#### quotations
```
id, tenant_id, quotation_number, client_id (FK), project_name, 
issue_date, expiry_date, currency_id, subtotal, discount_percent, 
discount_amount, tax_percent, tax_amount, total, payment_terms, 
notes, terms_conditions, status, pdf_path, 
sent_at, created_by, created_at, updated_at, deleted_at
```

#### quotation_items
```
id, quotation_id (FK), product_id (FK nullable), type, name, 
description, quantity, unit_price, discount_percent, total, 
sort_order, created_at, updated_at
```

#### contracts
```
id, tenant_id, contract_number, title, client_id (FK), project_id (FK), 
quotation_id (FK), type, value, currency_id, start_date, end_date, 
template_id (FK), content (LONGTEXT), dynamic_fields (JSON), 
status, signed_by, signed_date, signatory_name, notes, pdf_path, 
created_by, created_at, updated_at, deleted_at
```

#### invoices
```
id, tenant_id, invoice_number, client_id (FK), project_id (FK), 
contract_id (FK), quotation_id (FK), issue_date, due_date, 
currency_id, subtotal, discount_amount, tax_amount, total, 
paid_amount, remaining_amount, status, notes, terms, pdf_path, 
sent_at, created_by, created_at, updated_at, deleted_at
```

#### invoice_items
```
id, invoice_id (FK), description, quantity, unit_price, total, 
sort_order, created_at, updated_at
```

#### payments
```
id, tenant_id, invoice_id (FK), client_id (FK), amount, currency_id, 
payment_date, method, reference, notes, recorded_by, 
created_at, updated_at
```

#### expenses
```
id, tenant_id, title, category, amount, currency_id, date, 
project_id (FK nullable), client_id (FK nullable), 
vendor, receipt_path, notes, approved_by (FK users), 
created_by, created_at, updated_at, deleted_at
```

#### tasks
```
id, tenant_id, title, description, client_id (FK nullable), 
project_id (FK nullable), parent_task_id (FK nullable), 
assigned_to (FK users), created_by, due_date, due_time, 
priority, status, estimated_hours, actual_hours, tags (JSON), 
completed_at, created_at, updated_at, deleted_at
```

#### daily_reports
```
id, tenant_id, title, project_id (FK), client_id (FK), report_date, 
period_type, work_completed (TEXT), issues (TEXT), next_steps (TEXT), 
completion_percent, hours_logged, status, pdf_path, 
sent_via, sent_at, created_by, created_at, updated_at
```

#### products
```
id, tenant_id, name, category, description, short_description, 
base_price, currency_id, pricing_model, features (JSON), 
is_active, sort_order, created_at, updated_at, deleted_at
```

#### opportunities
```
id, tenant_id, title, description, category, status, 
estimated_revenue, estimated_cost, currency_id, priority, 
target_date, assigned_to (FK users), notes, 
created_by, created_at, updated_at, deleted_at
```

#### reminders
```
id, tenant_id, title, description, type, 
remindable_type, remindable_id (polymorphic), 
remind_at, repeat_type, channels (JSON), 
assigned_to (FK users), status, fired_at, 
created_by, created_at, updated_at
```

#### files
```
id, tenant_id, name, original_name, path, disk, mime_type, size, 
fileable_type, fileable_id (polymorphic), is_external (boolean), 
external_url, external_type (drive/url/other), 
uploaded_by, created_at, updated_at, deleted_at
```

#### activities
```
id, tenant_id, type, description, subject_type, subject_id (polymorphic), 
causer_type, causer_id (polymorphic), properties (JSON), 
created_at
```

#### notes
```
id, tenant_id, content (TEXT), noteable_type, noteable_id (polymorphic), 
is_private, created_by, created_at, updated_at, deleted_at
```

#### currencies
```
id, code, name, symbol, exchange_rate, is_default, is_active
```

#### settings
```
id, tenant_id, key, value (TEXT), group, created_at, updated_at
```

#### knowledge_articles
```
id, tenant_id, title, content (LONGTEXT), category_id (FK), 
tags (JSON), is_published, version, 
created_by, updated_by, created_at, updated_at, deleted_at
```

#### knowledge_categories
```
id, tenant_id, name, slug, parent_id (FK nullable), sort_order, 
created_at, updated_at
```

#### notifications
```
id, tenant_id, user_id (FK), type, title, body, 
link, read_at, created_at
```

#### contract_templates
```
id, tenant_id, name, type, content (LONGTEXT), dynamic_fields (JSON), 
is_default, is_active, created_by, created_at, updated_at
```

#### project_templates
```
id, tenant_id, name, type, description, tasks (JSON), 
milestones (JSON), is_active, created_by, created_at, updated_at
```

#### calendar_events
```
id, tenant_id, title, description, type, start_at, end_at, 
all_day, color, eventable_type, eventable_id (polymorphic), 
created_by, assigned_to (FK users), created_at, updated_at
```

### 9.3 Key Relationships Map

```
Tenant (1) ──────── (many) Users
Tenant (1) ──────── (many) Clients
Lead (1) ──────── (0-1) Client (conversion)
Client (1) ──────── (many) Projects
Client (1) ──────── (many) Quotations
Client (1) ──────── (many) Contracts
Client (1) ──────── (many) Invoices
Project (1) ──────── (many) Tasks
Project (1) ──────── (many) DailyReports
Project (1) ──────── (many) Expenses
Project (1) ──────── (many) Milestones
Quotation (1) ──────── (0-1) Project
Quotation (1) ──────── (0-1) Contract
Quotation (1) ──────── (0-1) Invoice
Invoice (1) ──────── (many) Payments
* (polymorphic) ──── Files
* (polymorphic) ──── Notes
* (polymorphic) ──── Activities
* (polymorphic) ──── Reminders
```

### 9.4 Indexing Strategy

Critical indexes for performance:
- All `tenant_id` columns (all tables)
- All foreign key columns
- `status` columns on high-query tables (projects, invoices, leads)
- `due_date` on invoices and tasks
- `created_at` on activities (for timeline queries)
- Composite index: `(tenant_id, client_id)` on projects, invoices
- Full-text index on: clients.name, projects.name, quotations.project_name, knowledge_articles.title

---

## 10. User Permissions Matrix (RBAC)

### 10.1 Role Definitions

| Role | Description | Access Level |
|------|-------------|-------------|
| **Super Admin** | Platform administrator (for SaaS management) | Full platform access |
| **Owner** | Business owner — Madarik Tech founder | Full company access |
| **Sales Manager** | Manages CRM, quotations, client acquisition | CRM + Quotations + Clients |
| **Project Manager** | Manages projects, tasks, reports, team | Projects + Tasks + Reports |
| **Accountant** | Manages financial modules | Invoices + Expenses + P&L |
| **Employee** | General team member | Assigned tasks + reports |
| **Client** | External client (portal only) | Own data only |

### 10.2 Permissions Matrix

| Module | Super Admin | Owner | Sales Manager | Project Manager | Accountant | Employee | Client |
|--------|-------------|-------|---------------|----------------|------------|---------|--------|
| **Dashboard** | Full | Full | Sales view | Project view | Finance view | Own tasks | Portal dash |
| **CRM / Leads** | Full | Full | Full | View | View | None | None |
| **Clients** | Full | Full | Create/Edit | View | View | View assigned | Own profile |
| **Quotations** | Full | Full | Full | View | View | None | View own |
| **Projects** | Full | Full | View | Full | View financials | Assigned only | Own projects |
| **Contracts** | Full | Full | Create/View | View | View | None | View/Download own |
| **Invoices** | Full | Full | View | View | Full | None | View/Download own |
| **Expenses** | Full | Full | None | Create (own projects) | Full | None | None |
| **P&L** | Full | Full | None | View (own projects) | Full | None | None |
| **Tasks** | Full | Full | Own tasks | Full | Own tasks | Assigned tasks | None |
| **Reports** | Full | Full | View | Full | View | Create (assigned) | View own |
| **Products** | Full | Full | View | View | View | View | None |
| **Opportunities** | Full | Full | Full | None | None | None | None |
| **Reminders** | Full | Full | Own | Own | Own | Own | None |
| **Team** | Full | Full | View | View | View | Own profile | None |
| **Knowledge Base** | Full | Full | Read/Write | Read/Write | Read | Read | None |
| **Settings** | Full | Full | None | None | None | None | None |
| **Files** | Full | Full | Linked files | Linked files | Linked files | Project files | Own files |
| **Notifications** | Full | Full | Own | Own | Own | Own | Own |
| **Calendar** | Full | Full | Own events | Full | Finance events | Own | None |

### 10.3 Permission Granularity

Each module permission is defined as one of:
- **None** — No access
- **View** — Read-only
- **Create** — Can create new records
- **Edit** — Can modify existing records
- **Delete** — Can remove records (soft delete)
- **Full** — All permissions including configuration

---

## 11. Dashboard Design

### 11.1 Layout Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER: Logo | Islamic Greeting | Date/Time | Notifications | User │
├─────────────────────────────────────────────────────────────────┤
│  SIDEBAR: Navigation Menu (collapsible)                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Dashboard | CRM | Clients | Projects | Quotations |     │   │
│  │  Contracts | Invoices | Expenses | P&L | Tasks |         │   │
│  │  Reports | Products | Opportunities | Calendar |         │   │
│  │  Team | Knowledge | Reminders | Settings                 │   │
│  └──────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│  MAIN CONTENT AREA                                               │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  Islamic Banner (Quran Verse + Date)                   │     │
│  ├─────────────┬─────────────┬────────────┬──────────────┤     │
│  │ Total       │ Active      │ Completed  │ Revenue      │     │
│  │ Clients     │ Projects    │ Projects   │ This Month   │     │
│  ├─────────────┴─────────────┴────────────┴──────────────┤     │
│  │  Financial Overview Row                                │     │
│  │  [Revenue] [Outstanding] [Expenses] [Net Profit]      │     │
│  ├────────────────────────────┬───────────────────────────┤     │
│  │  Active Projects Table     │  CRM Pipeline Mini        │     │
│  │  (with health indicators)  │  + Today's Follow-ups     │     │
│  ├────────────────────────────┴───────────────────────────┤     │
│  │  Recent Activity Feed      │  Tasks Due Today          │     │
│  └────────────────────────────┴───────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
```

### 11.2 KPI Card Design

Each KPI card contains:
- Icon (relevant to metric)
- Label
- Main value (large, prominent)
- Sub-metric (e.g., "vs last month: +12%")
- Color indicator (green/red for trend)
- Clickable — navigates to relevant module

### 11.3 Role-Based Dashboard Views

| Role | Dashboard Shows |
|------|----------------|
| Owner | All sections — full executive view |
| Sales Manager | CRM pipeline, leads, quotations, conversion rate |
| Project Manager | Active projects, task board, deadlines, team activity |
| Accountant | Financial KPIs, invoice status, collections, P&L |
| Employee | My tasks, assigned projects, due dates |

---

## 12. Automation Opportunities

### 12.1 Priority Automation List

| # | Trigger | Automated Action | Impact |
|---|---------|-----------------|--------|
| 1 | Quotation accepted | Prompt: Create Project / Contract / Invoice | High |
| 2 | Invoice due in 3 days | Send payment reminder (email + WhatsApp) | High |
| 3 | Invoice overdue | Escalating reminder sequence | High |
| 4 | Task assigned | Notify assignee (in-app + email) | High |
| 5 | Lead: no activity in 3 days | Alert assigned sales rep | High |
| 6 | Project milestone completed | Prompt invoice creation | High |
| 7 | Contract expiring in 30 days | Alert account manager + owner | Medium |
| 8 | Won lead | Auto-convert to client + prompt next steps | Medium |
| 9 | Project deadline approaching | Notify PM + owner | Medium |
| 10 | Report submitted | Notify owner | Low |
| 11 | Payment received | Mark invoice paid + notify team | High |
| 12 | New lead from website | Auto-create lead in CRM | Medium |
| 13 | Task overdue | Notify assignee + manager | Medium |
| 14 | Client portal: quotation accepted | Notify sales team | High |

### 12.2 Implementation Approach

- **Laravel Jobs & Queues** for background processing (Redis queue driver)
- **Laravel Scheduler** for time-based automations (runs every minute)
- **Database-stored automation rules** — configurable per tenant in Settings
- **Event-Listener pattern** in Laravel for trigger-based automations

---

## 13. Reporting Architecture

### 13.1 Report Types

#### Operational Reports (real-time)

| Report | Module | Available to |
|--------|--------|-------------|
| Active Projects Status | Projects | PM, Owner |
| Overdue Tasks | Tasks | All |
| Pipeline Summary | CRM | Sales, Owner |
| Project Health Overview | Projects | PM, Owner |
| Client Activity Summary | Clients | Owner, Sales |

#### Financial Reports (date-ranged)

| Report | Metrics | Available to |
|--------|---------|-------------|
| Revenue Report | Total, by client, by project, by month | Accountant, Owner |
| Collections Report | Paid vs outstanding, overdue aging | Accountant, Owner |
| Expense Report | By category, by project, by period | Accountant, Owner |
| P&L Report | Revenue - Expenses = Profit by period | Accountant, Owner |
| Invoice Aging Report | 0-30, 31-60, 61-90, 90+ days | Accountant, Owner |
| Client Profitability | Revenue/expense/profit per client | Owner |

#### Sales Reports

| Report | Metrics |
|--------|---------|
| Lead Conversion Report | Leads entered vs converted, by source, by period |
| Sales Pipeline Report | Value by stage, projected close dates |
| Quotation Success Rate | Accepted vs rejected, by service type |
| Revenue Forecast | Expected from pipeline × conversion rate |

#### Project Reports

| Report | Metrics |
|--------|---------|
| Project Performance | On-time delivery rate, budget adherence |
| Team Productivity | Tasks completed per user per period |
| Project Profitability | Margin by project type |

### 13.2 Export Formats

All reports exportable as:
- PDF (formatted, branded)
- Excel/CSV (for further analysis)
- In-app view with charts

### 13.3 Visualization Library

**React Charts:** Recharts or Chart.js

Charts used:
- Line charts: Revenue and expense trends over time
- Bar charts: Project profitability comparison
- Donut/Pie: Expense breakdown, lead source distribution
- Funnel chart: CRM pipeline stages
- Progress bars: Project completion, budget usage
- KPI cards with sparklines: Dashboard metrics

---

## 14. PDF Generation System

### 14.1 Technical Approach

**Backend:** Laravel with **DomPDF** (barryvdh/laravel-dompdf) or **Snappy** (wkhtmltopdf)

Recommended: **Snappy** for complex layouts with CSS support.

**Process:**
1. User triggers PDF generation
2. Laravel dispatches a queued job
3. Blade template rendered with data
4. PDF generated and stored in `storage/app/documents/`
5. Signed URL generated for secure access
6. File linked to the source record in `files` table

### 14.2 Global PDF Template

Every generated document uses this master layout:

**Header Section:**
```
┌──────────────────────────────────────────────────────────┐
│  [LOGO]    Company Name (Arabic + English)               │
│            License Number: XXXXXXXX                      │
│            Phone: +966XXXXXXXXX  |  Email: info@...      │
│            Website: www.madariktech.com                  │
└──────────────────────────────────────────────────────────┘
```

**Footer Section:**
```
┌──────────────────────────────────────────────────────────┐
│  [QR Code]  Website | Social Media Icons                 │
│             Address | Contact Info                       │
│             Page X of Y                                  │
└──────────────────────────────────────────────────────────┘
```

All values in the header and footer are pulled dynamically from the Settings module. **Changing company settings immediately reflects in all future PDFs.**

### 14.3 Document-Specific Templates

| Document | Template Features |
|----------|-----------------|
| Quotation | Line items table, totals, terms, validity date, signature block |
| Contract | Multi-page support, section numbering, signature blocks, dynamic clauses |
| Invoice | Itemized billing, payment details, bank info, QR payment code |
| Daily Report | Progress bar, structured sections, professional formatting |

### 14.4 PDF Naming Convention

```
{DocumentType}_{ClientName}_{Number}_{Date}.pdf
Example: Invoice_AhmedCo_INV-2026-0042_2026-06-13.pdf
```

---

## 15. WhatsApp & Email Integration

### 15.1 WhatsApp Integration

#### MVP Approach (Phase 1)
**WhatsApp Click-to-Send** — No API required:

1. PDF is generated and stored on server
2. System generates a shareable download link
3. System opens `https://wa.me/{phone}?text={message}` with pre-written text
4. Message includes the download link and document summary
5. User sends from WhatsApp web/app

This approach works immediately without WhatsApp Business API approval.

#### Phase 2 Enhancement
**WhatsApp Business API (via Twilio / Meta Cloud API)**

Capabilities:
- Send documents directly from system
- Receive client replies and log them
- Send automated payment reminders
- Template message support (pre-approved templates)

Required: Business verification + Meta approval process.

### 15.2 Email Integration

**Technology:** Laravel Mailable + SMTP/API driver

**Supported providers:**
- SMTP (any provider)
- Mailgun API
- SendGrid API
- Postmark
- AWS SES

**Email features:**
- Branded HTML email templates (matching company colors)
- PDF attachments
- Document preview link (for client portal)
- Unsubscribe handling

**Pre-built email templates:**
- Quotation delivery
- Invoice delivery
- Payment reminder (3 variants: friendly, firm, final)
- Contract for signature
- Daily report delivery
- Welcome to client portal
- General follow-up

---

## 16. File Management System

### 16.1 Architecture

**Storage:**
- MVP: Local disk (`storage/app/public`)
- Production: AWS S3 or compatible (Cloudflare R2, MinIO)
- Laravel filesystem abstraction ensures zero code changes when switching

**Access:**
- Private files: Served via signed URLs with expiry
- Client portal files: Filtered to client-relevant only

### 16.2 Supported File Types

| Category | Extensions |
|----------|-----------|
| Documents | PDF, DOC, DOCX, XLS, XLSX, TXT |
| Images | JPG, JPEG, PNG, GIF, SVG, WebP |
| Video | MP4, MOV, AVI, WebM |
| Archives | ZIP, RAR |
| External Links | Google Drive, Dropbox, OneDrive, any URL |

### 16.3 File Organization

Files are attached to records using polymorphic relationships:
- `fileable_type`: The model name (Client, Project, Quotation, etc.)
- `fileable_id`: The record ID

**File browser per record:** Gallery view + list view with preview, download, delete.

### 16.4 File Limits (MVP)

| Setting | Limit |
|---------|-------|
| Max file size | 50MB per file |
| Storage per tenant | 10GB (expandable) |
| Supported previews | PDF, images |

---

## 17. Client Portal

### 17.1 Architecture

The client portal is a **separate frontend route** (`/portal`) with its own authentication.

**Authentication:**
- Email + password (set via invitation link)
- JWT token (separate from staff tokens)
- Optional: WhatsApp OTP for passwordless login (Phase 2)

### 17.2 Portal Navigation

```
Portal Sidebar:
├── Dashboard (project overview)
├── My Projects
├── Quotations
├── Contracts
├── Invoices
├── Reports
├── Files
└── Messages
```

### 17.3 Portal Dashboard

Client sees:
- Active project cards with progress bars
- Pending actions (quotations awaiting acceptance, invoices pending)
- Recent reports
- Quick stats: projects, outstanding invoices, total paid

### 17.4 Client Actions in Portal

| Action | Detail |
|--------|--------|
| View quotation | Full PDF preview |
| Accept/Reject quotation | One-click with optional comment |
| View contract | Full PDF preview |
| Download documents | Any PDF linked to their account |
| View project progress | Progress, milestones, health |
| View daily reports | All reports submitted for their projects |
| View invoices | All invoices with payment status |
| Upload files | Files go to their project file section |
| Send message | Internal messaging to the team |
| Approve deliverables | Mark milestones as approved |

### 17.5 Portal Security

- Data isolation: Client sees ONLY their own data (enforced at API level)
- All API endpoints prefixed with `/portal/` have separate middleware
- Audit log of all portal actions
- Session expiry: 24 hours

---

## 18. CRM Sales Pipeline

*(Detailed specifications already covered in Module 2 — Section 7.2)*

### 18.1 Advanced CRM Features

**Lead Scoring System:**

Automated scoring (0–100) based on:
- Deal value (higher = more points)
- Response time (faster client response = more points)
- Meeting scheduled (major score boost)
- Source quality (referral > organic > paid)
- Days in pipeline (decreases score over time)

**Follow-up Automation:**
- If lead in "Contacted" stage for 3+ days with no update → auto-reminder
- If lead in "Follow Up" for 5+ days → escalation alert to owner
- If lead marked Lost → optional: send re-engagement email in 30 days

**Lead Import:**
- Bulk CSV import
- Duplicate detection (by mobile number or email)
- Source tracking on import

---

## 19. Future Roadmap

### 19.1 Phase 2 Additions

| Feature | Description | Priority |
|---------|-------------|----------|
| Client Portal | Full client self-service (detailed above) | Critical |
| WhatsApp Business API | Direct document sending from system | High |
| Email Integration | Full mailable system with templates | High |
| Company Calendar | Unified event management | High |
| Advanced Notifications | Multi-channel notification center | High |
| Knowledge Base | Internal SOP management | Medium |
| Document Approval Workflow | Multi-step approval before sending | Medium |
| E-Signature Integration | DocuSign or HelloSign API | Medium |
| Payment Gateway | Online payment link in invoice | Medium |
| Advanced Global Search | Elasticsearch or Meilisearch | Medium |

### 19.2 Phase 3 Additions

| Feature | Description | Priority |
|---------|-------------|----------|
| AI Assistant | Generate quotations, contracts, follow-ups via Claude/GPT | High |
| Mobile App (React Native) | Owner + Client apps | High |
| SaaS Multi-Tenant Version | Commercial platform for other businesses | High |
| Advanced Analytics | Business intelligence with predictive insights | Medium |
| HR Module | Employee attendance, payroll basics, leave management | Medium |
| Asset Management | Company equipment and license tracking | Low |
| API Integrations | Zapier, Make.com, accounting software | Medium |
| Subscription Management | Manage SaaS product subscribers | High |
| Support Ticket System | Client support management | Medium |
| Accounting Integration | QuickBooks, Zoho Books, or local accounting | Medium |

### 19.3 SaaS Commercialization Roadmap

**Step 1 (MVP — Internal Use):** Build and use for Madarik Tech internally. Refine all workflows based on real usage. Document every edge case.

**Step 2 (Beta — Selected Clients):** Offer platform to 3–5 trusted clients at no cost in exchange for feedback. Fix issues, improve UX.

**Step 3 (Soft Launch):** Launch as SaaS with 3 pricing tiers:

| Plan | Target | Features |
|------|--------|----------|
| Starter | Freelancers, micro-businesses | Clients, Projects, Invoices, Tasks |
| Professional | SMEs, agencies | Full platform minus AI |
| Enterprise | Large companies | Full platform + AI + Custom branding |

**Step 4 (Arabic Market Expansion):** Target Saudi Arabia, UAE, Kuwait, Egypt markets with:
- Full Arabic RTL interface
- VAT compliance (Saudi, UAE)
- Arabic contract templates
- WhatsApp-first onboarding

**Step 5 (Platform Ecosystem):** Marketplace of integrations, industry-specific modules, white-label options.

### 19.4 AI Assistant Vision

The AI assistant will be integrated into every module:

| Module | AI Capability |
|--------|--------------|
| Quotations | "Generate a quotation for a 5-page website for a restaurant" |
| Contracts | "Draft a maintenance agreement for POS Pixel Pro" |
| Daily Reports | "Write a professional report based on these bullet points" |
| Follow-up | "Generate a follow-up WhatsApp message for [client] after 7 days of no reply" |
| P&L Analysis | "Why is this project unprofitable? Suggest improvements." |
| Lead Qualification | "Based on this lead's profile, what's the likelihood of conversion?" |
| Meeting Summaries | "Summarize this meeting and extract action items" |

**Recommended Model:** Claude API (claude-sonnet-4-6 or above) — best Arabic language support, longest context window, tool use capabilities.

---

## 20. Technical Recommendations

### 20.1 Technology Stack

| Layer | Technology | Justification |
|-------|-----------|--------------|
| Frontend | React 18 + Vite + TypeScript | Fast, type-safe, excellent ecosystem |
| UI Framework | Tailwind CSS + shadcn/ui | Beautiful, accessible, customizable |
| State Management | Zustand (global) + React Query (server state) | Lightweight, performant |
| Backend | Laravel 11 | Mature, rich ecosystem, excellent Arab developer community |
| Authentication | Laravel Sanctum | SPA-ready, secure |
| Database | MySQL 8.0 | Reliable, widely supported, excellent Laravel integration |
| Cache & Queue | Redis | Required for performance and background jobs |
| File Storage | Local (MVP) → AWS S3 (Production) | Laravel Storage abstraction |
| PDF Generation | Laravel Snappy (wkhtmltopdf) | Best CSS support for complex layouts |
| Email | Laravel Mailable + Mailgun/SendGrid | Reliable delivery |
| Real-time | Laravel Echo + Pusher/Soketi | WebSocket for notifications |
| Search | Laravel Scout + Meilisearch | Fast full-text search |
| Charts | Recharts | React-native, customizable |
| Date handling | Day.js + Hijri calendar library | Lightweight, Hijri support |
| RTL Support | CSS logical properties + direction toggle | Proper Arabic layout |

### 20.2 Architecture Pattern

**Backend:** RESTful API following Laravel best practices
- Controllers → Services → Repositories → Models
- API Resources for response transformation
- Form Requests for validation
- Policies for authorization
- Jobs for background processing
- Events + Listeners for reactive automation
- Observers for model lifecycle hooks

**Frontend:** Feature-based folder structure
```
src/
├── features/
│   ├── clients/
│   ├── projects/
│   ├── crm/
│   ├── quotations/
│   └── ...
├── components/
│   ├── ui/ (shadcn base)
│   └── shared/
├── hooks/
├── stores/
├── services/
└── utils/
```

### 20.3 API Design

- **Base URL:** `/api/v1/`
- **Versioning:** URI versioning (v1, v2)
- **Authentication:** Bearer token (Sanctum)
- **Response format:** JSON API-inspired
- **Pagination:** Cursor-based for large datasets
- **Rate limiting:** 60 requests/minute (authenticated), 10/minute (public)

**Standard Response Envelope:**
```json
{
  "success": true,
  "data": {},
  "message": "Record created successfully",
  "meta": {
    "pagination": {}
  }
}
```

### 20.4 Security Implementation

- HTTPS enforced everywhere
- CORS configured for frontend domain only
- SQL injection: Eloquent ORM + PDO bindings
- XSS: React escaping + DOMPurify for rich text
- CSRF: Laravel CSRF protection
- Rate limiting: Per-user per-endpoint limits
- File uploads: Type validation, virus scan (ClamAV — optional)
- Secrets: Laravel `.env` + never committed to git
- Audit: All CUD operations logged to `activities` table

### 20.5 Performance Strategy

| Technique | Implementation |
|-----------|---------------|
| Database | Eager loading (with()), pagination, indexing |
| Caching | Dashboard KPIs cached in Redis (5-min TTL) |
| Queue | PDF generation, email, WhatsApp → async jobs |
| Frontend | Code splitting, lazy loading per route |
| Images | WebP format, responsive sizes, lazy loading |
| API | Response caching for static lists (currencies, countries) |
| Real-time | WebSocket over polling for notifications |

### 20.6 Deployment Architecture

**Production Stack:**
```
┌─────────────────────────────────────────────────┐
│  Nginx (reverse proxy + SSL termination)        │
├──────────────┬──────────────────────────────────┤
│  React SPA   │  Laravel API (PHP-FPM)           │
│  (static)    │                                  │
├──────────────┴──────────────────────────────────┤
│  MySQL 8.0   │  Redis   │  Meilisearch          │
└─────────────────────────────────────────────────┘
```

**Recommended hosting (MVP):**
- VPS: DigitalOcean Droplet or Hetzner Cloud
- 4 vCPUs, 8GB RAM, 160GB SSD
- Ubuntu 22.04 LTS
- Laravel Forge or Ploi for server management

---

## 21. MVP Scope — Phase 1

### 21.1 Phase 1 Deliverables

**Duration Estimate:** 3–4 months (with a skilled full-stack team)

**Core Modules to Build:**

| Module | Status | Notes |
|--------|--------|-------|
| Authentication & RBAC | ✅ Must Build | Roles, permissions, login |
| Settings Module | ✅ Must Build | Company info, branding |
| Dashboard (basic) | ✅ Must Build | KPI cards, active projects |
| CRM / Leads | ✅ Must Build | Pipeline, lead management |
| Clients | ✅ Must Build | Full client profiles |
| Quotations | ✅ Must Build | Builder, PDF, sharing |
| Projects | ✅ Must Build | Full project management |
| Contracts | ✅ Must Build | Template-based builder |
| Invoices | ✅ Must Build | Full invoice lifecycle |
| Expenses | ✅ Must Build | Expense tracking |
| Tasks | ✅ Must Build | Full task management |
| Daily Reports | ✅ Must Build | PDF report generation |
| PDF System | ✅ Must Build | All document types |
| Products Catalog | ✅ Must Build | Service/product list |
| P&L Module | ✅ Must Build | Per project + company |
| Notifications (in-app) | ✅ Must Build | Basic notification center |
| File Uploads | ✅ Must Build | Local storage |
| Activity Timeline | ✅ Must Build | Per client/project |
| Reminders | ✅ Must Build | In-app + email |
| Basic Analytics | ✅ Must Build | Essential charts |

**Deferred to Phase 2:**
- Client Portal
- WhatsApp Business API (Phase 1 uses click-to-send)
- Calendar
- Knowledge Base
- Advanced Search (Meilisearch)
- Real-time notifications (WebSocket)

### 21.2 MVP Success Criteria

1. Owner can manage all clients from one screen
2. Sales manager can track full pipeline from lead to client
3. Quotations generated as professional PDFs in under 1 minute
4. Projects tracked with real-time financial dashboard
5. Invoices created, sent, and payment recorded
6. Expenses linked to projects for P&L calculation
7. Tasks assigned, tracked, completed
8. Daily reports sent to clients as PDF
9. All key metrics visible on executive dashboard
10. RBAC enforced — each user sees only what they should

---

## 22. Phase 2 Scope

**Duration Estimate:** 2–3 months after Phase 1 stabilization

| Feature | Description |
|---------|-------------|
| Client Portal | Full client self-service portal |
| Email Integration | Mailable system with branded templates |
| WhatsApp Business API | Direct document sending |
| Company Calendar | Unified event calendar |
| Advanced Notifications | Email + WhatsApp notification channels |
| Knowledge Base | Article management with search |
| Document Approval Flow | Draft → Review → Approved → Sent |
| Project Templates | Reusable templates for rapid setup |
| Advanced Search | Meilisearch integration |
| Real-time Notifications | WebSocket via Laravel Echo |
| Payment Reminders (auto) | Automated collection sequences |
| E-Signature (basic) | Signature capture in client portal |
| Opportunities Module | Future ideas tracking |
| Advanced Reporting | Full report suite with exports |
| Subscription Management | Track SaaS product subscribers |

---

## 23. Phase 3 Scope

**Duration Estimate:** 3–6 months (high complexity features)

| Feature | Description |
|---------|-------------|
| AI Assistant | Claude API integration across all modules |
| Mobile App | React Native (iOS + Android) |
| Multi-Tenant SaaS | Full tenant isolation + billing |
| HR Module | Employee records, attendance, leave |
| Asset Management | Company asset tracking |
| Advanced Analytics | Business intelligence, predictive insights |
| Accounting Integration | Export to accounting software |
| API Marketplace | Public API for third-party integrations |
| White-label | Custom branding per tenant |
| Mobile Client App | Client portal as mobile app |
| AI Report Generation | Auto-generate daily reports from task data |
| Revenue Forecasting | AI-powered pipeline-to-revenue prediction |

---

## 24. Risks & Challenges

### 24.1 Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| PDF generation complexity | Medium | High | Choose Snappy early; prototype before full build |
| WhatsApp API approval delays | High | Medium | Use click-to-send in MVP; apply for API in parallel |
| Real-time notification performance | Low | Medium | Use Pusher/Soketi; implement with queue backing |
| Database performance at scale | Low | High | Implement indexing strategy from day one |
| File storage cost growth | Medium | Low | Implement storage limits; use S3 lifecycle rules |
| Multi-tenancy complexity | Low (Phase 3) | High | Include tenant_id in all tables from MVP |

### 24.2 Business Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Low user adoption | Medium | High | Involve team in design; provide training; start with owner as champion |
| Feature creep delaying MVP | High | High | Strictly enforce Phase 1 scope; defer all Phase 2 requests |
| Data migration from current tools | Medium | Medium | Build import tools for Excel/CSV early |
| Client resistance to portal | Medium | Medium | Make portal compelling; show value in first use |
| Team over-reliance on system | Low | Low | System should enable, not constrain; maintain flexibility |

### 24.3 Operational Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Data loss | Low | Critical | Daily backups + off-site backup storage |
| Security breach | Low | Critical | Security audit before launch; regular penetration testing |
| Server downtime | Low | High | Monitoring (UptimeRobot); quick recovery runbook |
| Developer dependency | Medium | High | Code must be well-documented; no single-developer bottleneck |

---

## 25. Final Recommendations

### 25.1 For the Business Owner

1. **Start using the system from Day 1 of development** — even in its basic form. Early adoption builds the habit and surfaces requirements that written specs miss.

2. **Make the dashboard your morning ritual** — open it before anything else each day. The system's value compounds with consistent use.

3. **Enter ALL leads into the CRM** — even old ones, even lost ones. Historical data is the foundation of future decisions.

4. **Generate every quotation through the system** — never outside it. Consistency builds the data you need for analytics.

5. **Record every expense** — no matter how small. The P&L module is only as accurate as the data you put in.

6. **Invite clients to the portal** — this is a competitive differentiator. Clients who can track their own projects call less and trust more.

### 25.2 For the Development Team

1. **Architecture first** — spend the first sprint on database design and API architecture. Do not rush into building features. A solid foundation saves months of refactoring.

2. **Build the PDF system early** — it is the most critical customer-facing feature and often more complex than expected. Test it with edge cases (long text, Arabic content, images) before building dependent features.

3. **Test RBAC thoroughly** — security breaches from permission misconfiguration are catastrophic. Every API endpoint must be tested with wrong-role tokens.

4. **Use feature flags** — never break the running system. Ship new features behind flags and enable them when ready.

5. **Implement tenant_id from sprint 1** — adding it later to 40+ tables is painful and risky. Even if multi-tenancy isn't needed now, the field cost is zero.

6. **Prioritize mobile-responsive design** — the business owner will use the dashboard on mobile. Design desktop-first but test all key actions on a phone screen.

7. **Queue everything heavy** — PDF generation, email sending, and WhatsApp messages must never block the HTTP request. Use queues from day one.

### 25.3 Strategic Recommendations

1. **Own Your Category** — position Madarik Tech Business OS as the "Business OS for Arab Tech Companies." No generic project management tool serves this niche. Speak to it loudly.

2. **Productize Internally First** — use the system hard for 6 months internally. Every pain point you fix makes the product better for future paying customers.

3. **Document Everything** — the knowledge base module is not optional. Capture every process, script, and SOP. This becomes your operational moat.

4. **Track Every Number** — conversion rate, average deal size, project margin, collection days. What gets measured gets managed.

5. **Think of Clients as Partners in the Portal** — the more value you give clients in the portal, the stickier your relationships become. This directly reduces churn and increases referrals.

6. **Plan the SaaS Launch from Day 1** — multi-tenancy in the schema, clean permission system, configurable company settings — all designed for a SaaS launch. The marginal cost of building it right the first time is small compared to rebuilding later.

---

## Appendix A: Glossary

| Term | Definition |
|------|-----------|
| **MVP** | Minimum Viable Product — the first working version with core features |
| **RBAC** | Role-Based Access Control — permission system by user role |
| **CRM** | Customer Relationship Management — lead and client tracking |
| **P&L** | Profit and Loss — financial performance statement |
| **SaaS** | Software as a Service — subscription-based software |
| **PDF** | Portable Document Format — standard for professional documents |
| **RTL** | Right-to-Left — text direction for Arabic content |
| **API** | Application Programming Interface — how systems communicate |
| **JWT** | JSON Web Token — secure authentication mechanism |
| **ORM** | Object-Relational Mapper — database abstraction layer (Eloquent) |
| **Queue** | Background job system for async processing |
| **Multi-tenant** | One system serving multiple companies with data isolation |
| **Health Score** | Calculated indicator of project status across multiple dimensions |
| **Pipeline** | Sequential stages a lead passes through before becoming a client |
| **Milestone** | Defined deliverable within a project tied to payment or approval |

---

## Appendix B: Document Number Formats

| Document | Format | Example |
|----------|--------|---------|
| Quotation | QT-{YEAR}-{4-digit sequential} | QT-2026-0042 |
| Contract | CT-{YEAR}-{4-digit sequential} | CT-2026-0015 |
| Invoice | INV-{YEAR}-{4-digit sequential} | INV-2026-0099 |
| Project | PRJ-{YEAR}-{4-digit sequential} | PRJ-2026-0007 |
| Lead | LD-{YEAR}-{4-digit sequential} | LD-2026-0301 |

All prefixes configurable from Settings module.

---

## Appendix C: Color System

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | #1E40AF (Blue) | Buttons, links, key actions |
| Success | #16A34A (Green) | Completed, paid, healthy |
| Warning | #D97706 (Amber) | Approaching deadline, partial |
| Danger | #DC2626 (Red) | Overdue, critical, error |
| Info | #0891B2 (Cyan) | Information, notes |
| Neutral | #6B7280 (Gray) | Inactive, cancelled, secondary |

---

*Document End*

---

**Document Information**

| Field | Value |
|-------|-------|
| Version | 1.0 |
| Status | Ready for Development Review |
| Prepared By | AI Business Analysis (Claude) |
| Prepared For | Madarik Tech |
| Date | June 13, 2026 |
| Tech Stack | React (Vite + TypeScript) · Laravel 11 · MySQL 8.0 |
| Next Step | Development team review → Sprint planning → Phase 1 kickoff |

---

*بسم الله، وعلى بركة الله — نبدأ*

---

---

# ADDENDUM — Version 1.1
## 10 Additional Modules & Requirements
### Added: June 2026

---

## Module 20: Meetings

### 20.1 Purpose

Meetings are one of the most critical and frequently forgotten touchpoints in a client relationship. Without structured documentation, decisions get lost, action items are never followed up on, and accountability disappears. This module transforms every meeting from a conversation into a documented, actionable, and professional record — automatically delivered to the client.

### 20.2 Meeting Data Model

| Field | Type | Required |
|-------|------|----------|
| Meeting Number | Auto-generated | Auto |
| Meeting Title | Text | Yes |
| Meeting Type | Enum | Yes |
| Client | Link to Client | Yes |
| Project | Link to Project | No |
| Date | Date | Yes |
| Start Time | Time | Yes |
| End Time | Time | No |
| Location / Platform | Text | No |
| Attendees (Internal) | Multi-user | Yes |
| Attendees (External) | Text array (names + emails) | No |
| Agenda | Rich text | No |
| Meeting Notes | Rich text | Yes |
| Decisions Made | Rich text | Yes |
| Action Items | Array (see below) | No |
| Next Meeting Date | Date | No |
| Status | Enum | Auto |
| PDF Path | Text | Auto |
| Sent Via | Enum | Auto |
| Sent At | Timestamp | Auto |
| Created By | User | Auto |
| Created At | Timestamp | Auto |

**Meeting Types:**
- Discovery Call
- Kick-off Meeting
- Progress Review
- Design Review
- Delivery & Handover
- Support Meeting
- Sales Meeting
- Internal Meeting
- Other

**Status Enum:** Scheduled / In Progress / Completed / Cancelled

### 20.3 Action Items Structure

Each action item is a structured sub-record:

| Field | Type |
|-------|------|
| Action Description | Text |
| Assigned To (Internal User or External Name) | Text |
| Due Date | Date |
| Status | Enum (Pending / In Progress / Done) |
| Priority | Enum (Low / Normal / High) |

Action items are tracked independently and can be linked to the Tasks module — when created, a corresponding Task record is auto-generated for the assigned internal user.

### 20.4 Meeting Minutes PDF — Layout

The generated Meeting Minutes PDF follows the global company template (header + footer from Settings) and includes:

```
┌───────────────────────────────────────────────────────────┐
│  [COMPANY HEADER]                                         │
├───────────────────────────────────────────────────────────┤
│  MEETING MINUTES                                          │
│  ─────────────────────────────────────────────────────   │
│  Title:    [Meeting Title]                                │
│  Date:     [Date]  |  Time: [Start] – [End]               │
│  Location: [Location or Platform]                         │
│  Client:   [Client Name / Company]                        │
│  Project:  [Project Name]                                 │
├───────────────────────────────────────────────────────────┤
│  ATTENDEES                                                │
│  Internal: [Names]                                        │
│  External: [Names + Emails]                               │
├───────────────────────────────────────────────────────────┤
│  AGENDA                                                   │
│  [Agenda content]                                         │
├───────────────────────────────────────────────────────────┤
│  MEETING NOTES                                            │
│  [Detailed notes]                                         │
├───────────────────────────────────────────────────────────┤
│  DECISIONS MADE                                           │
│  • Decision 1                                             │
│  • Decision 2                                             │
├───────────────────────────────────────────────────────────┤
│  ACTION ITEMS                                             │
│  ┌────────────────┬──────────────┬──────────┬──────────┐  │
│  │ Action         │ Assigned To  │ Due Date │ Status   │  │
│  ├────────────────┼──────────────┼──────────┼──────────┤  │
│  │ [Description]  │ [Name]       │ [Date]   │ Pending  │  │
│  └────────────────┴──────────────┴──────────┴──────────┘  │
├───────────────────────────────────────────────────────────┤
│  Next Meeting: [Date if scheduled]                        │
├───────────────────────────────────────────────────────────┤
│  [COMPANY FOOTER — QR Code, Website, Social, Address]     │
└───────────────────────────────────────────────────────────┘
```

### 20.5 Meeting Workflow

```
[New Meeting Created]
        ↓
[Fill: Title, Client, Project, Date, Time]
        ↓
[During/After Meeting: Fill Notes, Decisions, Action Items]
        ↓
[Status → Completed]
        ↓
[System generates Meeting Minutes PDF]
        ↓
[User chooses: Download / Send via Email / Send via WhatsApp]
        ↓
[If action items exist → Tasks auto-created for internal assignees]
        ↓
[Meeting logged in Client Activity Timeline]
```

### 20.6 Meeting Actions

- **Quick actions from any meeting record:**
  - Generate PDF
  - Send to Client (Email / WhatsApp)
  - Convert action items to Tasks
  - Schedule follow-up meeting
  - Link to project
  - View in client timeline

### 20.7 Meetings in Client Profile

All meetings with a client appear chronologically in:
- The **Client Profile → Activity Tab**
- The **Client Profile → Meetings Tab** (dedicated tab)
- The **Client Portal → Meetings section** (client can view minutes)

### 20.8 Database Table: meetings

```
id, tenant_id, meeting_number, title, type, client_id (FK),
project_id (FK nullable), date, start_time, end_time,
location, internal_attendees (JSON), external_attendees (JSON),
agenda (TEXT), notes (LONGTEXT), decisions (TEXT),
next_meeting_date, status, pdf_path,
sent_via, sent_at, created_by, created_at, updated_at, deleted_at
```

### 20.9 Database Table: meeting_action_items

```
id, meeting_id (FK), task_id (FK nullable),
description, assigned_to_user_id (FK nullable),
assigned_to_name (Text), due_date, priority, status,
created_at, updated_at
```

### 20.10 Client Portal: Meetings

In the Client Portal, the client can:
- View all meeting minutes for their projects
- Download Meeting Minutes PDF
- View action items assigned to them
- Mark their own action items as done

---

## Module 21: Lead Source Analytics

### 21.1 Purpose

Marketing spend without source attribution is money thrown into darkness. This module gives Madarik Tech complete clarity on which marketing channels generate the most leads, convert the most clients, and produce the most revenue — enabling intelligent budget allocation decisions.

### 21.2 Lead Source Tracking

Every lead must have a **Source** field (mandatory). Sources are:

| Source | Category |
|--------|----------|
| Meta Ads (Facebook/Instagram) | Paid |
| Google Ads | Paid |
| Instagram Organic | Organic |
| LinkedIn | Organic/Paid |
| Website Contact Form | Organic |
| WhatsApp Direct | Direct |
| Referral | Word of Mouth |
| Exhibition / Event | Offline |
| Cold Outreach | Outbound |
| TikTok | Paid/Organic |
| YouTube | Organic |
| Manual Entry | Other |
| Other | Other |

For **Referral** source: an additional field captures the referrer's name/company.

For **Paid** sources: optional fields for campaign name and ad set (for advanced tracking).

### 21.3 Lead Source Analytics Dashboard

A dedicated analytics view under the CRM module displaying:

#### 21.3.1 Leads by Source Table

| Source | Total Leads | Won | Lost | Active | Conversion Rate |
|--------|-------------|-----|------|--------|----------------|
| Meta Ads | 32 | 15 | 10 | 7 | 46.9% |
| Google Ads | 18 | 8 | 6 | 4 | 44.4% |
| Referral | 9 | 4 | 2 | 3 | 44.4% |
| Instagram | 12 | 3 | 7 | 2 | 25.0% |
| Website | 21 | 5 | 11 | 5 | 23.8% |
| **Total** | **92** | **35** | **36** | **21** | **38.0%** |

#### 21.3.2 Revenue by Source Table

| Source | Won Clients | Total Revenue | Avg Deal Size | Pipeline Value |
|--------|-------------|---------------|---------------|----------------|
| Meta Ads | 15 | 120,000 AED | 8,000 AED | 42,000 AED |
| Google Ads | 8 | 85,000 AED | 10,625 AED | 30,000 AED |
| Referral | 4 | 70,000 AED | 17,500 AED | 18,000 AED |
| Instagram | 3 | 22,000 AED | 7,333 AED | 15,000 AED |
| Website | 5 | 38,000 AED | 7,600 AED | 24,000 AED |
| **Total** | **35** | **335,000 AED** | **9,571 AED** | **129,000 AED** |

#### 21.3.3 Cost Per Lead (if ad spend recorded)

| Source | Ad Spend | Total Leads | Cost Per Lead | Cost Per Client |
|--------|----------|-------------|---------------|----------------|
| Meta Ads | 8,000 AED | 32 | 250 AED | 533 AED |
| Google Ads | 6,000 AED | 18 | 333 AED | 750 AED |

Ad spend is entered manually per source per month in a dedicated "Marketing Spend" sub-section.

#### 21.3.4 Visual Charts

1. **Leads by Source** — Donut/Pie chart (count)
2. **Revenue by Source** — Horizontal bar chart
3. **Conversion Rate by Source** — Bar chart comparison
4. **Monthly Lead Volume by Source** — Stacked area chart (trend over time)
5. **ROI by Source** — Revenue vs Spend comparison (if spend data available)

### 21.4 Time-Based Filtering

All source analytics filterable by:
- This Month / Last Month
- This Quarter / Last Quarter
- This Year / Custom Date Range

### 21.5 Source Attribution Logic

- Lead Source is set at creation and **never changes**, even after conversion
- If a lead is created from CRM and no source is specified → system prompts before save
- Bulk import must include source column (required)

### 21.6 Marketing Spend Tracking

A sub-module for recording monthly ad spend per channel:

```
id, tenant_id, source, month, year, amount, currency_id,
campaign_name, notes, created_by, created_at
```

This enables ROI calculation: **Revenue from Source / Ad Spend for Source**.

### 21.7 Referral Tracking

When source = Referral:
- Referrer Name (text)
- Referrer Type (Client / Partner / Employee / Other)
- Linked Client (if referrer is an existing client)

Referral analytics view:
- Top referrers by leads generated
- Top referrers by revenue generated
- Referral bonus tracking (optional future: commission management)

---

## Module 22: Client Communication Timeline

### 22.1 Purpose

Every interaction with a client — message sent, document shared, call made, meeting held — must be recorded in a single, chronological timeline. This is the HubSpot-style communication history that eliminates "I didn't know that was sent" and gives every team member instant context before a client interaction.

### 22.2 What Gets Automatically Logged

The system automatically records the following events to the timeline without any manual input:

| Event Type | Icon | Trigger |
|------------|------|---------|
| WhatsApp Sent | 💬 | User clicks "Send via WhatsApp" for any document |
| Email Sent | 📧 | System sends any email to this client |
| Quotation Sent | 📄 | Quotation status changes to "Sent" |
| Quotation Accepted | ✅ | Client or user marks quotation accepted |
| Quotation Rejected | ❌ | Client or user marks quotation rejected |
| Contract Sent | 📋 | Contract status changes to "Sent" |
| Contract Signed | ✍️ | Contract marked as signed |
| Invoice Sent | 🧾 | Invoice status changes to "Sent" |
| Payment Received | 💰 | Payment recorded on invoice |
| Payment Reminder Sent | ⏰ | Automated or manual reminder sent |
| Meeting Held | 🤝 | Meeting status set to "Completed" |
| Meeting Minutes Sent | 📝 | Meeting PDF sent to client |
| Daily Report Sent | 📊 | Report status changes to "Sent" |
| Note Added | 📌 | User adds a note to the client |
| File Uploaded | 📎 | File attached to any client record |
| Project Created | 🚀 | New project linked to client |
| Project Completed | 🏁 | Project status set to "Completed" |
| Task Completed | ✔️ | Task linked to client marked done |
| Support Ticket Opened | 🎫 | New ticket created for client |
| Support Ticket Resolved | 🔧 | Ticket closed |
| Renewal Reminder Sent | 🔄 | Subscription/domain renewal alert sent |

### 22.3 Manual Log Entries

Team members can also manually log interactions:

| Log Type | Fields |
|----------|--------|
| Phone Call | Direction (inbound/outbound), duration, summary |
| WhatsApp Chat (manual note) | Summary of conversation |
| In-Person Visit | Location, attendees, summary |
| General Note | Free text |

### 22.4 Timeline UI Design

```
CLIENT PROFILE → ACTIVITY TIMELINE

─────────────────────────────────────────────────────────
  🔍 [Search timeline...]    [Filter: All ▼]  [Date: ▼]
─────────────────────────────────────────────────────────

  TODAY
  ─────
  💬  2:30 PM   WhatsApp Sent
                "Invoice INV-2026-0042 shared via WhatsApp"
                Sent by: Khalid (Sales)

  📧  10:15 AM  Email Sent
                Subject: "Project Update — Week 3"
                Sent by: Sara (PM)

  YESTERDAY
  ─────────
  💰  4:00 PM   Payment Received
                "2,500 AED received — Invoice INV-2026-0042"
                Recorded by: Fatima (Finance)

  🤝  11:00 AM  Meeting Held
                "Requirements Review Meeting"
                Duration: 1.5 hours | [View Minutes PDF]

  JUNE 10, 2026
  ─────────────
  ✅  3:22 PM   Quotation Accepted
                "QT-2026-0018 — Website Development (12,000 AED)"
                [View Quotation]

  📄  9:00 AM   Quotation Sent
                "QT-2026-0018 sent via Email + WhatsApp"
                Sent by: Khalid (Sales)
─────────────────────────────────────────────────────────
```

### 22.5 Timeline Filtering

Filter by:
- Event Type (all checkboxes, multi-select)
- Date Range
- Team Member who performed the action
- Channel (WhatsApp / Email / In-person)

### 22.6 Database Table: client_communications

```
id, tenant_id, client_id (FK), event_type, channel,
subject, body (TEXT), direction (inbound/outbound),
related_type, related_id (polymorphic — links to invoice, quotation, etc.),
performed_by (FK users), performed_at,
metadata (JSON — extra context per event type),
created_at
```

### 22.7 Timeline in Client Portal

Clients see a simplified version of their own timeline:
- Documents sent to them
- Reports received
- Invoices and payment confirmations
- Meetings and minutes

Internal notes and internal team communications are **never visible** in the client portal.

---

## Module 23: Deliverables Tracking

### 23.1 Purpose

Projects are made of deliverables. Tracking tasks is operational — tracking deliverables is contractual. This module defines what must be delivered, tracks approval status, and gives clients a clear view of what they are receiving and when.

### 23.2 Deliverable Data Model

| Field | Type | Required |
|-------|------|----------|
| Deliverable Name | Text | Yes |
| Description | Text | No |
| Project | Link | Yes |
| Category | Enum | No |
| Assigned To | User | No |
| Due Date | Date | No |
| Status | Enum | Auto |
| Client Approval Required | Boolean | Yes |
| Client Approval Status | Enum | Auto |
| Client Approved By | Text | Auto |
| Client Approved At | Timestamp | Auto |
| Client Rejection Note | Text | Auto |
| Files | Attachments | No |
| Sort Order | Number | Auto |
| Created By | User | Auto |

**Status Enum:** Pending / In Progress / Ready for Review / Approved / Rejected / Delivered

**Client Approval Status:** Awaiting / Approved / Rejected

### 23.3 Deliverable Categories

- Design (mockups, wireframes, brand assets)
- Development (features, modules, APIs)
- Content (copy, media, documentation)
- Testing (QA reports, UAT sign-off)
- Deployment (hosting setup, go-live)
- Training (documentation, sessions)
- Handover (credentials, source code)

### 23.4 Example: Website Project Deliverables

```
Website Development Project — Deliverables
────────────────────────────────────────────────────────
  ✅  1. Discovery & Requirements Document      APPROVED
  🔄  2. Sitemap & Information Architecture    IN PROGRESS
  ⏳  3. UI/UX Wireframes                      PENDING
  ⏳  4. Visual Design (Homepage)              PENDING
  ⏳  5. Visual Design (Inner Pages)           PENDING
  ⏳  6. Frontend Development                 PENDING
  ⏳  7. Backend Development                  PENDING
  ⏳  8. Content Integration                  PENDING
  ⏳  9. QA Testing & Bug Fixes               PENDING
  ⏳  10. Client UAT Review                   PENDING
  ⏳  11. Deployment & Go-Live                PENDING
  ⏳  12. Training Session                    PENDING
  ⏳  13. Source Code Handover                PENDING
────────────────────────────────────────────────────────
  Progress: 1/13 Approved  |  Overall: 8%
```

### 23.5 Client Portal: Deliverable Approval Workflow

```
[Team marks deliverable as "Ready for Review"]
        ↓
[Client receives notification (email + in-app)]
        ↓
[Client logs into portal → sees deliverable with attached files]
        ↓
[Client reviews files/links]
        ↓
[Client clicks: ✅ Approve  or  ❌ Request Changes]
        ↓
[If Approved → status updated → team notified → invoice can be triggered]
[If Rejected → client adds comment → team notified → revision starts]
```

### 23.6 Deliverable-to-Invoice Trigger

When a deliverable is marked **Approved** by the client:
- If the deliverable is linked to a payment milestone → system prompts to generate invoice
- This creates a clear contractual paper trail: "Client approved X → Invoice generated"

### 23.7 Deliverables from Project Templates

Project templates can include a default deliverables list. When a template is applied:
- All deliverables are auto-created with relative due dates
- Client approval flag is pre-set per deliverable type

### 23.8 Database Table: deliverables

```
id, tenant_id, project_id (FK), name, description, category,
assigned_to (FK users nullable), due_date, status,
client_approval_required, client_approval_status,
client_approved_by, client_approved_at,
client_rejection_note, sort_order,
created_by, created_at, updated_at, deleted_at
```

---

## Module 24: Support Tickets

### 24.1 Purpose

Project delivery is not the end of the relationship — it is the beginning of support. Madarik Tech's SaaS products (POS Pixel Pro, PRO SYS, WhatsApp AI Agent) and custom projects all require structured post-delivery support. This module replaces informal WhatsApp support with a tracked, accountable system.

### 24.2 Ticket Data Model

| Field | Type | Required |
|-------|------|----------|
| Ticket Number | Auto-generated | Auto |
| Title / Subject | Text | Yes |
| Description | Rich text | Yes |
| Client | Link | Yes |
| Project | Link | No |
| Product | Link (from Products catalog) | No |
| Priority | Enum | Yes |
| Category | Enum | Yes |
| Status | Enum | Auto |
| Assigned To | User | No |
| SLA Due Date | DateTime | Auto (calculated from priority) |
| First Response At | Timestamp | Auto |
| Resolved At | Timestamp | Auto |
| Resolution Notes | Text | No |
| Attachments | Files | No |
| Created Via | Enum (Portal / Internal / Email) | Auto |
| Created By | User / Client | Auto |
| Created At | Timestamp | Auto |

**Priority Enum:**

| Priority | SLA Response Time | SLA Resolution Time |
|----------|------------------|---------------------|
| Critical | 1 hour | 4 hours |
| High | 4 hours | 1 business day |
| Normal | 1 business day | 3 business days |
| Low | 2 business days | 7 business days |

**Category Enum:**
- Bug / Error
- Feature Request
- How-to / Training
- Account / Access
- Performance Issue
- Data Issue
- Integration Problem
- General Inquiry

**Status Enum:** Open / In Progress / Awaiting Client Response / Resolved / Closed / Reopened

### 24.3 Support Dashboard

| Metric | Display |
|--------|---------|
| Open Tickets | Count with priority breakdown |
| Overdue (SLA Breached) | Count — highlighted in red |
| Resolved Today | Count |
| Avg Resolution Time | In hours |
| Tickets by Product | Per product breakdown |
| Tickets by Client | Per client count |

### 24.4 Ticket Workflow

```
[Client opens ticket from Portal OR team creates internally]
        ↓
[Ticket created → auto-assigned (or manually assigned)]
        ↓
[Assignee notified (in-app + email)]
        ↓
[SLA timer starts]
        ↓
[Team responds → status: In Progress]
        ↓
[If awaiting client input → status: Awaiting Client Response]
(SLA timer paused during awaiting period)
        ↓
[Issue resolved → status: Resolved]
        ↓
[Client confirms OR auto-closes after 3 days of no response]
        ↓
[Ticket Closed → resolution time logged]
```

### 24.5 Client Portal: Ticket Submission

From the portal, clients can:
- Open a new support ticket
- View all their tickets and status
- Reply to ticket comments
- Mark issue as resolved
- Reopen closed ticket

### 24.6 SaaS Product Support Integration

For POS Pixel Pro, PRO SYS, and WhatsApp AI Agent:
- Tickets linked to specific product version
- Common issues tracked → knowledge base articles auto-suggested
- Recurring issues flagged for product team review

### 24.7 Database Table: support_tickets

```
id, tenant_id, ticket_number, title, description (TEXT),
client_id (FK), project_id (FK nullable), product_id (FK nullable),
priority, category, status, assigned_to (FK users nullable),
sla_due_at, first_response_at, resolved_at,
resolution_notes, created_via, created_by_user_id, created_by_client_id,
created_at, updated_at, deleted_at
```

### 24.8 Database Table: ticket_comments

```
id, ticket_id (FK), author_type (user/client), author_id,
body (TEXT), is_internal (boolean — hidden from client),
attachments (JSON), created_at, updated_at
```

---

## Module 25: Renewals Management

### 25.1 Purpose

Missed renewals are silent revenue killers and trust destroyers. A domain that expires, an SSL that lapses, or a hosting subscription that goes down destroys client confidence. This module ensures nothing renews late — and more importantly, nothing ever expires unnoticed.

### 25.2 Renewal Types

| Type | Examples |
|------|---------|
| **Domain** | Client domains managed by Madarik Tech |
| **Hosting** | VPS, shared hosting, cloud servers |
| **SSL Certificate** | SSL/TLS certificates |
| **Software License** | Adobe, Microsoft, development tools |
| **SaaS Subscription** | Client subscriptions to Madarik Tech's SaaS products |
| **Maintenance Contract** | Annual maintenance agreements |
| **API Subscription** | OpenAI, WhatsApp API, Twilio, Maps, etc. |
| **Marketing Subscription** | Meta Ads accounts, Google Ads billing, SEO tools |
| **Other** | Any recurring cost or contract |

### 25.3 Renewal Data Model

| Field | Type | Required |
|-------|------|----------|
| Renewal Name | Text | Yes |
| Type | Enum | Yes |
| Client | Link | No (some are internal) |
| Project | Link | No |
| Vendor / Provider | Text | No |
| Cost | Currency | No |
| Currency | Dropdown | No |
| Start Date | Date | Yes |
| Renewal Date | Date | Yes |
| Billing Cycle | Enum | Yes |
| Auto-Renews | Boolean | No |
| Reminder Days | Array | Default: [30, 15, 7] |
| Assigned To | User | Yes |
| Notes | Text | No |
| Status | Enum | Auto |
| Renewed On | Date | No |
| Created By | User | Auto |

**Billing Cycle Enum:** Monthly / Quarterly / Semi-Annual / Annual / Bi-Annual / Custom

**Status Enum:** Active / Upcoming (within 30 days) / Due Soon (within 7 days) / Overdue / Renewed / Cancelled

### 25.4 Renewals Dashboard

```
RENEWALS OVERVIEW
──────────────────────────────────────────────────────────────
  🔴 OVERDUE (2)          🟡 DUE THIS WEEK (4)
  ───────────────          ────────────────────
  • acme-corp.com          • ssl-startup.net (3 days)
    Domain — 5 days ago      SSL — 240 AED
  • PRO SYS - Baraka Co    • Google Workspace - InternalCo
    SaaS — 2 days ago        Software License (5 days)

  🟠 DUE THIS MONTH (9)   ✅ UPCOMING (23)
  ─────────────────────    ──────────────
  [List of 9 items...]     [List...]
──────────────────────────────────────────────────────────────
```

### 25.5 Automated Reminder Sequence

For each renewal, reminders fire automatically:

| Trigger | Channel | Message |
|---------|---------|---------|
| 30 days before | In-App + Email | "Domain [name] renews in 30 days — Cost: [amount]" |
| 15 days before | In-App + Email | "Reminder: [name] renews in 15 days" |
| 7 days before | In-App + Email + WhatsApp | "⚠️ URGENT: [name] renews in 7 days" |
| 1 day before | In-App + Email + WhatsApp | "🚨 FINAL: [name] renews TOMORROW" |
| Day of | In-App + WhatsApp | "Today: [name] must be renewed" |
| 1 day overdue | In-App + WhatsApp | "🔴 OVERDUE: [name] expired yesterday" |

Reminder days are configurable per renewal record.

### 25.6 Revenue Opportunity: Client Renewal Billing

When a renewal is for a client service (domain, hosting, SSL):
- System can auto-generate an invoice for the renewal amount
- "Generate Renewal Invoice" button on each renewal record
- Invoice pre-filled with renewal details and client info

### 25.7 Database Table: renewals

```
id, tenant_id, name, type, client_id (FK nullable),
project_id (FK nullable), vendor, cost, currency_id,
start_date, renewal_date, billing_cycle, auto_renews,
reminder_days (JSON), assigned_to (FK users),
notes, status, renewed_on, created_by,
created_at, updated_at, deleted_at
```

---

## Module 26: Goals & KPIs

### 26.1 Purpose

What gets measured gets managed. This module gives the business owner and management team a structured way to set business goals, track progress in real time, and maintain focus on what matters most — across sales, revenue, projects, and collections.

### 26.2 Goal Types

| Type | Examples |
|------|---------|
| **Revenue Goal** | Monthly revenue target: 80,000 AED |
| **Sales Goal** | Close 10 new clients this quarter |
| **Collections Goal** | Collect 95% of outstanding invoices this month |
| **Project Goal** | Complete 5 projects on time this quarter |
| **Lead Goal** | Generate 50 new leads this month |
| **Expense Goal** | Keep monthly expenses below 20,000 AED |
| **Custom** | Any company-defined metric |

### 26.3 Goal Data Model

| Field | Type | Required |
|-------|------|----------|
| Goal Title | Text | Yes |
| Goal Type | Enum | Yes |
| Target Value | Number | Yes |
| Unit | Text (AED, %, Count) | Yes |
| Period Type | Enum (Monthly/Quarterly/Annual) | Yes |
| Period Start | Date | Yes |
| Period End | Date | Auto |
| Current Value | Calculated | Auto |
| Progress % | Calculated | Auto |
| Assigned To | User | No |
| Description | Text | No |
| Status | Enum | Auto |
| Created By | User | Auto |

**Status Enum:** Active / Achieved / Missed / Cancelled

### 26.4 Goals Dashboard (Owner View)

```
GOALS — JUNE 2026
──────────────────────────────────────────────────────────────────
  💰 MONTHLY REVENUE
     Target: 80,000 AED    Current: 45,200 AED    Remaining: 18 days
     ████████████░░░░░░░░░░░░  56%
     🟡 On Track to reach ~73,000 AED at current pace

  👥 NEW CLIENTS
     Target: 8             Current: 5              Remaining: 18 days
     ██████████████████░░░░  62%
     ✅ On Track

  📋 COLLECTIONS
     Target: 95%           Current: 71%            Remaining: 18 days
     █████████████░░░░░░░░░  71%
     🔴 Behind — 24% gap to target

  🚀 PROJECTS COMPLETED
     Target: 4             Current: 1              Remaining: 18 days
     █████░░░░░░░░░░░░░░░░░  25%
     🔴 At Risk
──────────────────────────────────────────────────────────────────
```

### 26.5 Auto-Calculation Logic

| Goal Type | Auto-Calculated From |
|-----------|---------------------|
| Revenue Goal | Sum of payments received in period |
| Collections Goal | (Paid / Total Invoiced) × 100 for period |
| New Clients Goal | Count of clients with status changed to Active in period |
| Lead Goal | Count of leads created in period |
| Expense Goal | Sum of expenses in period |
| Projects Completed | Count of projects set to Completed in period |

No manual data entry required — goals update in real time as the business operates.

### 26.6 Historical Goal Tracking

Every past goal is stored and viewable:
- Monthly goal history chart (achieved vs target over 12 months)
- Goal hit rate percentage (how often targets are met)
- Best performing month / worst performing month

### 26.7 Database Table: goals

```
id, tenant_id, title, type, target_value, unit,
period_type, period_start, period_end,
current_value (virtual/calculated), assigned_to (FK users nullable),
description, status, created_by, created_at, updated_at
```

---

## Module 27: Cash Flow Forecast

### 27.1 Purpose

Profit and Loss shows you whether you made money. Cash Flow shows you whether you **have** money. A business can be profitable on paper and still run out of cash. This module provides the owner with a forward-looking view of the next 30, 60, and 90 days — so financial decisions are made with confidence, not anxiety.

### 27.2 Cash Flow Model

**Three Components:**

| Component | Source | Logic |
|-----------|--------|-------|
| **Expected Receivables** | Invoices with due dates in the period | Outstanding invoice amounts by due date |
| **Expected Expenses** | Recorded future expenses + renewals | Expenses with future dates + upcoming renewals |
| **Net Cash Position** | Receivables - Expenses | Calculated |

### 27.3 Cash Flow Dashboard

```
CASH FLOW FORECAST — NEXT 30 DAYS (June 13 – July 13, 2026)
──────────────────────────────────────────────────────────────────

  OPENING BALANCE (estimated):  12,500 AED
  ──────────────────────────────────────────

  📥 EXPECTED RECEIVABLES
  ┌────────────────────────────────────────────────────────────┐
  │  Client         Invoice      Due Date      Amount          │
  │  Ahmed Co       INV-0042     Jun 15        8,000 AED       │
  │  Baraka Corp    INV-0039     Jun 20        15,000 AED      │
  │  StartupX       INV-0045     Jun 28        5,500 AED       │
  │  TechBrand      INV-0041     Jul 05        12,000 AED      │
  │  ─────────────────────────────────────────────────────     │
  │  TOTAL EXPECTED RECEIVABLES:               40,500 AED      │
  └────────────────────────────────────────────────────────────┘

  📤 EXPECTED EXPENSES
  ┌────────────────────────────────────────────────────────────┐
  │  Description    Category     Due Date      Amount          │
  │  Freelancer     Outsourcing  Jun 16        3,500 AED       │
  │  Hosting - VPS  Hosting      Jun 25        800 AED         │
  │  Domain Renewal Domain       Jul 01        350 AED         │
  │  ─────────────────────────────────────────────────────     │
  │  TOTAL EXPECTED EXPENSES:                  4,650 AED       │
  └────────────────────────────────────────────────────────────┘

  ══════════════════════════════════════════════════════════════
  NET CASH FLOW (30 days):     +35,850 AED
  PROJECTED CLOSING BALANCE:    48,350 AED
  ══════════════════════════════════════════════════════════════

  ⚠️  Risk Items:
  • 2 invoices (12,500 AED) are already overdue — collection at risk
  • If unpaid: Projected balance drops to 35,850 AED
```

### 27.4 Forecast Periods

- **30 Days** — Most accurate, based on confirmed invoice due dates
- **60 Days** — Includes pipeline estimates (won leads with expected close dates)
- **90 Days** — Strategic view with lower confidence, includes recurring contracts

### 27.5 Conservative vs Optimistic View

Toggle between:
- **Conservative:** Only count receivables with >80% payment probability (no overdue history)
- **Realistic:** Count all expected receivables at face value
- **Optimistic:** Include pipeline deals expected to close

### 27.6 Weekly Snapshot in Dashboard

The executive dashboard shows a simplified cash flow widget:

```
CASH FLOW — NEXT 30 DAYS
Expected In:   40,500 AED   ↑
Expected Out:   4,650 AED   ↓
Net:           +35,850 AED  ✅
```

### 27.7 Database Support

Cash flow forecast is calculated dynamically from:
- `invoices` table (outstanding amounts + due dates)
- `expenses` table (future-dated expenses)
- `renewals` table (upcoming renewal costs)
- `payments` table (confirmed incoming payments)

No separate table required — pure calculation layer with Redis caching.

---

## Module 28: Company Assets

### 28.1 Purpose

Every company has infrastructure — domains, servers, software licenses, API subscriptions, and accounts — that are mission-critical but often untracked. Losing access to a client's domain credentials, missing an API key renewal, or not knowing who owns which account creates serious operational risk. This module is the single source of truth for all company and client-managed assets.

### 28.2 Asset Types

| Type | Examples |
|------|---------|
| **Domain** | madariktech.com, client-site.com |
| **Hosting / VPS** | Hetzner, DigitalOcean, AWS EC2 |
| **SSL Certificate** | Let's Encrypt, Comodo, Sectigo |
| **Email Service** | Google Workspace, Microsoft 365 |
| **Software License** | Adobe CC, JetBrains, Microsoft Office |
| **SaaS Tool** | Figma, Notion, Slack, GitHub, Postman |
| **API Subscription** | OpenAI, WhatsApp Business API, Twilio, Google Maps |
| **Cloud Service** | AWS S3, Cloudflare, Firebase |
| **Social Media Account** | Meta Business, Instagram, LinkedIn Page |
| **Ad Account** | Meta Ads, Google Ads |
| **Device / Hardware** | Laptops, servers, routers |
| **Other** | Any company-owned asset |

### 28.3 Asset Data Model

| Field | Type | Required |
|-------|------|----------|
| Asset Name | Text | Yes |
| Type | Enum | Yes |
| Client | Link | No (internal or client asset) |
| Project | Link | No |
| Provider / Vendor | Text | No |
| Account Email | Email | No |
| Username | Text | No |
| Password | Encrypted text | No |
| Notes / Credentials | Encrypted rich text | No |
| Monthly/Annual Cost | Currency | No |
| Purchase Date | Date | No |
| Renewal Date | Date | No |
| Owner / Managed By | User | No |
| Status | Enum | Auto |
| Tags | Multi-select | No |

**Status Enum:** Active / Expiring Soon / Expired / Cancelled / Transferred

### 28.4 Security: Credential Storage

Credentials (passwords, API keys, access tokens) must be stored securely:
- **Encryption:** AES-256 encryption on all credential fields
- **Access Control:** Only Owner and Super Admin can view decrypted credentials
- **Audit log:** Every credential view is logged (who viewed, when)
- **Never logged in plaintext** — no credential data in application logs

### 28.5 Asset Dashboard

```
COMPANY ASSETS OVERVIEW
──────────────────────────────────────────────────────────────────
  📦 Total Assets: 47        🔴 Expiring Soon: 5
  ─────────────────────────────────────────────

  EXPIRING SOON (within 30 days):
  ┌──────────────────────────────────────────────────────────┐
  │  Asset              Type       Expires      Cost         │
  │  madariktech.com    Domain     Jun 25       350 AED/yr   │
  │  OpenAI API         API        Jul 03       Usage-based  │
  │  client-pos.com     Domain     Jul 08       280 AED/yr   │
  │  SSL - baraka.com   SSL        Jul 10       0 (LE)       │
  │  JetBrains Suite    License    Jul 11       800 AED/yr   │
  └──────────────────────────────────────────────────────────┘

  ASSETS BY TYPE:
  Domains: 12    |  Hosting: 8   |  Software: 11
  APIs: 6        |  Accounts: 7  |  Other: 3
──────────────────────────────────────────────────────────────────
```

### 28.6 Integration with Renewals Module

When an asset has a renewal date, it is automatically linked to the Renewals module — no duplicate data entry. The asset record **is** the source of the renewal record.

### 28.7 Client Assets vs Internal Assets

**Internal Assets:** Owned and used by Madarik Tech (servers, tools, subscriptions)

**Client Assets:** Managed on behalf of clients (their domains, their hosting, their SSL)
- Linked to the client record
- Visible in client profile under "Assets" tab
- Used for billing renewal invoices to clients

### 28.8 Database Table: assets

```
id, tenant_id, name, type, client_id (FK nullable),
project_id (FK nullable), provider, account_email,
username (encrypted), password (encrypted),
notes (encrypted TEXT), monthly_cost, annual_cost, currency_id,
purchase_date, renewal_date, managed_by (FK users nullable),
status, tags (JSON), linked_renewal_id (FK renewals nullable),
created_by, created_at, updated_at, deleted_at
```

---

## Module 29: AI Assistant — Madarik AI

### 29.1 Reclassification: Core Feature (Not Phase 3)

> **The AI Assistant is reclassified from Phase 3 to Phase 1 MVP.** The cost of integrating Claude API at launch is minimal, and the productivity multiplier for a one-person or small-team operation is massive. This is not a luxury feature — it is a force multiplier that enables Madarik Tech to operate at the level of a team twice its size.

### 29.2 Purpose

The AI Assistant — branded as **"Madarik AI"** — is embedded throughout the platform. It understands the company's data, context, and needs. It is not a generic chatbot — it is a business-aware assistant that reads from the actual database to give relevant, actionable answers.

### 29.3 Access Point

A persistent **"✨ Ask Madarik AI"** button is visible at all times in the interface:
- Fixed in the top navigation bar
- Opens a slide-over panel (does not navigate away from current page)
- Maintains conversation history within the session
- Can reference the current page's context (e.g., when on a project page, AI knows which project)

### 29.4 Core Capabilities

#### Category 1: Business Intelligence Queries

Natural language queries against live business data:

| Query Example | AI Action |
|---------------|-----------|
| "Which clients have overdue invoices?" | Queries invoices → returns client list with amounts |
| "What's my most profitable project this year?" | Queries P&L → returns ranked project list |
| "Which leads have been inactive for 7 days?" | Queries CRM → returns stale lead list |
| "How much revenue did I collect this month?" | Queries payments → returns total with breakdown |
| "What projects are at risk of missing their deadline?" | Queries projects + tasks → returns risk assessment |
| "Show me all expenses over 1,000 AED this month" | Queries expenses → returns filtered list |
| "What's my conversion rate from Meta Ads?" | Queries lead source analytics → returns rate |

#### Category 2: Document Generation

AI generates professional business documents:

| Query Example | AI Action |
|---------------|-----------|
| "Create a quotation for a 5-page website for a restaurant" | Generates line items, suggested pricing, terms |
| "Draft a maintenance contract for POS Pixel Pro client Baraka Co" | Pulls client data + creates contract draft |
| "Write a project proposal for an e-commerce app, budget 25,000 AED" | Generates structured proposal content |
| "Create an NDA for a new client meeting" | Fills NDA template from Settings data |

**Workflow:** AI generates draft → user reviews in the relevant module → user saves/sends

#### Category 3: Communication Drafting

AI writes professional messages:

| Query Example | AI Action |
|---------------|-----------|
| "Write a follow-up WhatsApp message for Ahmed Co — they haven't replied in 5 days" | Drafts polite follow-up in Arabic/English |
| "Write a payment reminder for Invoice INV-2026-0042" | Pulls invoice data → professional reminder |
| "Draft an apology message to client Baraka for the project delay" | Empathetic, professional response |
| "Write a project update email for this week's progress" | Pulls task completions → structures email |

#### Category 4: Report Generation

AI compiles and writes reports:

| Query Example | AI Action |
|---------------|-----------|
| "Write a weekly progress report for Project X" | Pulls completed tasks → formats report |
| "Generate a monthly performance summary for June" | Aggregates all KPIs → narrative summary |
| "Write meeting minutes from these bullet points: [paste notes]" | Structures into formal meeting minutes |
| "Summarize the financial performance of client Ahmed Co" | Pulls all financials → executive summary |

#### Category 5: Strategic Analysis

AI provides business insights:

| Query Example | AI Action |
|---------------|-----------|
| "Why is Project X unprofitable?" | Analyzes revenue vs expenses vs time spent |
| "Which service generates the most profit margin?" | Cross-references P&L by project type |
| "What should my focus be this week?" | Reviews overdue tasks, urgent projects, follow-ups |
| "What are my top 3 business risks right now?" | Analyzes project health, cash flow, overdue items |
| "Which client should I prioritize for upsell?" | Identifies high-LTV clients with upcoming renewals |

### 29.5 Technical Architecture

**Model:** Claude API (`claude-sonnet-4-6` for speed, `claude-opus-4-8` for complex analysis)

**Implementation Pattern:**

```
User Input
    ↓
[Context Builder]
  - Current page context (project ID, client ID, etc.)
  - System prompt with company data summary
  - User role and permissions
    ↓
[Tool Definitions (Laravel functions callable by Claude)]
  - get_overdue_invoices()
  - get_project_financials(project_id)
  - get_lead_pipeline_summary()
  - get_cash_flow_forecast()
  - create_quotation_draft(params)
  - get_client_activity(client_id)
  - ...
    ↓
[Claude API Call with tools]
    ↓
[Tool execution in Laravel backend]
    ↓
[Claude synthesizes response]
    ↓
[Response displayed to user]
  - Text answer
  - Data tables
  - Action buttons (e.g., "Open this invoice", "Create this quotation")
```

**Data Access:** AI only accesses data the current user is permitted to see (RBAC enforced at tool level). Owner gets full data; employee gets their scope only.

**Language:** AI responds in the same language the user types (Arabic or English). Arabic responses use formal business Arabic (فصحى).

### 29.6 AI Panel UI Design

```
┌──────────────────────────────────────────────────────┐
│  ✨ Madarik AI                            [×] Close  │
├──────────────────────────────────────────────────────┤
│                                                      │
│  How can I help you today?                           │
│                                                      │
│  Quick Actions:                                      │
│  [📊 Business Summary]  [⚠️ Urgent Items]           │
│  [💰 Cash Status]       [📋 Draft Quotation]         │
│                                                      │
│  ─────────────────────────────────────────────────  │
│                                                      │
│  User: شو أخطر مشروع عندي هلق؟                      │
│                                                      │
│  🤖 بناءً على البيانات الحالية:                      │
│                                                      │
│  🔴 مشروع: نظام ERP - شركة النخيل                   │
│     Health Score: 28/100 (Critical)                 │
│     المشكلة: تجاوز الميزانية 35%، متأخر 12 يوم      │
│     فواتير غير مدفوعة: 18,000 AED                   │
│                                                      │
│     [📂 فتح المشروع]  [📊 تقرير كامل]               │
│                                                      │
│  ─────────────────────────────────────────────────  │
│  [اكتب سؤالك هنا...                    ] [إرسال ↑]  │
└──────────────────────────────────────────────────────┘
```

### 29.7 Quick Action Prompts

Pre-built buttons for most common AI tasks:

| Button | Pre-filled Prompt |
|--------|------------------|
| 📊 Business Summary | "Give me a complete business summary for today" |
| ⚠️ Urgent Items | "What are the most urgent items requiring my attention right now?" |
| 💰 Cash Status | "What is my current cash position and 30-day forecast?" |
| 📋 Draft Quotation | Opens quotation form pre-filled via AI conversation |
| 🔄 Follow-ups | "Which clients need a follow-up today?" |
| 📈 Pipeline Status | "Summarize my sales pipeline" |

### 29.8 AI Usage Limits & Cost Management

**Per-request cost management:**
- Simple queries (data lookup): ~$0.001–0.003 per request
- Document generation: ~$0.01–0.05 per request
- No limit for MVP (internal use only)
- When commercialized: token limits per pricing plan

**Rate limiting:** 30 AI requests per user per hour (prevents abuse)

**Caching:** Identical or near-identical queries within 10 minutes return cached response

### 29.9 AI Memory & Context

The AI maintains context within a session (conversation history preserved in panel). Cross-session memory of key business facts is provided through a **system prompt** that includes:
- Company name and type
- Current period (month, year)
- High-level metrics summary (refreshed every 15 minutes from cache)

### 29.10 Database Table: ai_conversations

```
id, tenant_id, user_id (FK), session_id,
messages (JSON — array of {role, content, tool_calls}),
tokens_used_input, tokens_used_output,
model_used, created_at, updated_at
```

---

## Updated: Additional Functional Requirements

The following functional requirements are added to Section 5 (FR-031 through FR-040):

| ID | Requirement | Priority | Module |
|----|-------------|----------|--------|
| FR-031 | System must manage meetings with full minute-taking and PDF generation | Critical | Meetings |
| FR-032 | System must track lead sources with revenue attribution analytics | Critical | Lead Source Analytics |
| FR-033 | System must maintain a HubSpot-style communication timeline per client | Critical | Communication Timeline |
| FR-034 | System must track project deliverables with client approval workflow | Critical | Deliverables |
| FR-035 | System must manage support tickets with SLA tracking post-delivery | High | Support Tickets |
| FR-036 | System must track all renewals (domains, hosting, licenses) with auto-reminders | Critical | Renewals |
| FR-037 | System must support goal setting with real-time progress tracking | High | Goals & KPIs |
| FR-038 | System must provide 30/60/90-day cash flow forecasting | Critical | Cash Flow |
| FR-039 | System must manage company and client assets with encrypted credentials | High | Assets |
| FR-040 | System must include an embedded AI assistant with business data access | Critical | AI Assistant |

---

## Updated: MVP Scope Revision (Phase 1 — Revised)

The following modules are **upgraded to Phase 1 MVP** based on their business criticality:

| Module | Previous Phase | New Phase | Reason |
|--------|---------------|-----------|--------|
| Meetings | Phase 2 (implied) | **Phase 1** | Critical for client documentation |
| Lead Source Analytics | Phase 2 | **Phase 1** | Core to sales decision-making |
| Client Communication Timeline | Phase 2 | **Phase 1** | Fundamental CRM requirement |
| Deliverables Tracking | Phase 2 | **Phase 1** | Directly tied to client payments |
| Renewals Management | Phase 3 | **Phase 1** | Risk prevention, revenue protection |
| Cash Flow Forecast | Phase 2 | **Phase 1** | Existential financial requirement |
| AI Assistant | Phase 3 | **Phase 1** | Productivity multiplier for small team |
| Goals & KPIs | Phase 2 | **Phase 1** | Owner needs from day one |
| Company Assets | Phase 3 | **Phase 2** | Important but deferrable |
| Support Tickets | Phase 2 | **Phase 2** | Needed when SaaS products launch |

---

## Updated: Database Additions (New Tables)

### meetings
```
id, tenant_id, meeting_number, title, type, client_id, project_id,
date, start_time, end_time, location,
internal_attendees (JSON), external_attendees (JSON),
agenda (TEXT), notes (LONGTEXT), decisions (TEXT),
next_meeting_date, status, pdf_path, sent_via, sent_at,
created_by, created_at, updated_at, deleted_at
```

### meeting_action_items
```
id, meeting_id, task_id (nullable), description,
assigned_to_user_id (nullable), assigned_to_name,
due_date, priority, status, created_at, updated_at
```

### marketing_spend
```
id, tenant_id, source, month, year, amount, currency_id,
campaign_name, notes, created_by, created_at
```

### client_communications
```
id, tenant_id, client_id, event_type, channel, subject,
body (TEXT), direction, related_type, related_id,
performed_by, performed_at, metadata (JSON), created_at
```

### deliverables
```
id, tenant_id, project_id, name, description, category,
assigned_to (nullable), due_date, status,
client_approval_required, client_approval_status,
client_approved_by, client_approved_at, client_rejection_note,
sort_order, created_by, created_at, updated_at, deleted_at
```

### support_tickets
```
id, tenant_id, ticket_number, title, description (TEXT),
client_id, project_id (nullable), product_id (nullable),
priority, category, status, assigned_to (nullable),
sla_due_at, first_response_at, resolved_at, resolution_notes,
created_via, created_by_user_id, created_by_client_id,
created_at, updated_at, deleted_at
```

### ticket_comments
```
id, ticket_id, author_type, author_id, body (TEXT),
is_internal, attachments (JSON), created_at, updated_at
```

### renewals
```
id, tenant_id, name, type, client_id (nullable),
project_id (nullable), vendor, cost, currency_id,
start_date, renewal_date, billing_cycle, auto_renews,
reminder_days (JSON), assigned_to, notes, status,
renewed_on, created_by, created_at, updated_at, deleted_at
```

### goals
```
id, tenant_id, title, type, target_value, unit,
period_type, period_start, period_end,
assigned_to (nullable), description, status,
created_by, created_at, updated_at
```

### assets
```
id, tenant_id, name, type, client_id (nullable),
project_id (nullable), provider, account_email,
username (encrypted), password (encrypted),
notes (encrypted TEXT), monthly_cost, annual_cost, currency_id,
purchase_date, renewal_date, managed_by (nullable),
status, tags (JSON), linked_renewal_id (nullable),
created_by, created_at, updated_at, deleted_at
```

### ai_conversations
```
id, tenant_id, user_id, session_id,
messages (JSON), tokens_used_input, tokens_used_output,
model_used, created_at, updated_at
```

---

## Updated: Complete Module List

The platform now includes **29 modules** (original 19 + 10 new):

| # | Module | Phase |
|---|--------|-------|
| 1 | Dashboard | MVP |
| 2 | CRM Sales Pipeline | MVP |
| 3 | Clients | MVP |
| 4 | Quotations | MVP |
| 5 | Projects | MVP |
| 6 | Contracts | MVP |
| 7 | Invoices | MVP |
| 8 | Expenses | MVP |
| 9 | Profit & Loss | MVP |
| 10 | Tasks | MVP |
| 11 | Daily Reports | MVP |
| 12 | Products & Services | MVP |
| 13 | Opportunities | MVP |
| 14 | Reminders | MVP |
| 15 | Knowledge Base | Phase 2 |
| 16 | Calendar | Phase 2 |
| 17 | Team Management | MVP |
| 18 | Settings | MVP |
| 19 | Notification Center | MVP |
| **20** | **Meetings** | **MVP** |
| **21** | **Lead Source Analytics** | **MVP** |
| **22** | **Client Communication Timeline** | **MVP** |
| **23** | **Deliverables Tracking** | **MVP** |
| **24** | **Support Tickets** | **Phase 2** |
| **25** | **Renewals Management** | **MVP** |
| **26** | **Goals & KPIs** | **MVP** |
| **27** | **Cash Flow Forecast** | **MVP** |
| **28** | **Company Assets** | **Phase 2** |
| **29** | **AI Assistant (Madarik AI)** | **MVP** |

---

*Addendum End — Document Version 1.1*

---

**Document Information**

| Field | Value |
|-------|-------|
| Version | 1.1 |
| Status | Ready for Development Review |
| Original Version | 1.0 — June 13, 2026 |
| Addendum Date | June 13, 2026 |
| Total Modules | 29 |
| Total Database Tables | 40+ |
| Tech Stack | React (Vite + TypeScript) · Laravel 11 · MySQL 8.0 · Redis · Claude API |

---

*بسم الله، وعلى بركة الله — نبدأ*
