# User-Service

We are currently using locally run MYSQL server.

On MacOS:
Assuming brew is installed, to install mysql:
`brew install mysql`

To start mysql:
`brew services start mysql`

To stop mysql:
`brew services stop mysql`

## Docker use
`docker buildx build --platform linux/amd64 -t <name>:<tag> -f Dockerfile.prod .`
`docker tag <image> <user>/<repo>:<tag>`
`docker push <user>/<repo>:<tag>`
