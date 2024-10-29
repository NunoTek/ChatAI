# echo "Building ChatAI App..."
# ./build.sh

echo "-- Running Docker ChatAI App..."
# docker run --rm -it $(docker build -t chatai-app -q .)
docker build -t chatai-app -q .
docker run --rm chatai-app:latest -p 5000:5000

read answer
