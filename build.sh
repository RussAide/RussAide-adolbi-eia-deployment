#!/bin/bash

echo "⚙️ Cache busting with VITE_APP_ID=$VITE_APP_ID"
echo "$VITE_APP_ID" > client/.cache-bust.txt

pnpm install --no-frozen-lockfile
pnpm run build
