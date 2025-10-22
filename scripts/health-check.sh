#!/bin/bash

# El script ya no maneja commits directamente
# El workflow de GitHub Actions se encarga de eso

declare -a KEYSARRAY
declare -a URLSARRAY

urlsConfig="public/urls.cfg"
echo "Reading $urlsConfig"
while IFS='=' read -r key url
do
  echo "  $key=$url"
  KEYSARRAY+=("$key")
  URLSARRAY+=("$url")
done < "$urlsConfig"

echo "***********************"
echo "Starting health checks with ${#KEYSARRAY[@]} configs:"

mkdir -p logs

for (( index=0; index < ${#KEYSARRAY[@]}; index++ ))
do
  key="${KEYSARRAY[index]}"
  url="${URLSARRAY[index]}"
  echo "  $key=$url"

  for i in {1..3}
  do
    response=$(curl -o /dev/null -s -w '%{http_code} %{time_total}' --silent --output /dev/null "$url")
    http_code=$(echo "$response" | cut -d ' ' -f 1)
    time_total=$(echo "$response" | cut -d ' ' -f 2)
    echo "    $http_code $time_total"
    if [ "$http_code" -eq 200 ] || [ "$http_code" -eq 202 ] || [ "$http_code" -eq 301 ] || [ "$http_code" -eq 302 ] || [ "$http_code" -eq 307 ]; then
      result="success"
    else
      result="failed"
    fi
    if [ "$result" = "success" ]; then
      break
    fi
    sleep 5
  done
  dateTime=$(date +'%Y-%m-%d %H:%M')
  mkdir -p public/status
  echo "$dateTime, $result, $time_total" >> "public/status/${key}_report.log"
  tail -2000 "public/status/${key}_report.log" > "public/status/${key}_report.log.tmp"
  mv "public/status/${key}_report.log.tmp" "public/status/${key}_report.log"
  echo "    $dateTime, $result, $time_total"
done

echo "Health check completed. Logs saved to public/status/"
echo "The GitHub Actions workflow will handle committing and creating a pull request."
