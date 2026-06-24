# Madarik Tech Business OS 🚀

*Read this in [English](#english-documentation)* | *اقرأ باللغة [العربية](#الوثائق-باللغة-العربية)*

---

<a name="english-documentation"></a>
## 🇬🇧 English Documentation

**Madarik Tech Business OS** is a comprehensive, modern Enterprise Resource Planning (ERP) and Customer Relationship Management (CRM) system built for modern businesses. It allows you to manage clients, invoices, contracts, projects, meetings, team roles, and much more in one unified dashboard.

### 🛠️ Tech Stack
* **Backend:** Laravel 11 (PHP), MySQL
* **Frontend:** React, Vite, TypeScript, Tailwind CSS, TanStack Query

### 📦 Prerequisites
Before you begin, ensure you have met the following requirements:
* PHP >= 8.2 & Composer
* Node.js >= 18 & npm/yarn
* MySQL or MariaDB

### 🚀 Installation Guide

#### 1. Backend Setup
1. Clone the repository and navigate to the backend folder:
   ```bash
   cd madarik-backend
   ```
2. Install PHP dependencies:
   ```bash
   composer install
   ```
3. Copy the environment file and generate the app key:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
4. Update your `.env` file with your database credentials.
5. Run database migrations and seeders (to create default roles and dummy data):
   ```bash
   php artisan migrate --seed
   ```
6. Start the local development server:
   ```bash
   php artisan serve
   ```
   *The API will be available at `http://localhost:8000`*

#### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd madarik-frontend
   ```
2. Install JavaScript dependencies:
   ```bash
   npm install
   ```
3. Copy the environment file (if available) or create a new `.env` file:
   ```bash
   cp .env.example .env
   ```
   *Make sure `VITE_API_URL` is set to your backend URL (e.g., `http://localhost:8000/api/v1`)*
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will be available at `http://localhost:5173`*

### 🔑 Default Credentials
If you ran the seeder, you can log in using the default admin account provided in the `DatabaseSeeder.php` file.

---

<a name="الوثائق-باللغة-العربية"></a>
## 🇸🇦 الوثائق باللغة العربية

**نظام مدارك تك (Business OS)** هو نظام متكامل وحديث لإدارة موارد الشركات (ERP) وإدارة علاقات العملاء (CRM). يتيح لك النظام إدارة العملاء، الفواتير، العقود، المشاريع، الاجتماعات، فريق العمل والصلاحيات، والمزيد من خلال لوحة تحكم واحدة متكاملة.

### 🛠️ التقنيات المستخدمة
* **الباك إند (الخوادم):** Laravel 11 (PHP), MySQL
* **الفرونت إند (الواجهة):** React, Vite, TypeScript, Tailwind CSS, TanStack Query

### 📦 المتطلبات الأساسية
قبل البدء، تأكد من توفر البرامج التالية على جهازك أو سيرفرك:
* PHP بإصدار 8.2 فما فوق مع Composer
* Node.js بإصدار 18 فما فوق مع npm
* قاعدة بيانات MySQL أو MariaDB

### 🚀 دليل التثبيت والتشغيل

#### 1. إعداد الباك إند (Backend)
1. افتح موجه الأوامر (Terminal) وادخل إلى مجلد الباك إند:
   ```bash
   cd madarik-backend
   ```
2. قم بتحميل المكتبات المطلوبة:
   ```bash
   composer install
   ```
3. انسخ ملف الإعدادات وقم بتوليد مفتاح التشفير:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
4. افتح ملف `.env` وقم بتعديل بيانات قاعدة البيانات (اسم القاعدة، المستخدم، كلمة المرور).
5. قم ببناء الجداول وحقن البيانات التجريبية (بما فيها الصلاحيات):
   ```bash
   php artisan migrate --seed
   ```
6. شغّل سيرفر التطوير المحلي:
   ```bash
   php artisan serve
   ```
   *سيعمل النظام على الرابط `http://localhost:8000`*

#### 2. إعداد الفرونت إند (Frontend)
1. افتح نافذة أوامر جديدة وادخل إلى مجلد الواجهة:
   ```bash
   cd madarik-frontend
   ```
2. قم بتحميل مكتبات الجافاسكريبت:
   ```bash
   npm install
   ```
3. انسخ ملف الإعدادات (أو قم بإنشائه) وتأكد من ربطه بالباك إند:
   ```bash
   cp .env.example .env
   ```
   *تأكد من أن المتغير `VITE_API_URL` يشير إلى الباك إند (مثال: `http://localhost:8000/api/v1`)*
4. شغّل سيرفر التطوير للواجهة الأمامية:
   ```bash
   npm run dev
   ```
   *ستعمل الواجهة على الرابط `http://localhost:5173`*

### 🔑 بيانات الدخول الافتراضية
إذا قمت بتشغيل أمر حقن البيانات التجريبية (Seed)، يمكنك تسجيل الدخول باستخدام حساب المسؤول الافتراضي الموجود في ملف `DatabaseSeeder.php`.

---

**Made with ❤️ by Madarik Tech**
