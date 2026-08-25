#!/bin/bash

# AWS Configuration
S3_BUCKET="indian-tax-calculator-1787591375571"
CF_DISTRIBUTION_ID="E173S58RV0JCO0"
REGION="us-east-1"

echo "🚀 Starting deployment to AWS..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Step 1: Sync dist/ to S3
echo "📤 Uploading files to S3 bucket: $S3_BUCKET"
aws s3 sync dist/ s3://$S3_BUCKET/ \
  --region $REGION \
  --delete \
  --cache-control "public, max-age=3600" \
  --metadata "deployment=$(date +%Y-%m-%d-%H:%M:%S)"

if [ $? -eq 0 ]; then
  echo "✅ Files uploaded successfully"
else
  echo "❌ Upload failed"
  exit 1
fi

# Step 2: Invalidate CloudFront cache
echo ""
echo "🔄 Invalidating CloudFront cache for distribution: $CF_DISTRIBUTION_ID"
INVALIDATION_ID=$(aws cloudfront create-invalidation \
  --distribution-id $CF_DISTRIBUTION_ID \
  --paths "/*" \
  --query 'Invalidation.Id' \
  --output text)

if [ $? -eq 0 ]; then
  echo "✅ Cache invalidation initiated"
  echo "   Invalidation ID: $INVALIDATION_ID"
else
  echo "❌ Cache invalidation failed"
  exit 1
fi

# Step 3: Get deployment details
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 DEPLOYMENT SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ S3 Bucket: $S3_BUCKET"
echo "✅ Region: $REGION"
echo "✅ CloudFront Distribution: $CF_DISTRIBUTION_ID"
echo "✅ Invalidation ID: $INVALIDATION_ID"
echo ""
echo "🌐 LIVE URLS:"
echo "   • S3 (HTTP):     http://$S3_BUCKET.s3-website-$REGION.amazonaws.com"
echo "   • CloudFront:    https://d$(aws cloudfront get-distribution --id $CF_DISTRIBUTION_ID --query 'Distribution.DomainName' --output text)"
echo ""
echo "⏱️  Cache invalidation processing..."
echo "    (Typically completes within 1-5 minutes)"
echo ""
echo "✨ Deployment complete! Website will be updated globally shortly."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

