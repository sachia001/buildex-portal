# syntax=docker/dockerfile:1

# ---------- Stage 1: builder ----------
# Build the React client and install server production deps with a reproducible lockfile.
FROM node:20-slim AS builder

WORKDIR /app

# Install server dependencies (incl. dev) — reproducible via lockfile.
COPY package*.json ./
RUN npm ci

# Install client dependencies — reproducible via lockfile.
COPY client/package*.json ./client/
RUN cd client && npm ci

# Copy the rest of the source (filtered by .dockerignore).
COPY . .

# Build the React client fresh from source.
# CI=false: ESLint warnings must not fail the production build.
# GENERATE_SOURCEMAP=false: do not ship source maps in the production bundle (PERF-014).
ENV CI=false
ENV GENERATE_SOURCEMAP=false
RUN cd client && npm run build

# Prune server dependencies down to production-only for the runtime image (OPS-003).
RUN npm ci --omit=dev

# ---------- Stage 2: runtime ----------
# Slim runtime image — only production deps, built client, and server source.
FROM node:20-slim AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Own /app with the unprivileged built-in "node" user so the app can create the
# ephemeral uploads/* directories at startup (server.js mkdirSync) without root.
RUN chown -R node:node /app

# Production-only node_modules from the builder stage.
COPY --from=builder --chown=node:node /app/node_modules ./node_modules

# Server source.
COPY --chown=node:node server.js ./
COPY --chown=node:node package*.json ./

# Built client bundle served by server.js (server.js:2160 serves client/build).
COPY --from=builder --chown=node:node /app/client/build ./client/build

# Controlled accreditation documents (QM/BE-PR/BE-WI/HR-JD/BE-FM/BE-POL/RM/ORD) —
# version-controlled and bundled into the image so seedProcedures populates them
# deterministically on boot (the document library = the accreditation document set).
COPY --from=builder --chown=node:node /app/uploads/procedures ./uploads/procedures

# Run as the unprivileged built-in "node" user (OPS-003 — no root in runtime).
USER node

EXPOSE 8080

CMD ["node", "server.js"]
