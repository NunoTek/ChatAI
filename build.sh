echo "-- Cleaning up..."
rm -rf ./dist/

echo "-- Installing dependencies..."
npm install
npm install --prefix ./server
npm install -g @quasar/cli

echo "-- Building app..."
npm run build

# TODO: fix
# npm run --prefix ./server swagger-autogen

echo "-- Structuring folders..."

mkdir -p ./dist/app/web/
cp -R ./server/* ./dist/app/
mv -f ./dist/pwa/* ./dist/app/web/

echo "done building app!"
read answer
