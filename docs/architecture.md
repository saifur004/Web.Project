The ToDo List application is a full-stack web application built with the following technologies:

Frontend: React

Backend: Node.js with Express

Database: PostgreSQL

Deployment: Will be deployed on Render or Vercel (Phase 2)

Version Control: Git + GitHub









project-root/
├── frontend/                 # React app (user interface)
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── App.jsx
├── backend/                  # Node + Express backend
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── db/
│   └── server.js
├── docs/                     # Project documentation
│   ├── user-personas.md
│   ├── use-cases.md
│   ├── architecture.md
│   └── ui-prototypes/
├── logbook/                  # Time tracking & planning
│   └── logbook.md
├── README.md
└── .env                      # Environment variables (DB URL, port, etc.)
