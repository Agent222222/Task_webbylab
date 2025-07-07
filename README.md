# Task_webbylab
Technical task from the IT company WebbyLab to test my knowledge and skills in React and Redux.

!!DISCLAIMER!! 
This program is a raw code without a docker configuration and in order to do the docker image from it, you will need to add a bunch of files and change some part of the code in a "global_states" folder.


Program start guide:

1. Go to your local folder where you want this project to be and open git bash there.
2. Run "git clone https://github.com/Agent222222/Task_webbylab.git"
3. open the folder in the Visual Studio Code (cd Task_webbylab) and run next commands to install all packages:
   "npm i " --> then try to "npm start" and if it works properly then all packages were installed, if not then do next:
   npm install react-router-dom
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   add @tailwind base; @tailwind components; @tailwind utilities; to index.css file in case that is empty somehow
   npm i redux 
   npm i react-redux
   npm i redux-thunk
   npm i @reduxjs/toolkit
   npm i axios
   npm start 
--> then it should work properly 

4. Also you can configure URL of back, where the requests will be sent in the .env.local file (variable called REACT_APP_API_URL)



Docker Image creation and usage guide:

1. Add next files:
	
	a) .dockerignore file and fill this in:
 
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

	b) Dockerfile and fill this:

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

	c) entrypoint.sh and paste:

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

	d) /public/runtime-env.js and paste:

window._env_ = {
  REACT_APP_API_URL: "%REACT_APP_API_URL%"
};

2. Paste this line before the closing tag of body in /public/index.html:

<script src="/runtime-env.generated.js"></script>

3. Check all places with process.env.REACT_APP_API_URL in files /global_states/authSlice.js , /global_states/importFile.js , /global_states/moviesSlice.js and change that value to window._env_?.REACT_APP_API_URL

4. Make sure to save all performed changes
5. Open terminal in the project forlder and run next command:

docker build -t mykolamuzyka/movies-app .

6. Open cmd and run this(127.0.0.1 is a localhost, but you can change it to the back destination):

docker run --rm -p 3000:3000 -e REACT_APP_API_URL=http://127.0.0.1:8000/api/v1 mykolamuzyka/movies-app
