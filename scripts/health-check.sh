#!/bin/bash
set -e

start=$SECONDS

commit=false
origin=$(git remote get-url origin)
if [[ $origin == *statsig-io/statuspage* ]]; then
  commit=false
fi

entries=()

#  TODO turn into envs
entity_urls=(
  "https://manager.aaf.edu.au/status/monitored_entities.json"
  "https://manager.test.aaf.edu.au/status/monitored_entities.json"
  "https://manager.dev.aaf.edu.au/status/monitored_entities.json"
)

for entity_url in "${entity_urls[@]}"; do
  wget "$entity_url" -O entities.json
  entries+=($(jq '.identity_providers[] | "\(.names[] | .value)=\(.entity_id)"' entities.json | grep "http" | sed -r 's/"|\(|\)//g' | sed -r 's/’| /_/g' | sed -r "s/'//g")) #| sed -r 's/\/idp\/shibboleth//g'))
  rm -f entities.json
done

#  TODO turn into envs
directory_urls=(
  "https://aaf-development-static-assets.s3.ap-southeast-2.amazonaws.com/directory.html"
  "https://aaf-test-static-assets.s3.ap-southeast-2.amazonaws.com/directory.html"
  "https://aaf-production-static-assets.s3.ap-southeast-2.amazonaws.com/directory.html"
  "https://aaf-jisc-static-assets.s3.eu-west-2.amazonaws.com/directory.html"
)
for directory_url in "${directory_urls[@]}"; do
  wget "$directory_url" -O directory.txt
  tmp_entries=($(cat directory.txt | grep "href" | grep -v -e "status." | grep -v -e "private." | sed 's/.*href="\(.*\)">.*/\1/'))
  for entry in "${tmp_entries[@]}"; do
    entries+=("$(echo "$entry" | sed -r 's/https:\/\///g' | sed -r 's/\./_/g' | sed -r 's/\///g')=$entry")
  done
  rm -f directory.txt
done

sorted_unique_entries=($(echo "${entries[@]}" | tr ' ' '\n' | sort -u | tr '\n' ' '))

failures=()
mkdir -p logs
for entry in "${sorted_unique_entries[@]}"; do
  key=$(echo "$entry" | cut -d'=' -f1)
  url=$(echo "$entry" | cut -d'=' -f2)

  # special case only health endpoint works for 200
  if [[ "$entry" == *"access"* ]]; then
    url=$(echo "$entry" | cut -d'=' -f2)/health
  fi

  echo "$entry" >>./public/urls.cfg.tmp
  echo ""
  echo "$key $url"
  set +e
  response=$(curl -m 3 -o /dev/null -s -w '%{http_code} %{time_total}' --silent --output /dev/null "$url")
  set -e
  http_code=$(echo "$response" | cut -d ' ' -f 1)
  time_total=$(echo "$response" | cut -d ' ' -f 2)
  res_string="$http_code $time_total"
  echo "    $res_string"
  if [ "$http_code" -eq 200 ] || [ "$http_code" -eq 202 ] || [ "$http_code" -eq 301 ] || [ "$http_code" -eq 302 ] || [ "$http_code" -eq 307 ]; then
    result="success"
  else
    result="failed"
    failures+=($(echo "$key $url ($res_string)" | sed -r 's/ /~~~~/g'))
  fi
  dateTime=$(date +'%Y-%m-%d %H:%M')
  mkdir -p public/status
  echo "    $dateTime, $result, $time_total"
  echo "$dateTime, $result, $time_total" >>"public/status/${key}_report.log"
  #  TODO: Do we care about size?
  # tail -2000 "public/status/${key}_report.log" >"public/status/${key}_report.log.tmp"
  # mv "public/status/${key}_report.log.tmp" "public/status/${key}_report.log"
done

mv public/urls.cfg.tmp public/urls.cfg

if [[ $commit == true ]]; then
  echo "committing logs"
  git config --global user.name 'github-actions[bot]'
  git config --global user.email 'github-actions[bot]@users.noreply.github.com'
  git add -A --force public/status/
  git add -A --force public/urls.cfg
  git commit -am '[Automated] Update Health Check Logs'
  git push
fi

notify() {
  json="{
        \"attachments\": [{
            \"color\": \"#E96D76\",
            \"blocks\": [
            {
                \"type\": \"section\",
                \"text\": {
                \"type\": \"plain_text\", 
                \"text\": \"$1\",
                \"emoji\": true
                }
            }
            ]
        }]
    }"

  curl -H 'Content-Type: application/json' -X POST -d "$json" "$SLACK_WEBHOOK_URL"
}

if [ "${failures[*]}" != "" ] && [ "$SLACK_WEBHOOK_URL" != "" ]; then
  failure_string="The Following endpoints are failing: $(echo "${failures[*]}" | xargs printf -- '\n * \0%s\0' | sed -r 's/~~~~/ /g')"
  notify "$failure_string"
fi

echo "Finished in $((SECONDS - start))"

# TODO:
# Can we make the non unique values uniquely named? i.e two vho's
# make the urls above envs
# get the page up and running on an anonnymus ur
