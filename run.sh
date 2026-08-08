#!/bin/sh
set -e

# Автодетект compose-клиента: docker compose -> podman compose -> docker-compose -> podman-compose
if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
  COMPOSE="docker compose"
elif command -v podman >/dev/null 2>&1 && podman compose version >/dev/null 2>&1; then
  COMPOSE="podman compose"
elif command -v docker-compose >/dev/null 2>&1; then
  COMPOSE="docker-compose"
elif command -v podman-compose >/dev/null 2>&1; then
  COMPOSE="podman-compose"
else
  echo "run.sh: docker compose или podman compose не найдены" >&2
  exit 1
fi

case "${1:-help}" in
  studio)
    shift
    case "${1:-start}" in
      start)
        $COMPOSE exec -T backend sh -c "nohup npx prisma studio --browser none --port 51212 >/tmp/prisma-studio.log 2>&1 &" && echo "Prisma Studio at http://localhost:51212"
        ;;
      stop)
        $COMPOSE exec backend sh -c "pkill -f '[p]risma studio' 2>/dev/null; echo 'studio stopped'"
        ;;
      *)
        echo "Usage: $0 studio {start|stop}"
        ;;
    esac
    ;;
  migrate)
    $COMPOSE run --rm backend sh -c "npx prisma generate && npx prisma migrate dev"
    echo "[run] migration done"
    ;;
  deploy)
    $COMPOSE run --rm backend sh -c "npx prisma generate && npx prisma migrate deploy"
    echo "[run] deploy done"
    ;;
  *)
    echo "Usage: $0 <command>"
    echo ""
    echo "Commands:"
    echo "  studio start   Start Prisma Studio (detach)"
    echo "  studio stop    Stop Prisma Studio"
    echo "  migrate        Run Prisma migrations (dev)"
    echo "  deploy         Apply Prisma migrations (prod)"
    ;;
esac
