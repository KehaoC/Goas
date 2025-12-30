#!/bin/bash
set -e

cd "$(dirname "$0")"

if [ ! -f "docker.env" ]; then
    echo "Error: docker.env not found. Copy from docker.env.example"
    exit 1
fi

case "${1:-dev}" in
    dev)
        docker compose --env-file docker.env up postgres -d
        echo "Waiting for PostgreSQL..."
        until docker exec goas_postgres pg_isready -U postgres -d goas >/dev/null 2>&1; do sleep 1; done
        echo "PostgreSQL ready at localhost:5434"
        npm run dev
        ;;
    db)
        docker compose --env-file docker.env up postgres -d
        echo "PostgreSQL started at localhost:5434"
        ;;
    stop)
        docker compose --env-file docker.env down
        echo "Services stopped"
        ;;
    *)
        echo "Usage: $0 [dev|db|stop]"
        exit 1
        ;;
esac
