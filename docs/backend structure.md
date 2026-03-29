# **HealthProvida – Backend Technical Document**

---

# **1. TECH STACK**

## **Core Technologies**

### **Frontend: React**

* **Why**

  * Component-based architecture for scalable UI
  * Strong ecosystem and community
  * Works well with REST APIs
* **Key Libraries**

  * `axios` – API calls
  * `react-router-dom` – routing
  * `react-query` / `tanstack-query` – server state management

---

### **Backend: Node.js + Express**

* **Why**

  * Fast, non-blocking I/O (ideal for high concurrent bookings)
  * Large ecosystem
  * Easy integration with frontend (JavaScript across stack)
* **Key Libraries**

  * `express` – web framework
  * `mongoose` – MongoDB ODM
  * `jsonwebtoken (JWT)` – authentication
  * `bcryptjs` – password hashing
  * `dotenv` – environment config
  * `cors` – cross-origin requests
  * `joi` or `zod` – request validation
  * `multer` – file upload handling

---

### **Database: MongoDB**

* **Why**

  * Flexible schema for evolving healthcare data
  * Good for rapid development
  * Native JSON structure aligns with APIs

---

## **Supporting Tools**

### **Cloud & Infrastructure**

* **Hosting**

  * Backend: Render / AWS EC2 / Railway
  * Frontend: Vercel / Netlify
* **Database Hosting**

  * MongoDB Atlas (managed, scalable)

### **File Storage (Images)**

* **Cloudinary (Recommended)**

  * Easy upload + transformation + CDN
* Alternative: AWS S3

---

## **Other Tools**

* **Postman / Insomnia** – API testing
* **Docker (optional)** – containerization
* **NGINX (optional)** – reverse proxy
* **BullMQ + Redis (future)** – background jobs (notifications, reminders)

---

# **2. BACKEND STRUCTURE**

---

## **A. System Architecture Overview**

### **High-Level Flow**

```
React Frontend → Express API → MongoDB
                          → Cloud Storage (Images)
```

### **Communication Model**

* RESTful API over HTTP
* JSON request/response format

### **Flow Example**

1. User searches hospitals → React sends GET request
2. Backend queries MongoDB
3. Backend returns structured JSON
4. Frontend renders results

---

## **B. Database Schema (MongoDB)**

---

### **1. Users Collection**

```js
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String,
  role: "patient" | "doctor" | "admin",
  phone: String,
  hospitalId: ObjectId, // for doctors
  createdAt: Date
}
```

---

### **2. Hospitals Collection**

```js
{
  _id: ObjectId,
  name: String,
  address: String,
  location: {
    lat: Number,
    lng: Number
  },
  departments: [ObjectId],
  description: String,
  images: [ObjectId],
  createdAt: Date
}
```

---

### **3. Departments (Specialties)**

```js
{
  _id: ObjectId,
  name: String, // e.g. Cardiology
  description: String
}
```

---

### **4. Appointments Collection**

```js
{
  _id: ObjectId,
  patientId: ObjectId,
  doctorId: ObjectId,
  hospitalId: ObjectId,
  departmentId: ObjectId,
  startTime: Date,
  endTime: Date,
  status: "booked" | "cancelled" | "completed",
  createdAt: Date
}
```

---

### **5. Availability / Schedules**

```js
{
  _id: ObjectId,
  doctorId: ObjectId,
  hospitalId: ObjectId,
  dayOfWeek: Number, // 0-6
  slots: [
    {
      startTime: String, // "09:00"
      endTime: String,   // "17:00"
      slotDuration: Number, // minutes
      bufferTime: Number // minutes
    }
  ]
}
```

---

### **6. Image Assets**

```js
{
  _id: ObjectId,
  hospitalId: ObjectId,
  url: String,
  category: "reception" | "consulting_room" | "ward" | "lab" | "icu" | "other",
  tags: [String], // ["modern", "clean", "child-friendly"]
  uploadedAt: Date
}
```

---

### **Relationships Summary**

* User (doctor) → Hospital (many-to-one)
* Hospital → Departments (many-to-many)
* Hospital → Images (one-to-many)
* Appointment → Patient + Doctor + Hospital
* Schedule → Doctor

---

## **C. API Design (RESTful)**

---

## **1. Authentication**

### **Signup**

* **POST** `/api/auth/signup`
* **Purpose**: Register user

**Request**

```json
{
  "name": "John Doe",
  "email": "john@mail.com",
  "password": "123456",
  "role": "patient"
}
```

**Response**

```json
{
  "token": "jwt_token",
  "user": { "id": "...", "role": "patient" }
}
```

---

### **Login**

* **POST** `/api/auth/login`

---

## **2. Hospitals**

### **Get All Hospitals**

* **GET** `/api/hospitals`

### **Get Single Hospital**

* **GET** `/api/hospitals/:id`

### **Create Hospital (Admin)**

* **POST** `/api/hospitals`

---

## **3. Appointments**

### **Book Appointment**

* **POST** `/api/appointments`

**Request**

```json
{
  "doctorId": "...",
  "hospitalId": "...",
  "startTime": "2026-04-01T10:00:00Z"
}
```

---

### **Get User Appointments**

* **GET** `/api/appointments/me`

---

### **Cancel Appointment**

* **PATCH** `/api/appointments/:id/cancel`

---

## **4. Doctor Availability**

### **Set Availability**

* **POST** `/api/availability`

### **Get Available Slots**

* **GET** `/api/availability/:doctorId`

---

## **5. Image Upload**

### **Upload Image**

* **POST** `/api/images/upload`
* Uses `multer` + Cloudinary

---

## **D. Appointment Scheduling Logic**

---

### **1. Prevent Double Booking**

* Query appointments:

```js
find({
  doctorId,
  startTime: { $lt: requestedEnd },
  endTime: { $gt: requestedStart }
})
```

* If result exists → reject booking

---

### **2. Handle Variable Durations**

* Each appointment type defines duration:

```js
{
  consultation: 20,
  procedure: 45
}
```

* End time calculated dynamically:

```js
endTime = startTime + duration
```

---

### **3. Slot Matching Logic**

1. Fetch doctor schedule
2. Generate slots from availability
3. Remove:

   * Booked slots
   * Buffer overlaps
4. Return available slots

---

### **4. Slot Generation Example**

```js
for (let time = start; time < end; time += duration + buffer) {
  slots.push(time);
}
```

---

## **E. Image Handling System**

---

### **1. Upload Flow**

1. Frontend sends image via form-data
2. Backend receives via `multer`
3. Upload to Cloudinary
4. Save metadata in MongoDB

---

### **2. Storage Approach**

* **Cloudinary**

  * CDN delivery
  * Automatic compression
  * URL-based transformations

---

### **3. Image Categories (Required)**

* Reception
* Consulting Room
* Private Ward
* Laboratory
* ICU / Special Units

---

### **4. Metadata Tagging System**

**Example**

```js
{
  category: "icu",
  tags: ["modern", "well-equipped", "clean"]
}
```

---

### **5. Retrieval**

* Filter images by:

  * category
  * tags

```js
GET /api/images?category=icu&tag=modern
```

---

# **FINAL NOTES**

This backend structure is:

* **Modular** → easy to extend
* **Scalable** → supports growth across regions
* **Practical** → optimized for rapid development

It provides a solid foundation for building HealthProvida quickly while leaving room for advanced features like AI scheduling and analytics.
