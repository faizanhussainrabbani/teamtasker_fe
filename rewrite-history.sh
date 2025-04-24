#!/bin/bash

# Make sure we're in the repository root
cd "$(git rev-parse --show-toplevel)" || exit 1

# Create a temporary clone to work with
TEMP_DIR=$(mktemp -d)
git clone --local . "$TEMP_DIR"
cd "$TEMP_DIR" || exit 1

# Use git-filter-repo to rewrite history
git filter-repo --use-mailmap --mailmap ../.mailmap

# Push the rewritten history back to the original repository
cd .. || exit 1
git remote add temp "$TEMP_DIR"
git fetch temp
git reset --hard temp/develop

# Clean up
rm -rf "$TEMP_DIR"
git remote remove temp

echo "History has been rewritten. All commits now use the identity specified in .mailmap."
echo "You will need to force push this to your remote repository with: git push -f origin develop"
