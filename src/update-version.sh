#!/bin/bash
# 🧩 Atualiza automaticamente o version.ts com a data e o commit atual
VERSION="v$(date +%Y.%m.%d)"
COMMIT_HASH="$(git rev-parse --short HEAD)"
cat << EOL > src/version.ts
export const APP_VERSION = "${VERSION}";
export const COMMIT_HASH = "${COMMIT_HASH}";
EOL
echo "✅ version.ts atualizado para ${VERSION} (${COMMIT_HASH})"
