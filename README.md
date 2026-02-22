# Notes Sphere

![Notes Sphere Hero Image](New%20folder/landing%20page.png)

Notes Sphere is a full-stack web application designed for students, professionals, and anyone who wants to upload, securely store, and easily access their notes and documents on the go. 

With a robust Python Flask back-end operating alongside a seamless Angular 20 (Node.js) front-end, Notes Sphere provides a fast, interactive user experience to manage `.pdf`, `.docx`, and `.txt` files effortlessly.

---

## 📸 Application Screenshots

### 1. User Authentication (Login / Signup)
![Signup & Login Screen](New%20folder/Login%20page.png)
*Secure session-based authentication protecting user data.*

### 2. Dashboard & Notes Overview
![Dashboard](New%20folder/Dashboardpage.png)
*View all uploaded documents in an organized layout.*

### 3. Uploading a New Note
![Upload Screen](New%20folder/Upload%20successgully.png)
*Select and upload critical study materials or documents.*

### 4. Notes Dashboard
![Notes Dashboard](New%20folder/notesDashboard.png)
*Access and manage all your notes in one place.*

---

## 🌟 Key Features

- **User Authentication:** 
  - Seamless Sign Up, Login, and Logout functionality.
  - Session-based user tracking prevents unauthorized access.
- **Note Management:** 
  - Securely **Upload** study materials (`.pdf`, `.docx`, `.txt`).
  - **View** and access your uploaded documents instantly.
  - **Delete** outdated files when they're no longer needed.
- **RESTful Architecture:** 
  - Clear separation of backend APIs and frontend consumption.
  - Configured with `flask-cors` for secure and authorized cross-origin resource sharing.
- **Database-Backed Integrity:** 
  - Fully integrated with MySQL for users and notes data storage.

---

## 🛠️ Technology Stack

**Frontend:**
- **Angular 20:** Building interactive and performant Single Page Applications (SPAs).
- **TypeScript & HTML/CSS:** Scalable typing and responsive design.

**Backend:**
- **Python Flask:** Lightweight and extensible backend web framework.
- **MySQL Database:** Relational database management for storing users and notes information.
- **Werkzeug:** Utility for handling secure file uploading via HTTP forms. 

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites
- [Node.js & npm](https://nodejs.org/en/download/)
- [Angular CLI](https://angular.io/cli)
- [Python 3.x](https://www.python.org/downloads/)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/)

### 1. Database Configuration
1. Start your local MySQL server.
2. Create a database called `notes_app`.
3. Inside your database, make sure to execute the SQL needed to create the `users` and `notes` tables. 
4. Check `Backend/app.py` line `27-32` and update the `user` and `password` inside `mysql.connector.connect()` with your local MySQL credentials:
   ```python
   # Example:
   user="notes_user",
   password="your_password"
   ```

### 2. Backend Setup
1. Navigate to the Backend folder:
   ```bash
   cd Backend
   ```
2. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the Flask Server:
   ```bash
   python app.py
   ```
   *The backend will be running on `http://127.0.0.1:5000`.*

### 3. Frontend Setup
1. Open a new terminal and navigate to the Frontend directory:
   ```bash
   cd Frontend/Notes-Sphere
   ```
2. Install Angular project dependencies:
   ```bash
   npm install
   ```
3. Start the Angular Development Server:
   ```bash
   npx ng serve
   ```
   *The frontend will be running on `http://localhost:4200/`.*

### 4. Open Application
Navigate to `http://localhost:4200` in your web browser. You can now register a user account, upload your documents, and manage your Notes Sphere!

---

## 🤝 Contributing
Contributions are always welcome. Feel free to open a pull request or submit issues to improve the application!

## 📜 License
This project is open-source and available under the MIT License.
