#!/bin/bash

#Define cleanup procedure
cleanup() {
	echo "Container stopped, performing cleanup..."
}

#Trap SIGTERM
trap cleanup TERM

#Execute a command
"${@}" &

#Wait
wait $!