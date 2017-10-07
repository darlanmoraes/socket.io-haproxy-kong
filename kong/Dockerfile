FROM kong:0.10.3

COPY kong-entrypoint.sh /kong-entrypoint.sh
ENTRYPOINT [ "/kong-entrypoint.sh" ]

CMD [ "kong", "start" ]