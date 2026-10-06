# Site vitrine CliniquePro : image de production (Next.js standalone)

FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --no-audit --no-fund

FROM node:24-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Les variables NEXT_PUBLIC_* sont figées dans le code au moment du build
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_BOOKING_URL
ARG GOOGLE_SITE_VERIFICATION
ARG BING_SITE_VERIFICATION
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL NEXT_PUBLIC_BOOKING_URL=$NEXT_PUBLIC_BOOKING_URL
ENV GOOGLE_SITE_VERIFICATION=$GOOGLE_SITE_VERIFICATION BING_SITE_VERIFICATION=$BING_SITE_VERIFICATION
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs
COPY --from=build --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nextjs /app/.next/static ./.next/static
COPY --from=build --chown=nextjs:nextjs /app/public ./public
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
