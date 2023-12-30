FROM node:18.13

WORKDIR /app

USER root
RUN chown -R 1000:1000 "/root/.npm"
USER 1000:1000

EXPOSE 3000

ENV COMMAND="npm run dev"

CMD [ -d "node_modules" ] && ${COMMAND} || npm ci && ${COMMAND}
