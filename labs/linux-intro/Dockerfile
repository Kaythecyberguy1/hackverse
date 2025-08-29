FROM ubuntu:22.04

RUN apt-get update && apt-get install -y \
    netcat curl vim iputils-ping \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /root
COPY flag_linux.txt /root/flag_linux.txt

CMD ["/bin/bash"]
