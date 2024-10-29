echo "npm Version..."
npm -v

echo "nodejs Version..."

node -v

echo "nodemon Version..."
nodemon -v

echo "-- Installing dependencies..."
npm install
npm install --prefix ./server

echo "-- Starting ChatAI!"
npm run --prefix ./server serve
