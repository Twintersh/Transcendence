help:
	@echo "Usage: make [target]"
	@echo "Targets:"
	@echo "  volumes: Create volumes"
	@echo "  clean: Remove volumes and containers"
	@echo "  stop: Stop containers"
	@echo "  re: Rebuild containers and run production mode"
	@echo "  prod: Run in production mode"
	@echo "  dev: Run in development mode"
	
volumes:
	@mkdir -p volumes/db volumes/redis
	
clean:
	@docker compose down -v
	@sudo rm -rf volumes
	@docker system prune -af
	# @docker stop $(docker ps -a -q)
	# @docker rm $(docker ps -a -q)
	@/etc/init.d/redis-server stop
	
stop:
	@docker compose down

re: clean volumes prod

prod: volumes
	sed -i '1s/[^ ]*[^ ]/true/5' frontend/angular/src/env.ts
	sed -i "s/-ipserver-/`ifconfig enp0s3 | grep -oP 'inet\s+\K[\d.]+'`/g" .env
	sed -i "s/-ipserver-/`ifconfig enp0s3 | grep -oP 'inet\s+\K[\d.]+'`/g" frontend/angular/src/env.ts
	@docker compose -f docker-compose.prod.yml up --build

dev: volumes
	sed -i '1s/[^ ]*[^ ]/false/5' frontend/angular/src/env.ts
	sed -e 's/[^ ]*[^ ]/was/5' frontend/angular/src/env.ts
	@docker compose -f docker-compose.yml up