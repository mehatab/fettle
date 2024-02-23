#!/bin/bash
set -e
commit=false
origin=$(git remote get-url origin)
if [[ $origin == *statsig-io/statuspage* ]]; then
  commit=false
fi

wget https://manager.aaf.edu.au/status/monitored_entities.json -O entities.json
entries=($(jq '.identity_providers[] | "\(.names[] | .value)=\(.entity_id)"' entities.json | grep "http" | sed -r 's/"|\(|\)//g' | sed -r 's/’| /_/g' | sed -r "s/'//g")) #| sed -r 's/\/idp\/shibboleth//g'))
rm entities.json

rm public/urls.cfg
envs=("development" "test" "production")
for env in "${envs[@]}"; do
  wget "https://aaf-$env-static-assets.s3.ap-southeast-2.amazonaws.com/directory.html" -O "$env".txt
  tmp_entries=($(cat "$env".txt | grep "href" | grep -v -e "private." | sed 's/.*href="\(.*\)">.*/\1/'))
  for entry in "${tmp_entries[@]}"; do
    entries+=("$(echo "$entry" | sed -r 's/https:\/\///g' | sed -r 's/\./_/g' | sed -r 's/\///g')=$entry")
  done
  rm "$env".txt
done

echo "***********************"

mkdir -p logs
for entry in "${entries[@]}"; do
  echo "$entry"
  key=$(echo "$entry" | cut -d'=' -f1)
  url=$(echo "$entry" | cut -d'=' -f2)
  echo "$entry" >>./public/urls.cfg

  echo "Starting health check for $key $url"
  # for i in {1..3}; do
  # TODO: Do we really want to retry multiple times?
  set +e
  response=$(curl -o /dev/null -s -w '%{http_code} %{time_total}' --silent --output /dev/null "$url")
  set -e
  http_code=$(echo "$response" | cut -d ' ' -f 1)
  time_total=$(echo "$response" | cut -d ' ' -f 2)
  echo "    $http_code $time_total"
  if [ "$http_code" -eq 200 ] || [ "$http_code" -eq 202 ] || [ "$http_code" -eq 301 ] || [ "$http_code" -eq 302 ] || [ "$http_code" -eq 307 ]; then
    result="success"
  else
    result="failed"
  fi
  # if [ "$result" = "success" ]; then
  #   break
  # fi
  # sleep 5
  # done
  dateTime=$(date +'%Y-%m-%d %H:%M')
  mkdir -p public/status
  echo "    $dateTime, $result, $time_total"
  echo "$dateTime, $result, $time_total" >>"public/status/${key}_report.log"
  tail -2000 "public/status/${key}_report.log" >"public/status/${key}_report.log.tmp"
  mv "public/status/${key}_report.log.tmp" "public/status/${key}_report.log"
done

if [[ $commit == true ]]; then
  echo "committing logs"
  git config --global user.name 'github-actions[bot]'
  git config --global user.email 'github-actions[bot]@users.noreply.github.com'
  git add -A --force public/status/
  git add -A --force public/urls.cfg
  git commit -am '[Automated] Update Health Check Logs'
  git push
fi
