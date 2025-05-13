# 📁 File Manager Web App  
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue?style=for-the-badge&logo=postgresql)  
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)  
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)  
![Prisma](https://img.shields.io/badge/Prisma-ORM-blueviolet?style=for-the-badge&logo=prisma)  
![image](https://github.com/user-attachments/assets/592639c5-5aca-488e-9f3c-e92204faa23c)
![screenRec](https://github.com/user-attachments/assets/1a670f78-9c40-41c7-866d-a16b960342f7)
![image](https://github.com/user-attachments/assets/b6c3b4f7-f5f6-404a-8bb5-701d21138b67)


---

## 📜 Project Overview

This full-stack file management app was built as part of my learning journey with **The Odin Project** and beyond.
The main intention with this project was to get familiar with an ORM, like Prisma in this case.

It allows authenticated users to:

- Register, log in, and manage sessions
- Create folders and upload files
- Browse their files in a structured layout
- Store everything securely in a PostgreSQL database
- Stay protected with CORS, Helmet, and rate limiting
- Responsive UI with easy, homemade, dropdown navigation menu in mobile mode

---

## 🌍 Deployment

The app is deployed with front and backend together as a web-service on Render. PostgreSQL database is also hosted with Render.

🔗 **Live Demo**: <a href="https://file-uploader-6ipm.onrender.com/">Click Here</a>  

🔧 **Backend**: Express API with PostgreSQL and Prisma  
🎨 **Frontend**: Initial page is served with EJS, rest is vanilla JS with custom server side smooth navigation

---

## 🌟 Features

- ✅ **User Authentication**  
  Login/register flow using Passport.js and secure sessions

- 🧊 **Prisma ORM**  
  Modern and type-safe interaction with PostgreSQL

- 📁 **Folder & File Management**  
  Users can create folders and upload files (with limits). Files are uploaded to Cloudinary and can be downloaded by clicking a download button by the created file.

- 🔒 **Security Middleware**  
  Helmet.js to set HTTP headers  
  CORS to restrict allowed origins  
  Rate limiting to protect endpoints

- 🧠 **Custom Error Handling**  
  Structured API error responses with status codes and messages

- ☁️ **Environment-Aware**  
  Automatically adjusts settings (e.g., cookie security) based on `NODE_ENV`

- 🌓 **Light/Dark-mode**  
  Easy toggling between light and dark mode with local storage of last used mode

---

## 🧱 Tech Stack

- **Node.js** + **Express** — Web server and routing
- **PostgreSQL** — Relational database for users, folders, and files
- **Prisma** — ORM for easy and type-safe DB interaction
- **Passport.js** — Local strategy for authentication
- **express-session** — Session management
- **Helmet.js** — Security headers
- **express-rate-limit** — Rate limiting
- **CORS** — Cross-Origin Resource Sharing configuration
- **dotenv** — Manage environment variables

---

## 🎨 Planning & Design

- 🎨 **Figma**: Used Figma to design the user interface, focusing on simplicity and clarity for both desktop and mobile users
- 🗂️ **Eraser.io**: Created an ERD (Entity Relationship Diagram) to visualize and plan the database structure, ensuring a clear one-to-many relationship between users and messages  
![image](https://github.com/user-attachments/assets/ae2f0231-f8c2-443d-9cd7-804256c17263)
![image](https://github.com/user-attachments/assets/77ecd447-7f19-4bfc-9c24-56ed3bfc0f4d)
![image](https://github.com/user-attachments/assets/5989ae83-fd16-4659-9b1b-b1c212e0a1df)

---

## 🙏 Thank You!

Thanks for checking out my **File Uploader App**!  
I built this to better understand the use of Prisma.
Feel free to reach out if you have questions or feedback! 

---

