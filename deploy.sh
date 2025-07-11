#!/bin/bash

# ✅ CONFIGURACIÓN
BUCKET="app.domoticore.co"
CLOUDFRONT_DISTRIBUTION_ID="E9CHRVDAPUWAM"

echo "🚀 Iniciando build de la aplicación React..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Error en build. Abortando."
  exit 1
fi

echo "📦 Subiendo archivos a S3: s3://$BUCKET"
aws s3 sync build/ s3://$BUCKET/ --delete

if [ $? -ne 0 ]; then
  echo "❌ Error al subir archivos a S3. Abortando."
  exit 1
fi

echo "🔄 Invalidando caché en CloudFront (ID: $CLOUDFRONT_DISTRIBUTION_ID)..."
aws cloudfront create-invalidation \
  --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
  --paths "/*"

if [ $? -eq 0 ]; then
  echo "✅ Deploy completado con éxito."
else
  echo "⚠️ Archivos subidos, pero fallo al invalidar caché."
fi
