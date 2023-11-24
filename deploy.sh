#!/bin/bash
yarn build && \
rsync -av --delete ./build/. user@srv.yabx.net:tgbot// && \
curl -X DELETE "https://api.cloudflare.com/client/v4/zones/ae922fdea7c35963ff9e20e09a43bdcb/purge_cache" -H "Authorization: Bearer kpnikmf65DCTHDTdXPumvE6Dcq-G-0mG0Amb8ptg" -H "Content-Type:application/json" --data '{"purge_everything":true}' -o /dev/null -s && \
printf "\n\nDone in ${SECONDS} sec.\n"
