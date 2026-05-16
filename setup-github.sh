#!/usr/bin/env bash
# ETG site — one-time GitHub setup
# Run this script from inside the unzipped etg-site folder.
#
# Usage:
#   chmod +x setup-github.sh
#   ./setup-github.sh

set -e  # Stop on any error

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  ETG SITE — GITHUB SETUP"
echo "═══════════════════════════════════════════════════════════"
echo ""

# 1. Check git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git isn't installed."
    echo ""
    echo "   On Mac:    brew install git"
    echo "                or:  xcode-select --install"
    echo "   On Windows: download from https://git-scm.com/download/win"
    exit 1
fi

echo "✓ Git is installed ($(git --version))"
echo ""

# 2. Ask for the GitHub repo URL
echo "Step 1 of 2:  Paste your GitHub repository URL."
echo ""
echo "   Example:  https://github.com/yourname/etg-site.git"
echo "   (Get this from your repo page — click the green 'Code' button)"
echo ""
read -p "Repo URL: " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "❌ No URL entered. Run the script again when you have it."
    exit 1
fi

echo ""
echo "Step 2 of 2:  Optional commit message (press Enter for default)."
echo ""
read -p "Commit message [Initial ETG site build]: " COMMIT_MSG
COMMIT_MSG=${COMMIT_MSG:-"Initial ETG site build"}

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  RUNNING..."
echo "═══════════════════════════════════════════════════════════"
echo ""

# 3. Initialize git
if [ -d ".git" ]; then
    echo "→ Git already initialized in this folder, skipping init."
else
    echo "→ Initializing git..."
    git init
fi

# 4. Make sure we're on 'main' branch
echo "→ Setting branch to main..."
git branch -M main

# 5. Stage everything
echo "→ Staging files..."
git add .

# 6. Commit
echo "→ Committing..."
git commit -m "$COMMIT_MSG" || echo "  (nothing new to commit)"

# 7. Wire up the remote
if git remote get-url origin &> /dev/null; then
    echo "→ Updating remote..."
    git remote set-url origin "$REPO_URL"
else
    echo "→ Adding remote..."
    git remote add origin "$REPO_URL"
fi

# 8. Push
echo "→ Pushing to GitHub..."
echo ""
echo "  (You may be asked for your GitHub username + a Personal Access Token."
echo "   The token replaces your password — see notes if you don't have one.)"
echo ""

if git push -u origin main; then
    echo ""
    echo "═══════════════════════════════════════════════════════════"
    echo "  ✓ DONE"
    echo "═══════════════════════════════════════════════════════════"
    echo ""
    echo "  Your site is now on GitHub at:"
    echo "    $REPO_URL"
    echo ""
    echo "  If Vercel is connected to this repo, it should auto-deploy"
    echo "  in 30-60 seconds. Check your Vercel dashboard."
    echo ""
else
    echo ""
    echo "═══════════════════════════════════════════════════════════"
    echo "  ⚠  PUSH FAILED"
    echo "═══════════════════════════════════════════════════════════"
    echo ""
    echo "  The most common cause: the GitHub repo already has commits"
    echo "  (a README, or earlier upload attempts)."
    echo ""
    echo "  If you want to OVERWRITE everything in the GitHub repo with"
    echo "  these local files, run this command:"
    echo ""
    echo "    git push -u origin main --force"
    echo ""
    echo "  Other common issue: authentication."
    echo "  GitHub no longer accepts passwords for git push."
    echo "  Use a Personal Access Token instead:"
    echo "    1. Go to github.com → Settings → Developer settings"
    echo "    2. Personal access tokens → Tokens (classic) → Generate new"
    echo "    3. Check the 'repo' scope, generate, copy the token"
    echo "    4. Use the token as your password when git asks"
    echo ""
fi
