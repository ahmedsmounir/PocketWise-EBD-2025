# PocketWise-EBD-2025

Pocket Wise
Course: Electronic Business Development (BINF 503)
Semester: Winter 2025
Instructor: Dr. Nourhan Hamdi
Teaching Assistants: Mr. Nour Gaser, Mr. Omar Alaa
1. Team Members
Name Student       ID GitHub    Username
[Ahmed Sherif]    [13001195] [@ahmedsmounir]
[Ali Tamer]       [13003448] [@alitamerr21]
[Mohamed ABoBakr] [13003837] [@Mohamed1elshemaly]
[Mohamed Mostafa] [13004527] [@username]
[Mazen Maged]     [13005396] [@username]

3. Project Description:
Concept: PocketWise is a digital banking interface designed for university students who frequently run out of money
due to impulsive spending. It solves this by enforcing real-time micro-budgeting:
automatically dividing the user's monthly allocated spending money into a non-cumulative daily limit,
accessible via a linked card. This prevents random discretionary spending from derailing monthly saving goals.

3.1 Full Scope
List ALL potential features/user stories envisioned for the complete product.
1. Micro-Saving Programs: Automatically rounding up purchases to the nearest pound for savings.
2. AI Spending Analysis: Analyzing spending patterns to predict and prevent overspending.
3. Live Banking Integration: Connecting directly to real banking APIs (e.g., InstaPay) for real-time fund transfers.
4. Digital Envelopes: Categorizing budgets for specific needs like "Dining Out."

3.2 Selected MVP Use Cases (Course Scope)
From the list above, we have identified the 5 specific use cases we will implement.
1.  **User Authentication:** Secure Registration and Login functionality.
2.  **Budget Setup Engine:** Logic to input the monthly allowance and calculate the non-cumulative daily spending limits.
3.  **Transaction Management:** Full CRUD for daily expenses. Users can log an expense and view their history.
4.  **PocketWise Dashboard:** A visual interface displaying the "Remaining Daily Limit" vs. "Actual Spending" in real-time.
5.  **Savings Goal Tracker:** A "digital envelope" feature allowing users to allocate funds toward specific savings targets.

4. Feature Assignments (Accountability)
    Team Member          Assigned Use Case             Brief Description of Responsibility 
| [Student 1 Name] | **User Authentication**    | Register, Login, JWT implementation, Password Hashing.
| [Student 2 Name] | **Budget Setup Engine**    | Backend logic to calculate daily limits based on monthly input; Profile management.
| [Student 3 Name] | **Transaction Management** | API and UI to Log new expenses and view/delete past transaction history.
| [Student 4 Name] | **PocketWise Dashboard**   | Visualizing data; fetching daily limits and calculating remaining balance for the UI.
| [Student 5 Name] | **Savings Goal Tracker**   | CRUD logic for creating savings goals and allocating funds to them.

5. Data Model (Initial Schemas)
 User Schema
 const UserSchema = new mongoose.Schema({
   username: { type: String, required: true },
   email: { type: String, required: true, unique: true },
   password: { type: String, required: true },
   monthlyAllowance: { type: Number, default: 0 }, // For Budget Setup
   dailyLimit: { type: Number, default: 0 },       // Calculated by Budget Engine
   currency: { type: String, default: 'EGP' },
   createdAt: { type: Date, default: Date.now }
 });
 
 Transaction Schema
 const TransactionSchema = new mongoose.Schema({
   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
   title: { type: String, required: true }, // e.g., "Coffee"
   amount: { type: Number, required: true },
   category: { type: String, enum: ['Food', 'Transport', 'Shopping', 'Other'], default: 'Other' },
   date: { type: Date, default: Date.now }
 });
 
 SavingsGoal Schema
 const SavingsGoalSchema = new mongoose.Schema({
   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
   goalName: { type: String, required: true }, // e.g., "Summer Trip"
   targetAmount: { type: Number, required: true },
   currentSaved: { type: Number, default: 0 },
   deadline: { type: Date }
 });
