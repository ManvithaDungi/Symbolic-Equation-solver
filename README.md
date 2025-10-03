
# Math Solver App

A full-stack web application that allows users to solve mathematical expressions including **arithmetic, algebraic equations, derivatives, integrals, and limits**. Built with **React** for the frontend and **Node.js + Express** for the backend using **Math.js** for computation.

---

## Features

### Mathematical Problem Solving
- Solve arithmetic expressions and simplify algebraic expressions
- Solve linear and quadratic equations
- Compute derivatives and integrals
- Evaluate limits
- Step-by-step solution explanation for each computation
- Example expressions for testing

### Advanced Visualization
- **2D Function Graphing**: Real-time plotting with customizable ranges
- **3D Surface Visualization**: Interactive 3D function plotting with WebGL
- **Interactive Parameter Manipulation**: Drag sliders to see real-time effects
- **Mathematical Concept Animations**: Animated demonstrations of derivatives and integrals
- **Multiple Plot Types**: Surface, wireframe, and point rendering for 3D functions

### 3D Plotting Capabilities
- Interactive 3D surface generation
- Real-time parameter manipulation
- Predefined function presets
- Custom domain and resolution settings
- Mathematical expression validation
- Performance-optimized rendering

---

## Tech Stack

- **Frontend:** React, Three.js, React Three Fiber, Framer Motion, Axios, CSS
- **Backend:** Node.js, Express
- **Math Engine:** Math.js
- **3D Graphics:** Three.js, WebGL
- **Database:** None (can be extended to store user history)
- **Deployment:** GitHub Pages (frontend) + Railway/Render/Vercel (backend)

---

## Folder Structure

```

labeval2/
├── backend/
│   ├── routes/
│   │   ├── math.js
│   │   └── plot3d.js
│   ├── utils/
│   │   ├── mathSolver.js
│   │   └── plot3dSolver.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Plot3D.js
│   │   │   ├── InteractiveManipulator.js
│   │   │   └── AnimationSequences.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Solver.js
│   │   │   ├── Visualization.js
│   │   │   ├── Plot3DPage.js
│   │   │   └── About.js
│   │   └── ...
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

### Math Solver Endpoints

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

### 3D Plotting Endpoints

* **POST `/api/plot3d/evaluate`** - Evaluate 3D function at specific coordinates
  Request body:

  ```json
  {
    "equation": "x^2 + y^2",
    "x": 2,
    "y": 3,
    "parameters": {}
  }
  ```

* **POST `/api/plot3d/surface`** - Generate 3D surface data
  Request body:

  ```json
  {
    "equation": "x^2 + y^2",
    "domain": { "x": [-5, 5], "y": [-5, 5] },
    "resolution": 50,
    "parameters": {}
  }
  ```

* **POST `/api/plot3d/validate`** - Validate 3D expression
  Request body:

  ```json
  {
    "equation": "x^2 + y^2",
    "parameters": {}
  }
  ```

* **GET `/api/plot3d/presets`** - Get predefined 3D functions

* **GET `/api/plot3d/stats`** - Get 3D plotting statistics

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


