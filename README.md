# PocketWise-EBD-2025

Pocket Wise
Course: Electronic Business Development (BINF 503)
Semester: Winter 2025
Instructor: Dr. Nourhan Hamdi
Teaching Assistants: Mr. Nour Gaser, Mr. Omar Alaa
1. Team Members
List all team members (5-6 students) below.
Name Student ID GitHub Username
[Ahmed Sherif] [13001195] [@ahmedsmounir]
[Ali Tamer] [13003448] [@alitamerr21]
[Mohamed ABoBakr] [13003837] [@Mohamed1elshemaly]
[Mohamed Mostafa] [13004527] [@username]
[Mazen Maged] [13005396] [@username]

3. Project Description:
Concept: PocketWise is a digital banking interface designed for university students who frequently run out of money
due to impulsive spending. It solves this by enforcing real-time micro-budgeting:
automatically dividing the user's monthly allocated spending money into a non-cumulative daily limit,
accessible via a linked card. This prevents random discretionary spending from derailing monthly saving goals.

3.1 Full Scope
List ALL potential features/user stories envisioned for the complete product (beyond just this course).
1. Micro-Saving Programs: Automatically rounding up purchases to the nearest pound for savings.
2. AI Spending Analysis: Analyzing spending patterns to predict and prevent overspending.
3. Live Banking Integration: Connecting directly to real banking APIs (e.g., InstaPay) for real-time fund transfers.
4. Digital Envelopes: Categorizing budgets for specific needs like "Dining Out."

3.2 Selected MVP Use Cases (Course Scope)
From the list above, identify the 5 or 6 specific use cases you will implement for this course. Note: User
Authentication is mandatory.
1. User Authentication (Registration/Login)
2. [Use Case 2 Title]
3. [Use Case 3 Title]
4. [Use Case 4 Title]
5. [Use Case 5 Title]

4. Feature Assignments (Accountability)
Assign one distinct use case from Section 3.2 to each team member. This member is responsible for the full-stack implementation of this feature.
Team Member Assigned Use Case Brief Description of Responsibility
[Student 1] User Authentication Register, Login, JWT handling, Password Hashing.
[Student 2] [Use Case 2] [e.g., Create and view Transaction history]
[Student 3] [Use Case 3] [e.g., Profile management and updates]
[Student 4] [Use Case 4] [e.g., Transfer funds logic]
[Student 5] [Use Case 5] [Description]
[Student 6] [Use Case 6] [Description]
5. Data Model (Initial Schemas)
Define the initial Mongoose Schemas for your application’s main data models (User, Transaction, Account,
etc.). You may use code blocks or pseudo-code.
User Schema
const UserSchema = new mongoose.Schema({
 username: { type: String, required: true },
 email: { type: String, required: true, unique: true },
 password: { type: String, required: true },
 // Add other fields...
});
[Model 2 Name] Schema
template__README.md 2025-11-18
/
// Define schema here
[Model 3 Name] Schema
// Define schema here
