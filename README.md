# Superjoy API Gateway (Zuplo)

Zuplo project that fronts the Joy gateway. Proxies the OpenAI Responses API to
`superjoy-joy-gateway.fly.dev`, so all fleet LLM traffic runs through Zuplo for
auth, rate limiting, and observability.

Routes:
- `POST /v1/responses` → gateway `/v1/responses` (streaming)
- `GET  /v1/models`    → gateway `/v1/models`
- `GET  /health`       → gateway `/health`

Point the fleet at this gateway's URL:
  Windmill `f/superjoy/llm_openai_base_url = https://<zuplo-url>/v1`

Add auth (API-key policy) + rate-limit policies per route in config/routes.oas.json
to gate and meter per machine.
