#!/bin/bash
directory=build
branch=gh-pages
build_command() {
  yarn hardhat compile && rm -r ./src/artifacts && mv ./artifacts ./src && yarn build
}

trap ctrl_c INT

function ctrl_c() {
  rm -rf $directory/.git
  git worktree prune || true
}

set -e

if [ -n "$(git status --untracked-files=no --porcelain)" ]; then
  echo "Please commit or stash changes before deploy."
  exit 1
fi

echo -e "\033[0;32mDeleting existing $branch...\033[0m"
rm -rf $directory/.git
git worktree prune || true
git push origin --delete $branch || true
git branch -D $branch || true

echo -e "\033[0;32mSetting up new $branch branch\033[0m"
git checkout --orphan $branch
git reset --hard
git commit --allow-empty -m "Init"
git checkout master

echo -e "\033[0;32mDeleting old content...\033[0m"
rm -rf $directory

echo -e "\033[0;32mChecking out $branch....\033[0m"
git worktree add $directory $branch

echo -e "\033[0;32mGenerating site...\033[0m"
build_command
echo "gitdir: ../.git/worktrees/${directory}" >> ./$directory/.git

echo -e "\033[0;32mDeploying $branch branch...\033[0m"
cd $directory &&
  git add --all &&
  git commit -m "Deploy updates" &&
  git push origin $branch

echo -e "\033[0;32mCleaning up...\033[0m"
git worktree remove $directory
