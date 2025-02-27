# Backend Microservice with Pub/Sub Architecture

This project demonstrates a microservice-based system using the **Pub/Sub** architecture with **Node.js** and **PostgreSQL**. It consists of two main services:

- **Receiver Service**: Accepts user data, validates it, stores it in the database, and publishes an event.
- **Listener Service**: Listens to the events, processes them, and stores the data in a second table with an updated timestamp.

## Technologies Used

- **Node.js**: Backend runtime
- **Express.js**: Web framework
- **PostgreSQL**: Database
- **Redis / AWS SQS**: Pub/Sub system
- **Docker**: Containerization
- **Sequelize**: ORM
- **Joi**: Input validation

## Features

### **Receiver Service**
- Accepts POST requests at `/receiver`
- Validates incoming JSON payload
- Saves data in PostgreSQL
- Publishes an event to Redis or AWS SQS

### **Listener Service**
- Listens for events from the queue
- Processes the data and stores it in another table
- Updates `modified_at` timestamp

## Setup Instructions

### **1. Clone the Repository**
```bash
git clone https://github.com/shubhamabad/event-listner
cd backend-assignment
```

### **2. Setup Environment Variables**
Create `.env` files in both services with:

#### Receiver Service (`receiver-service/.env`)
```ini
DB_URL=postgres://username:password@localhost:5432/database_name
REDIS_URL=redis://localhost:6379
USE_SQS=false
```

#### Listener Service (`listener-service/.env`)
```ini
DB_URL=postgres://username:password@localhost:5432/database_name
REDIS_URL=redis://localhost:6379
USE_SQS=false
SQS_URL=https://sqs.us-east-1.amazonaws.com/your-account-id/queue-name
```

### **3. Install Dependencies**
For both services, run:
```bash
npm install
```

### **4. Run Services Locally**
Start the **Receiver Service**:
```bash
npm run dev
```
Start the **Listener Service**:
```bash
npm run dev
```

### **5. Docker Setup**
To run services in Docker containers:
```bash
docker build -t receiver-service ./receiver-service
docker build -t listener-service ./listener-service
docker run -p 3000:3000 receiver-service
docker run -p 4000:4000 listener-service
```

## Testing the Application
Send a POST request to `/receiver` with:
```json
{
  "user": "Harry",
  "class": "Comics",
  "age": 22,
  "email": "harry@potter.com"
}
```
Example using `curl`:
```bash
curl -X POST http://localhost:3000/receiver \
  -H "Content-Type: application/json" \
  -d '{"user": "Harry", "class": "Comics", "age": 22, "email": "harry@potter.com"}'
```

## Database Schema

### **User Table**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  user VARCHAR(100),
  class VARCHAR(100),
  age INT,
  email VARCHAR(100) UNIQUE,
  inserted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

### **User History Table**
```sql
CREATE TABLE user_histories (
  id UUID PRIMARY KEY,
  user VARCHAR(100),
  class VARCHAR(100),
  age INT,
  email VARCHAR(100) UNIQUE,
  inserted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  modified_at TIMESTAMPTZ
);
```

## Scaling & Deployment
- Deploy using Kubernetes for horizontal scaling
- Use AWS RDS for database management
- Implement monitoring with AWS CloudWatch or Prometheus

## Contributing
Feel free to submit issues or pull requests.

## License
This project is licensed under the MIT License.

