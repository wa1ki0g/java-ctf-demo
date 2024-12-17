#!/bin/bash

# 启动 MySQL 服务
service mysql start

# 等待 MySQL 服务启动完成，设置超时为 30 秒
TIMEOUT=30
START_TIME=$(date +%s)

while ! mysqladmin ping --silent; do
  sleep 1
  CURRENT_TIME=$(date +%s)
  ELAPSED_TIME=$((CURRENT_TIME - START_TIME))
  
  if [ $ELAPSED_TIME -gt $TIMEOUT ]; then
    echo "MySQL failed to start within the timeout period."
    exit 1
  fi
done

# 启动 Java 应用程序
java -jar /tmp/ctf-0.0.1-SNAPSHOT.jar
