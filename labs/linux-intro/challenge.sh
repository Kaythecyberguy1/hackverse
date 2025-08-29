!/bin/bash


cat <<'BANNER'
======================================
Welcome to the Intro to Linux Lab!
======================================


Try basic commands:
ls, cd, cat, pwd, whoami


Goal: find the hidden flag in this container.
Hint: it's somewhere under /challenge
When you find it, submit via the web UI.
BANNER


# Keep container alive for exploration
while true; do sleep 3600; done
