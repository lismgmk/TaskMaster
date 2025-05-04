COMPOSE=docker compose
ENV_FILE=.env
SERVICE=app

up:
	$(COMPOSE) up --build

down:
	$(COMPOSE) down -v

restart: down up

logs:
	$(COMPOSE) logs -f $(SERVICE)


