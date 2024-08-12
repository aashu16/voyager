#!/bin/sh
set -e

# Removes the volumes/ directory if one exists already.
# Useful when running tests locally.
if [ -d volumes ]; then
	rm -rf volumes
fi

USER_ID="$(id -u)" GROUP_ID="$(id -g)" docker compose up -d
