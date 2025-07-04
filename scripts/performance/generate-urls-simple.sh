#!/bin/bash

# Simple URL generator for GitHub Actions debugging
echo "📊 Simple URL generator started"

# Basic parameter check
if [ $# -lt 2 ]; then
  echo "Usage: $0 <config> <env>"
  exit 1
fi

CONFIG="$1"
ENV="$2"

echo "Config: $CONFIG, Env: $ENV"

# Set base URL
if [ "$ENV" = "local" ]; then
  BASE="http://localhost:4321"
else
  BASE="https://flikary.dev"
fi

echo "Base URL: $BASE"

# Generate URLs
URLS="[\"$BASE/\", \"$BASE/resume\", \"$BASE/archives\"]"
NAMES="[\"홈페이지\", \"이력서\", \"아카이브\"]"

echo "URLs: $URLS"
echo "Names: $NAMES"

# Output to GitHub Actions
if [ -z "${GITHUB_OUTPUT:-}" ]; then
  echo "GITHUB_OUTPUT not set, creating temporary file"
  GITHUB_OUTPUT="/tmp/github_output_simple_$$"
  touch "$GITHUB_OUTPUT"
fi

echo "Writing to GITHUB_OUTPUT: $GITHUB_OUTPUT"
echo "test_urls=$URLS" >> "$GITHUB_OUTPUT"
echo "page_names=$NAMES" >> "$GITHUB_OUTPUT"

echo "Contents written to GITHUB_OUTPUT:"
cat "$GITHUB_OUTPUT" 2>/dev/null || echo "Failed to read file"

echo "Simple generator completed" 