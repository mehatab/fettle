
# AAF Status

# Usage

run `make run-checks`
then
make `run-dev`

## Deployment setup

Then, you need to enable GitHub Pages on your forked repository. You can do this by going to `Settings > Pages` and enabling it on the `main` branch.

In Build and deployment section select GitHub Actions.

## Change monitoring interval

If you want to change the time interval of monitoring then you can change it in `.github > workflows > health-check.yml` file.
update the cron time in the following line.

```yaml
    on:
      schedule:
        - cron: "0 0/12 * * *"
```

## Reporting your first incident

1. Go to issues tab
2. Create a new label `incident`
3. Create a issue
4. Add the label `incident` to the issue
