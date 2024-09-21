# RMatch: A Social App for RMIT Students
A dynamic web application designed specifically for RMIT students to connect with teammates, friends, and matches. It provides features such as swiping for matches, user profiles, and team-building capabilities, all in one unified platform.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Installation](#installation)
5. [Technical Implementation (B3)](#technical-implementation-b3)
6. [Developmental Solutions (B4)](#developmental-solutions-b4)
7. [Project Structure](#project-structure)
8. [API Design](#api-design)
9. [Future Work](#future-work)
10. [Documentation (B5)](#documentation-b5)

---

## Project Overview

**RMatch** is a web application created to help RMIT students connect with potential teammates, friends, and study partners. Users can create detailed profiles, swipe left or right on other students, and see mutual matches. The platform is designed with ease of use and responsiveness in mind, allowing students to find the best fit for their team-based assignments and projects.

---

## Features

- **User Authentication**: Secure sign-up, login, and session management with Supabase Authentication.
- **Profile Management**: Create and update detailed user profiles, including personal details, academic background, and skills.
- **Swiping System**: Swipe left or right on other users to find teammates or friends.
- **Matchmaking**: Matches are based on mutual swipes. Users can see who they’ve matched with and engage with them.
- **Interactive Profile Cards**: Profiles are divided into sections, allowing users to easily browse relevant information about a potential teammate or friend.
- **Dynamic Navigation**: The app’s navigation bar dynamically highlights the current page and includes a sign-out feature.

---

## Technologies Used

- **Frontend**: React.js, TailwindCSS, Next.js, and TypeScript.
- **Backend**: Supabase (PostgreSQL, Authentication, Storage).
- **Authentication**: Supabase Authentication with session-based management.
- **Storage**: Supabase Storage for profile image uploads.
- **Assets**: SVG icons, avatars, and profile images.

---

## Installation

### Prerequisites
- Node.js (v14.x or above)
- npm (v6.x or above)
- Supabase account

### Steps to Install Locally

1. Clone this repository:
```
git clone https://github.com/yourusername/RMatch.git
cd RMatch
```
2. Install dependencies:
```
npm install
```
3. Create a .env.local file in the root directory and add the following:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
4. Run the development server:
```
npm run dev
```
5. Visit http://localhost:3000 in your browser.

## Technical Implementation (B3)

### Scope and Completeness

The **RMatch** prototype is a fully functional web application allowing RMIT students to:
1. Sign up, log in, and log out using Supabase Authentication.
2. Create and update user profiles with relevant personal, academic, and work-related information.
3. Swipe left or right on profiles to find potential teammates or friends.
4. View mutual matches and interact with them.
5. Navigate through multiple interactive sections using a dynamic Navbar.

### Interactive Features

1. **Swiping System:** Students can swipe left or right on profiles, and mutual swipes trigger matches. The swipes are recorded in real-time and stored in the backend.
2. **Profile Cards:** Each profile contains multiple tabs, allowing users to easily access detailed information about another student.
3. **Real-Time Profile Updates:** Users can edit and update their profiles, and changes are instantly reflected in the app.
4. **Dynamic Navbar:** The navigation bar highlights the current page and contains a sign-out button to allow users to log out.
5. **Smooth Animations:** Swipe animations are powered by React Spring to ensure fluid transitions when interacting with the app.

### Backend Integration

- Supabase is used to handle all database interactions, including user authentication, storing user profiles, and recording swipes and matches.
- All backend logic is handled through database models, which include tables for profiles, swipes, and matches.
- Optimized queries ensure that users only see profiles they haven’t swiped on yet, improving performance.

## Developmental Solutions (B4)

### Generalized Solution 1: Profile Creation on Login
- **Problem**: Not all users have a profile when they log in for the first time.

- **Solution**: A generalized function checkOrCreateUserProfile was implemented in profileService.ts. This function checks if a user has an existing profile when they log in. If not, a default profile is created for them with basic information, ensuring that the app never crashes due to missing profile data.

**Code Example**: 
```
export const checkOrCreateUserProfile = async (userId: string) => {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error && error.code === 'PGRST116') {
    await supabase.from('profiles').insert([{ id: userId, name: '', bio: '' }]);
  }
};
```

### Generalized Solution 2: Fallback for Profile Images
- **Problem:** Users may not have uploaded a profile image, which could result in broken image links.

- **Solution:** A fallback mechanism was implemented in the ProfileCard component. If the user’s profile image is missing or fails to load, a default avatar image is used instead. This ensures that the UI remains consistent even when images fail to load.

**Code Example**:
```
<Image
  src={profile.profile_image?.startsWith("http") ? profile.profile_image : avatar}
  onError={(e) => (e.currentTarget.src = avatar)}
  alt={profile.name}
  layout="fill"
/>
```

### Performance Optimizations
- **Database Queries:** Efficient O(n) database queries are used to fetch unswiped profiles, reducing the load on the backend and ensuring a smooth user experience.
- **Memory Management:** Variables are reused wherever possible to minimize memory overhead, and unnecessary API calls are avoided.
- **Modular Functions:** Functions are modular and designed to be easily extendable for future updates or new features.

## Project Structure
```
├── src/
│   ├── app/
│   ├── components/
│   ├── services/
│   └── styles/
├── public/
│   └── images/
└── README.md
```
- **app/:** Contains Next.js pages like login, signup, and the main app pages for finding friends and teammates.
- **components/:** Contains reusable components like ProfileCard, Navbar, and Header.
- **services/:** Contains service files like profileService.ts for managing backend operations.
- **styles/:** Contains global CSS and TailwindCSS configurations.

## API Design

### Supabase API

- **Profiles:** Stores all user profile data, including personal, academic, and work details.
- **Swipes:** Records swipe actions (like or dislike) between users.
- **Matches:** Matches are generated based on mutual swipes and stored in the database.
- **Authentication:** Handles user login, signup, and session management.

### API Endpoints

- **GET /profiles:** Retrieves all profiles except the current user and already swiped profiles.
- **POST /swipes:** Records swipe interactions and checks for matches.
- **GET /matches:** Retrieves mutual matches based on swipe data.

## Future Work

1. **Integration with RMIT School Database**: Integrate the app with the school's internal database to allow seamless retrieval of verified student data. This will ensure that student profiles are automatically populated with essential academic information such as courses, programs, and GPA, and that the users are authenticated via their student accounts.
   
   - **Objective**: Automatically sync user profiles with RMIT's internal student management system.
   - **Benefit**: This will reduce the need for students to manually input academic details, improving data accuracy and reducing onboarding friction.

2. **Real-Time Chat**: Implement real-time chat functionality between matched users, enabling communication and collaboration directly within the platform.

3. **Notifications**: Introduce notifications (both in-app and push) to notify users of new matches, messages, and other relevant updates.

4. **Advanced Filters for Profiles**: Provide users with the ability to filter profiles based on specific criteria, such as academic programs, skills, or project preferences.

5. **Team Creation**: Enable users to form teams within the app and manage team-based assignments or projects. This will help RMIT students easily collaborate on assignments and create teams based on mutual interests and skills.

6. **Enhanced Security**: Implement multi-factor authentication (MFA) using student emails or SMS to ensure only verified RMIT students access the app.

---

## Assumptions

For the successful implementation of **RMatch**, the following assumptions have been made:

1. **Access to RMIT's Student Database**: 
   - It is assumed that the app will have read access to RMIT's internal student database, enabling us to retrieve verified academic details (such as student ID, enrolled courses, GPA, etc.) and use that data to automatically populate student profiles.
   - Secure API endpoints will be provided by RMIT to ensure the seamless integration of student information.

2. **Authentication via Student Accounts**:
   - The app will utilize the existing RMIT authentication system, allowing students to log in using their official RMIT credentials. This ensures that only verified students can use the platform.

3. **Compliance with Data Privacy Laws**: 
   - The application will comply with relevant data privacy regulations such as the Australian Privacy Principles (APPs), and it will ensure that all user data retrieved from the RMIT database is stored securely and used only for the intended purposes of the app.

4. **School-Specific Data**: 
   - The app assumes that all users are RMIT students, and the profiles will be tailored specifically for RMIT's academic structure, including programs, courses, and student IDs.

These assumptions are crucial for the app's intended operation and to provide a seamless experience for RMIT students.
