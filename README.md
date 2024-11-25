# Event Management System

## Introduction
The following document outlines the functionalities and the idea of a an Event Management System. The idea behind this project allows for a better user experience to purchase tickets to different events that a manager account adds to keep updating the options for customers. Below you will find more detailed descriptions about this project. 

This document will be updated throughout the semester. 

### For Customers

To login as a user, use the following credentials:
    
    Email: user@test.com
    Password: Password123

- Create account and Sign In to navigate the Event Manager System.
- View the different events available in the Event Manager System.
- Purchase tickets for a specific event.
- Filter out the events to find events easier.
- Select the amount of seats you want to purchase.
- Checkout your purchase and have your tickets stored in your account. 
- Availibility to see your purchased tickets in your account.

### For Managers

To login as a manager, use the following credentials:
    
    Email: manager@test.com
    Password: Password

- Add, update, and delete events.
- Refund money to all customers that purchased tickets for an event. 

## Development
The Event Management System is under development and is not yet in final form. Features may be added, deleted, or modified throughout the semester. 

### Project Structure

### JavaScript Files

- **Location**: All JavaScript files should reside within the `src` folder.
- **Webpack Integration**: Ensure files are properly referenced in the `entry` section of the `webpack.config.js` file for bundling.

#### HTML Files

- **Location**: All HTML files should be located in the `dist` folder. 

#### CSS Files

- **Location**: All CSS files should be located in the `dist` folder.

### Frontend

The frontend of Event Management System is built by using HTML, CSS, and JavaScript. The purpose off HTML is used to structure the web pages, while JavaScript allows the functionalities to work. 

### Backend

Google Firebase is used as the backend of this project, allowing and providing a range of tools such as:

- **Firebase Authentication**: Manages user authentication and account management.
- **Cloud Firestore**: Serves as database to store and sync data.

### Libraries and Frameworks

- **Firebase SDK**: Utilized for integration of Firebase services into the web application.

### Development Tools

- **Git**: For version control and collaboration.
- **Visual Studio Code**: For development and support for HTML, CSS, JavaScript, and Firebase.

## Getting Started

To get started with the development:

1. Ensure you have **Node.js** and **npm** installed.
2. Clone the repository to your local machine.
3. Install project dependencies by running `npm install`.
4. Start the development server by running `npm start` .

## Opening Project

To open the project:

1. Make sure you install the Live Server Extension from Ritwick Dey in Visual Studio Code.
2. When installed, go to our index.html file under `dist` folder.
3. Right click on the HTML file in the editor and select `Open with Live Server`.