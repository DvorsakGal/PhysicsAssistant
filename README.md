# Physics Learning Assistant 🌍

## Project Overview
The main focus of this project was exploring the integration side of modern web apps.
It demonstrates the integration of various technologies (and a few APIs), to create a scalable and efficient solution.
The goal is to showcase how different services can communicate effectively while maintaining modularity and scalability.

### 🗂️ Project Structure
This project is divided into sections to showcase **weekly progress**, with each folder representing an iteration. The **final version** of the app is in **`08_ChainOfResponsibility`**. 🏁

## 🌟 Features

### **1. Core System Implementation** ⚡
- Register and manage MSE (Small Solar Power Plants)
  - Store details such as location coordinates, owner information (name, email), and capacity in kW
- Community Management
  - Define and manage communities, including registered MSEs and community administrators
  
### **2. Data Management Enhancements** ⚙️
- Edit functionality for MSE and community details
- Delete functionality with confirmation dialog
- Detailed view of each community and its MSEs on a separate page
- Improved UI using frameworks like Bootstrap or PrimeFaces

### **3. Integration of Session EJB Beans** 🔗
- Use stateless session beans (@Stateless) for persistent storage
- Local accessibility (@Local)
- Link the UI with beans using @EJB
- New functionality: Calculate and display the total capacity of an energy community
  - Accessible via web UI and a console application

### **4. Observer Pattern for Notifications** 👁️
- Implement an observer pattern to notify all community members when a new MSE is added
- Use Java Mail API for email notifications
- Configure WildFly mail session (JNDI: `java:jboss/mail/MojMail`)
- Secure SMTP integration to avoid exposing credentials in the code

### **5. Migration to JPA for Data Management** 🗄
- Replace in-memory DAO with JPA-based persistence
- Architectural layers:
  - **Entity Layer**: Value objects (@Entity)
  - **Persistence Layer**: JPA integration (@PersistenceContext, @Stateless)
  - **Model Layer**: UI-related beans (@Named)
  - **Presentation Layer**: XHTML-based web interface

### **6. Implementing the State Design Pattern for MSE** 🏭
- Each MSE can be in one of three states:
  - 🚫 **Inactive**
  - ⚡ **Half Capacity**
  - ☀️ **Full Capacity**
- Energy production calculations reflect the current state
- Community view now displays real-time production based on MSE statuses

### **7. Scheduled Maintenance & Life Cycle Management** 🛠
- Each MSE tracks:
  - **Installation Date**
  - **Last Inspection Date**
  - **Last Maintenance Date**
- Automatic reminders:
  - **Annual Inspection**: Every 12 months
  - **Major Service**: Every 5 years
  - **Life Expectancy**: 20 years
- Notification System:
  - If the next maintenance is between 2-6 months away, log a message to the console
  - If less than 2 months remain, send an email notification to the owner

## 🏗️ **Technology Stack**
- **Backend:** Jakarta EE (Enterprise Java), EJB, JPA, Java Mail API
- **Frontend:** JSF (JavaServer Faces) with PrimeFaces/Bootstrap
- **Database:** JPA for persistence (replacing in-memory DAO)
- **Server:** WildFly application server
- **Messaging & Notifications:** Java Mail API for email alerts
- **Design Patterns Used:** Observer Pattern, State Pattern, Chain of Responsibility (final version)

## 🚀 **Deployment Instructions**
### **Prerequisites**
- 🖥 **IDE:** IntelliJ IDEA (or any compatible Java IDE)
- 🌐 **Application Server:** WildFly
- 🗄 **Database:** Configured JPA persistence unit
- 📧 **Mail Server:** SMTP configuration in WildFly
