
# Math Solver App

A full-stack web application that allows users to solve mathematical expressions including **arithmetic, algebraic equations, derivatives, integrals, and limits**. Built with **React** for the frontend and **Node.js + Express** for the backend using **Math.js** for computation.

---

## Features

- Solve arithmetic expressions and simplify algebraic expressions
- Solve linear and quadratic equations
- Compute derivatives and integrals
- Evaluate limits
- Step-by-step solution explanation for each computation
- Example expressions for testing

---

## Tech Stack

- **Frontend:** React, Axios, CSS
- **Backend:** Node.js, Express
- **Math Engine:** Math.js
- **Database:** None (can be extended to store user history)
- **Deployment:** GitHub Pages (frontend) + Railway/Render/Vercel (backend)

---

## Folder Structure

```

labeval2/
├── backend/
│   ├── routes/
│   │   └── math.js
│   ├── utils/
│   │   └── mathSolver.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
└── README.md

````

---

## Installation

### Backend

1. Navigate to the backend folder:

```bash
cd backend
````

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in `backend`:

```env
PORT=5000
NODE_ENV=development
```

4. Start the backend server:

```bash
npm start
```

The backend will run at `http://localhost:5000`.

---

### Frontend

1. Navigate to the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in `frontend`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the React app:

```bash
npm start
```

The frontend will run at `http://localhost:3000`.

---

## API Endpoints

* **POST `/api/math/solve`** - Solve a math expression
  Request body:

  ```json
  {
    "expression": "2 + 3 * 4"
  }
  ```

* **POST `/api/math/validate`** - Validate expression syntax
  Request body:

  ```json
  {
    "expression": "x^2 + 2*x + 1"
  }
  ```

* **GET `/api/math/examples`** - Get example expressions

---

## Deployment

### Frontend

* Use **GitHub Pages**:

```bash
npm run build
npm install gh-pages --save-dev
npm run deploy
```

### Backend

* Use **Railway**, **Render**, or **Vercel** to host the Node.js backend.
* Update `REACT_APP_API_URL` in frontend to point to deployed backend.

---

## Usage

1. Open the frontend in your browser.
2. Enter a mathematical expression.
3. Click **Solve**.
4. View step-by-step solution along with the result.

---

## Future Enhancements

* User authentication and history tracking
* Graph plotting for functions
* Extended support for multivariable calculus
* Save favorite expressions

---

## License

MIT License

---

## Author

**Manvitha Dungi**


