# LabSeek

LabSeek is a full-stack laboratory discovery and appointment platform built from the supplied project plan. Patients can compare laboratories and tests, book appointments, track bookings, and securely view released results. Laboratory teams can manage appointment statuses, while administrators can monitor platform activity.

## Stack

- React 19, React Router and Vite
- Node.js and Express
- JWT authentication, bcrypt password hashing, Helmet and Zod validation
- Responsive custom CSS design system
- In-memory seeded data for a zero-configuration demo

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. The API runs at `http://localhost:4000`.

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Patient | `patient@labseek.co.za` | `Patient123!` |
| Laboratory | `lab@labseek.co.za` | `Laboratory123!` |
| Administrator | `admin@labseek.co.za` | `Admin123!` |

## Commands

- `npm run dev` - run the frontend and backend together
- `npm run build` - create the production frontend build
- `npm test` - run the backend integration test
- `npm start` - start the API

## Production notes

The demo data resets when the API process restarts. Before deployment, replace the in-memory collections in `server/src/data.js` with MySQL repositories, set a strong `JWT_SECRET`, restrict `CLIENT_URL`, use HTTPS, and store result files in private object storage with short-lived authorised downloads.
