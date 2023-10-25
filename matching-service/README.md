## Docker use
`docker buildx build --platform linux/amd64 -t <name>:<tag> -f Dockerfile.prod .`
`docker tag <image> <user>/<repo>:<tag>`
`docker push <user>/<repo>:<tag>`