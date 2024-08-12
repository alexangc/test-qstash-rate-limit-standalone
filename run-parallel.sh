#!/bin/bash

# The output will be shown in the terminal after the script finishes executing
# There may be a broken character at the end, I'm not sure what it is but it
# doesn't seem to matter
for i in {1..5}
do
    echo "Running iteration $i"
    npx tsx src/main.ts &
done
