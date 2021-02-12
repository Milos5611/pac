#!/usr/bin/env bash

function buildImages() {
    for d in ./api/ ./client/ ; do /bin/zsh -c "(cd "$d" && npm run docker:build)"; done
}

buildImages "ls -al"