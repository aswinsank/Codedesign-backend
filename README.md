# SaaS Backend - B2B Productivity Dashboard

This repository contains the backend implementation for a B2B SaaS dashboard that provides productivity insights based on logged team activities. The service offers various summary and detailed reports to help teams analyze their performance.

## Tech Stack

- **Backend**: Node.js with Express
- **Data Storage**: In-memory data store (for simplicity in development)

## Features

- Team activity logging
- Productivity insights and analytics
- Summary reports
- Detailed activity breakdowns
- (Add more features as applicable)

## Installation

# 1. Clone the repository
git clone https://github.com/aswin_sank/Codedesign-backend.git

# 2. Move to project directory
cd saas-backend

# 3. Install dependencies
npm install

# 4. Start the server
node index.js


The server will start and run on http://localhost:3000.


Test using postman : 
1.a). GET /report/overview:
<img width="345" height="41" alt="image" src="https://github.com/user-attachments/assets/eb28c08c-ae57-4a3f-9182-450c10128716" />

1.b). Overview with Date Filter: 
<img width="820" height="353" alt="image" src="https://github.com/user-attachments/assets/c6b9965b-a269-4baa-8a15-1d85600ec83e" />

2.a). GET /report/company/:companyId
<img width="819" height="480" alt="image" src="https://github.com/user-attachments/assets/78634b5b-82f6-4da9-999f-a10b92231dcc" />

2.b). Invalid Data: 

<img width="815" height="255" alt="image" src="https://github.com/user-attachments/assets/4bd5f426-53f6-430c-ab62-0a243bc581f5" />

3.a). GET /report/member/:memberId 
<img width="811" height="308" alt="image" src="https://github.com/user-attachments/assets/67dae70c-b951-419e-9fe9-12b5de5044d3" />

3.b) Report with Date Filter: 
<img width="820" height="518" alt="image" src="https://github.com/user-attachments/assets/627d37f9-187b-4e7a-bf5e-fdf497cf7d1c" />

NEW TEST ENDPOINT AS REQUESTED: 
4) POST /report/activity
<img width="825" height="536" alt="image" src="https://github.com/user-attachments/assets/4c61b5ef-3e37-48dd-823c-4f03d453c6dc" />

4.b). Add an Activity to a Non-Existent Member
<img width="819" height="527" alt="image" src="https://github.com/user-attachments/assets/639c4369-590f-43d3-8d27-527d425f9530" />

4.c). Invalid Request Body (Missing Fields)
<img width="816" height="544" alt="image" src="https://github.com/user-attachments/assets/4c7d4290-453f-4814-8e40-c1a9baf5e278" />







