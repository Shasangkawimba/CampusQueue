# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
[INFERRED FROM PRD] Mahasiswa (Students) who need to queue for campus administration services (prodi, TU, clinic) without installing an app. Petugas (Staff) who manage the queues at their specific counters.

## Product Purpose
[INFERRED FROM PRD] Antrian Digital is a real-time queueing system for campus services. It eliminates physical waiting and queue-jumping by providing real-time updates and wait time estimations via web, while serving as a technical showcase for concurrent database operations and WebSockets.

## Positioning
[INFERRED FROM PRD] A web-based queue system that requires no app installation, guaranteeing atomic ticket numbering and real-time updates without polling, specifically tailored for multi-counter campus environments.

## Operating Context
[INFERRED FROM PRD]
- Students use mobile browsers to take and monitor tickets while anywhere on campus.
- Staff use desktop dashboards at their service counters to call the next ticket.
- Real-time updates (WebSocket) are critical as students are not physically waiting in line.

## Capabilities and Constraints
[INFERRED FROM PRD]
- Guest access for ticket taking (no login).
- Real-time broadcast of queue status per counter (Socket.io).
- Strict atomic numbering per counter per day (PostgreSQL `ON CONFLICT DO UPDATE`).
- Strict atomic call-next operations (PostgreSQL `FOR UPDATE SKIP LOCKED`).
- Automatic daily counter reset.
- Wait time estimation based on moving averages.
- Built on PERN stack without heavy ORMs.

## Brand Commitments
[INFERRED FROM PRD] Name: "Antrian Digital". Clean, simple, and functional campus utility.

## Evidence on Hand
[INFERRED FROM PRD] No specific real-world images or testimonials yet, as this is a new project built for learning and campus implementation.

## Product Principles
[INFERRED FROM PRD]
1. Real-time truth over stale data (no polling).
2. Correctness over convenience (strict atomic SQL operations).
3. Frictionless access (no apps or logins for students).
4. Independent operations (each counter runs its own isolated queue).

## Accessibility & Inclusion
[INFERRED FROM PRD] Must be usable on mobile devices by students in varied lighting conditions (campus environments).
