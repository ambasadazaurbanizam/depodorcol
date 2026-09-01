# Depo Dorćol — Belgrade Museum of Public Transport

Standalone Vinext/React source for the digital-first museum landing page published at depodorcol.rs.

## Local development

```bash
pnpm install
pnpm dev
```

## Production build

```bash
pnpm build
```

The physical museum is not currently open to visitors. Dorćol Depot is presented as the museum's future permanent home.

## Docker: local run

Build and run with Docker Compose:

```bash
docker compose -f docker-compose.local.yml up --build
```

Open:

```text
http://localhost:3000
```

Stop and remove the local container:

```bash
docker compose -f docker-compose.local.yml down
```

## Docker: production stack

This repository includes:

- `Dockerfile`: multi-stage build for the app.
- `docker-compose.prod.yml`: app + dedicated Caddy reverse proxy (uses host ports 80/443).
- `docker-compose.prod.app.yml`: app-only deployment for servers that already run Caddy/Nginx.
- `deploy/Caddyfile`: serves `depodorcol.rs` and redirects `depo.ambasada.online`.
- `deploy/Caddyfile.snippet`: Caddy snippet for existing host-level Caddy setup.

Run production stack:

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

If your VPS already has Caddy/Nginx on ports 80/443, run app-only stack instead:

```bash
docker compose -f docker-compose.prod.app.yml up -d --build
```

Then add rules from `deploy/Caddyfile.snippet` to your existing reverse-proxy configuration.

Check status:

```bash
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f --tail=100
```

## VPS setup from scratch (Ubuntu/Debian)

1) Install Docker and Compose plugin:

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo \
	"deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
	$(. /etc/os-release && echo $VERSION_CODENAME) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER
newgrp docker
```

2) Clone and start:

```bash
mkdir -p ~/projects
cd ~/projects
git clone https://github.com/<your-org-or-user>/depodorcol.git
cd depodorcol
docker compose -f docker-compose.prod.app.yml up -d --build
```

3) DNS records (at your DNS provider):

- `depodorcol.rs` -> A record to your VPS public IPv4
- `www.depodorcol.rs` -> CNAME to `depodorcol.rs`
- `depo.ambasada.online` -> A record to your VPS public IPv4

4) Configure Caddy on the VPS:

- If this project owns ports 80/443, use `deploy/Caddyfile` with `docker-compose.prod.yml`.
- If another Caddy is already running (your current VPS case), copy rules from `deploy/Caddyfile.snippet` into that existing Caddy config and reload Caddy.

5) Verify:

```bash
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f --tail=100 caddy
```

For app-only mode verification:

```bash
docker compose -f docker-compose.prod.app.yml ps
curl -I http://127.0.0.1:3010
```

When DNS is propagated and Caddy is reloaded, HTTPS certificates are provisioned automatically and redirect to `https://depodorcol.rs` is applied.
