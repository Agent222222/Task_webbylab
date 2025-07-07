# 🎬 Movies App

> **DISCLAIMER:**  
This project is in raw format and does **not** include Docker configuration out of the box.  
To build and run it in Docker, you must add several files and make changes (especially in the `global_states` folder).

---

## 🚀 Getting Started (Without Docker)

Follow these steps to clone and run the project locally:

### 1. Go to your local folder and clone the repository
```bash
git clone https://github.com/Agent222222/Task_webbylab.git
cd Task_webbylab
```

### 2. Install dependencies
Open the project in **Visual Studio Code**, then run:
```bash
npm install
```

If `npm start` works correctly, you're all set. Otherwise, manually install the required dependencies:
```bash
npm install react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Make sure your `src/index.css` includes:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Then install the rest:
```bash
npm install redux react-redux redux-thunk @reduxjs/toolkit axios
npm start
```

### 3. Set API base URL
Check a `.env.local` file and change if you want this variable to needed URL:
```
REACT_APP_API_URL=http://localhost:8000/api/v1
```

---

## 🐳 Docker Setup

To containerize the project using Docker, follow the steps below.

### 1. Add required Docker files

#### a. `.dockerignore`
```gitignore
node_modules
build
dist
.cache
.env
.env.local
.DS_Store
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
coverage
.vscode
.idea
```

#### b. `Dockerfile`
```Dockerfile
FROM node:22.11.0-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build
RUN npm install -g serve

COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["serve", "-s", "build", "-l", "3000"]
```

#### c. `entrypoint.sh`
```sh
#!/bin/sh

echo "Generating runtime environment variables..."

cat <<EOF > /app/build/runtime-env.generated.js
window._env_ = {
    REACT_APP_API_URL: "${REACT_APP_API_URL}"
};
EOF

# Inject into build/index.html only if not already injected
if ! grep -q "runtime-env.generated.js" /app/build/index.html; then
    sed -i '/<head>/a <script src="/runtime-env.generated.js"></script>' /app/build/index.html
fi

exec "$@"
```

#### d. `/public/runtime-env.js`
```js
window._env_ = {
  REACT_APP_API_URL: "%REACT_APP_API_URL%"
};
```

### 2. Modify `/public/index.html`

Before the closing `</body>` tag, add:
```html
<script src="/runtime-env.generated.js"></script>
```

### 3. Update API usage

Replace all instances of:
```js
process.env.REACT_APP_API_URL
```
with:
```js
window._env_?.REACT_APP_API_URL
```
In files:
- `/global_states/authSlice.js`
- `/global_states/importFile.js`
- `/global_states/moviesSlice.js`

### 4. Save all changes

### 5. Build the Docker image
```bash
docker build -t mykolamuzyka/movies-app .
```

### 6. Run the Docker container
```bash
docker run --rm -p 3000:3000 -e REACT_APP_API_URL=http://127.0.0.1:8000/api/v1 mykolamuzyka/movies-app
```

> ✅ `127.0.0.1` is localhost — replace it with your actual backend URL if needed.

---
