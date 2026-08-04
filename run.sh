#!/bin/sh
set -e

case "${1:-help}" in
  studio)
    shift
    case "${1:-start}" in
      start)
        docker compose exec -d backend sh -c "npx prisma studio --browser none" && echo "Prisma Studio at http://localhost:51212"
        ;;
      stop)
        docker compose exec backend sh -c "pkill -f 'prisma studio' 2>/dev/null; echo 'studio stopped'"
        ;;
      *)
        echo "Usage: $0 studio {start|stop}"
        ;;
    esac
    ;;
  migrate)
    docker compose run --rm backend sh -c "npx prisma generate && npx prisma migrate dev"
    echo "[run] migration done"
    ;;
  deploy)
    docker compose run --rm backend sh -c "npx prisma generate && npx prisma migrate deploy"
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
