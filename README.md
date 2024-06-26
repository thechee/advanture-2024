# Advanture
### Link to live site:
https://advanture.onrender.com

### Creator
Chase Agee
[GitHub](https://github.com/thechee) |
[LinkedIn](https://www.linkedin.com/in/chase-agee/)

### Summary
Have an adventure-ready camper van sitting around? Want to get out into nature without having to worry about accomodations? Advanture is the answer, a website dedicated to connecting people looking to rent camper vans and those who have vans!

This is a capstone project for the appAcademy 24-week program.

#### Home Page
![image](./public/van-home.png)

#### Van List
![image](./public/van-list.png)

#### Van Favorites
![image](./public/van-favorites-gif.gif)

#### Van Details/Reviews
![image](./public/van-details-gif.gif)

## Technologies
#### Languages
![image](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![image](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![image](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![image](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)

#### Frameworks/Libraries
![image](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white)
![image](https://img.shields.io/badge/SQLAlchemy-red?style=for-the-badge&logo=SQLAlchemy&logoColor=white)
![image](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![image](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)

#### Database
![image](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)
![image](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![image](https://img.shields.io/badge/Alembic-%23F79A32.svg?style=for-the-badge&logo=alembic&logoColor=white)

#### APIs and Services
![image](https://img.shields.io/badge/Google_Maps-4285F4?style=for-the-badge&logo=google-maps&logoColor=white)
![image](https://img.shields.io/badge/Amazon_S3-569A31?style=for-the-badge&logo=amazon-s3&logoColor=white)

#### Development Tools
![image](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

#### Hosting
![image](https://img.shields.io/badge/Render-%236086D6.svg?style=for-the-badge&logo=render&logoColor=white)



## Getting started

1. Clone this repository (only the main branch for full functionality).

2. Install dependencies.

   ```bash
   pipenv install -r requirements.txt
   ```

3. Create a __.env__ file based on the example with proper settings for your
   development environment.

4. Make sure the SQLite3 database connection uRL is in the __.env__ file.

5. This starter organizes all tables inside the `flask_schema` schema, defined
   by the `SCHEMA` environment variable.  Replace the value for
   `SCHEMA` with a unique name, **making sure you use the snake_case
   convention.**

6. Get into your pipenv, migrate your database, seed your database, and run your
   Flask app:

   ```bash
   pipenv shell
   ```

   ```bash
   flask db upgrade
   ```

   ```bash
   flask seed all
   ```

   ```bash
   flask run
   ```

7. To run the React frontend in development:
-`cd` into the __react-vite__ directory and run `npm i` to install dependencies. 
- Next, run `npm run build` to create the `dist` folder. This
   command includes the `--watch` flag. This flag will rebuild the __dist__
   folder whenever you change your code, keeping the production version up to
   date.

## Features
1. Users
    - users can create an account
    - users can Log-in and Logout of their created account with authentication
2. Vans
    - Logged in users can create new vans
    - Users can view vans
    - Logged in users can update their vans
    - Logged in users can delete their vans
3. Reviews
    - Logged in users can create new reviews
    - Users can view reviews
    - Logged in users can update their reviews
    - Logged in users can delete their reviews
4. Favorites
    - Logged in users can create new favorites
    - Logged in users can view their favorites
    - Logged in users can delete their favorites

### Feature Features
1. Bookings/Availibilty
    - Logged in users can create new booking
    - Users can view availablity of vans (absence of bookings)
    - Users can view bookings of their vans (past and future)
    - Logged in users can update their booking (before the start date)
    - Logged in users can delete their booking (before the start date)
2. Notifications
    - Logged in users receive a notification when their requested booking is approved
    - Logged in users receive a notification when a booking of their van is requested
    - Logged in users receive a notification when a update to a booking is requested
    - Logged in users receive a notification when a deletion of a booking is requested
3. Search by Location & Availability
    - Users can search for available vans within a date range, by location
4. Van Features
    - Logged in users can create new van features to their van
    - Logged in users can delete van features to their van
5. Multiple Van Images
    - Logged in users can create new van images of their van
    - Logged in users can delete van images of their van
6. User Account 
    - Logged in users can view their account details
    - Logged in users can update their account details
    - Logged in users can delete their account