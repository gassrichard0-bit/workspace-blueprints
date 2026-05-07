# Business Operating System Spec

## Objective

Define a buildable first release of the platform that helps run the business day to day.

## Primary User

The first release is optimized for the owner or operator of a small service business.

Secondary internal users may include:

- sales or intake support
- operations manager
- delivery lead

The first release is internal-first, not client-first.

## Core Modules

### 1. Lead Intake

- capture inbound lead details
- assign status
- add notes and source

### 2. Pipeline

- move leads through clear stages
- show owner next actions
- track expected value and follow-up date

### 3. Client Workspace

- convert won deals into client records
- show onboarding status
- track active services or deliverables

### 4. Delivery Tracker

- represent active projects or service work
- show current stage, owner, blockers, and deadlines

### 5. Owner Dashboard

- leads awaiting follow-up
- deals at risk
- active clients
- overdue delivery items
- near-term revenue picture

## Core Workflows

### Lead Management

- create lead
- update lead details
- add notes
- set next follow-up
- assign and change stage

### Deal Progression

- move opportunity across stages
- capture expected value
- flag stalled deals

### Client Activation

- convert won opportunity into client
- start onboarding checklist
- assign ownership

### Service Delivery Tracking

- create engagement or delivery record
- track milestones and current status
- flag blockers and overdue items

### Owner Review

- surface urgent work on dashboard
- show near-term pipeline and delivery health

## Data Requirements

The first release should support these core records:

- lead
- opportunity
- client
- onboarding item
- engagement
- delivery item
- note
- user

## Acceptance Criteria

- a lead can be created and updated
- a lead can move through pipeline stages
- a won lead can become a client
- a client can have onboarding and delivery statuses
- the dashboard surfaces urgent items without digging
- users can identify overdue follow-ups quickly
- users can see which delivery items are blocked or late
- the owner can review the state of the business from one screen

## Non-Goals

- complete accounting
- enterprise-grade permissions
- large automation marketplace
- public self-serve customer portal
- highly customized workflow builder

## UX Direction

- fast internal workflow first
- clean administrative interface
- minimal clicks for frequent actions
- strong visibility of status, owner, due date, and next action

## Risks

- trying to support too many business models too early
- overbuilding automation before the basic workflow is stable
- designing a beautiful shell without solving daily operating pain

## Open Product Questions

- should the MVP start as single-user with future multi-user support?
- what pipeline stages match the real business best?
- what is the minimal delivery tracker that still creates visibility?
- does the first dashboard need revenue totals or only operational signals?

## Suggested Build Sequence

1. data model for leads, clients, opportunities, delivery items
2. admin dashboard shell
3. lead intake and pipeline views
4. client onboarding flow
5. delivery tracking view
6. reporting and dashboard refinement
