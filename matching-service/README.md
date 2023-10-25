## Docker use

Build using
`docker buildx build --platform linux/amd64 -t <name>:<tag> -f Dockerfile.prod .`

TAG using
`docker tag <image> <user>/<repo>:<tag>`

PUSH using
`docker push <user>/<repo>:<tag>`