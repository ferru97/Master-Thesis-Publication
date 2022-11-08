#!/bin/bash
count=2
for i in $(seq $count); do
	echo "Installing expect on Oracle $i"
    node="chainlink_node$i"
    docker exec -it $node bash -c 'apt-get update; apt-get install expect -y; exit'
    echo "-----------------------------"
done
