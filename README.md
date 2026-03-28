# 📡 API Monitoring System(apilens)

> Production-grade API monitoring built with Node.js, RabbitMQ, MongoDB, and PostgreSQL — event-driven architecture for high-throughput ingestion and async processing.

---

## 🧭 Overview

A robust, scalable API monitoring platform designed for multi-tenant environments. The system ingests API events in real time, processes them asynchronously via a message queue, and persists data across a dual-database layer optimized for both raw event storage and structured analytics.

---

## 🏗️ Architecture

```
                        ┌─────────────────────┐
                        │   API Ingestion Layer│
                        │  (Multi-Tenant REST) │
                        └────────┬────────────┘
                                 │
                                 ▼
                        ┌─────────────────────┐
                        │      RabbitMQ        │
                        │  (Message Broker)    │
                        │  + DLQ / Retry Logic │
                        └────────┬────────────┘
                                 │
                   ┌─────────────┴─────────────┐
                   ▼                           ▼
          ┌──────────────┐           ┌──────────────────┐
          │   MongoDB     │           │   PostgreSQL      │
          │  (Raw Events) │           │   (Analytics DB)  │
          └──────────────┘           └──────────────────┘
                   ▲                           ▲
                   └─────────────┬─────────────┘
                                 │
                        ┌────────┴────────┐
                        │ Background       │
                        │ Workers          │
                        └─────────────────┘
```

---

## ✨ Features

- **Event-Driven Architecture** — Decoupled ingestion and processing via RabbitMQ for high throughput and resilience
- **Dual-Database Design** — MongoDB stores raw events at scale; PostgreSQL powers structured analytics queries
- **Multi-Tenant API Ingestion** — Isolated ingestion pipelines per tenant with per-tenant routing and storage
- **Background Workers** — Async processors consume queue messages, transform data, and write to both databases
- **Dead Letter Queue (DLQ)** — Failed messages are routed to a DLQ with automatic retry logic and configurable backoff
- **Docker Deployment** — Fully containerized stack for consistent local development and production deployment

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Message Broker | RabbitMQ |
| Raw Event Store | MongoDB |
| Analytics Store | PostgreSQL |
| Containerization | Docker / Docker Compose |

---

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- Node.js v18+

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/api-monitoring-system.git
cd api-monitoring-system

# Copy environment config
cp .env.example .env

# Start all services
docker-compose up --build
```

The following services will start:

| Service | Port |
|---|---|
| API Server | `3000` |
| RabbitMQ Management UI | `15672` |
| MongoDB | `27017` |
| PostgreSQL | `5432` |

---

## ⚙️ Configuration

Edit `.env` to configure the system:

```env
# App
PORT=3000
NODE_ENV=development

# RabbitMQ
RABBITMQ_URL=amqp://localhost:5672
RABBITMQ_QUEUE=api_events
RABBITMQ_DLQ=api_events_dlq
RETRY_LIMIT=3

# MongoDB
MONGO_URI=mongodb://localhost:27017/api_monitoring

# PostgreSQL
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=api_analytics
POSTGRES_USER=postgres
POSTGRES_PASSWORD=secret
```

---

## 📨 API Usage

### Ingest an Event

```http
POST /api/v1/events
X-Tenant-ID: tenant_abc
Content-Type: application/json

{
  "endpoint": "/api/products",
  "method": "GET",
  "status_code": 200,
  "response_time_ms": 142,
  "timestamp": "2025-03-17T10:00:00Z"
}
```

### Query Analytics

```http
GET /api/v1/analytics?tenant=tenant_abc&from=2025-03-01&to=2025-03-17
```

---

## 🔄 Event Flow

1. **Ingestion** — A tenant sends an API event via the REST endpoint.
2. **Publishing** — The server validates the payload and publishes it to RabbitMQ.
3. **Processing** — Background workers consume the message and fan out writes:
   - Raw event → **MongoDB**
   - Aggregated record → **PostgreSQL**
4. **Retry / DLQ** — On processing failure, the message is requeued up to `RETRY_LIMIT` times, then routed to the Dead Letter Queue for inspection.

---

## 🗃️ Database Design

### MongoDB — Raw Events

Stores every ingested event as-is for auditing, replay, and ad-hoc querying.

```json
{
  "_id": "ObjectId",
  "tenant_id": "tenant_abc",
  "endpoint": "/api/products",
  "method": "GET",
  "status_code": 200,
  "response_time_ms": 142,
  "timestamp": "2025-03-17T10:00:00Z",
  "raw_payload": {}
}
```

### PostgreSQL — Analytics

Stores normalized, aggregated records optimized for time-series queries and dashboards.

```sql
CREATE TABLE api_events (
  id          SERIAL PRIMARY KEY,
  tenant_id   TEXT NOT NULL,
  endpoint    TEXT,
  method      TEXT,
  status_code INT,
  response_ms INT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🐳 Docker Services

```yaml
services:
  api:        # Node.js API server
  worker:     # Background queue consumer
  rabbitmq:   # Message broker + management UI
  mongodb:    # Raw event store
  postgres:   # Analytics database
```

---

## 📁 Project Structure

```
├── src/
│   ├── api/            # Express routes and controllers
│   ├── workers/        # RabbitMQ consumer workers
│   ├── queues/         # Publisher and queue configuration
│   ├── db/
│   │   ├── mongo/      # MongoDB models and connection
│   │   └── postgres/   # PostgreSQL schema and queries
│   └── config/         # Environment and service config
├── docker-compose.yml
├── Dockerfile
├── .env.example
└── README.md
```

---

## 📄 License

[MIT](LICENSE)
