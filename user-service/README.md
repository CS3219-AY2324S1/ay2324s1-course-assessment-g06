# User-Service
On MacOS:
Assuming brew is installed, to install mysql:
`brew install mysql`

To start mysql:
`brew services start mysql`

To stop mysql:
`brew services stop mysql`

## Docker use
Build using
`docker buildx build --platform linux/amd64 -t <name>:<tag> -f Dockerfile.prod .`

TAG using
`docker tag <image> <user>/<repo>:<tag>`

PUSH using
`docker push <user>/<repo>:<tag>`