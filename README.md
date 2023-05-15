
# Fettle 💟 

**Fettle** is the open-source status page, powered entirely by GitHub Actions, Issues, and Pages.

<img src="./public/ss.png" />


# Usage
First of all, you need to fork this repository.

Update the urls and name in `urls.cfg` file present in `public > urls.cfg` file.

```text
Google=https://google.com
Facebook=https://facebook.com
```

Then, you need to enable GitHub Pages on your forked repository. You can do this by going to `Settings > Pages` and enabling it on the `main` branch.

In Build and deployment section select GitHub Actions.


If you want to change the time interval of monitoring then you can change it in `.github > workflows > health-check.yml` file.
update the cron time in the following line.

```yaml
    on:
      schedule:
        - cron: "0 0/12 * * *"
```

# How it works

- Hosting
    - GitHub Pages is used for hosting the status page.

- Monitoring
    - Github Workflow will be triggered every 1 Hr (Configurable) to visit the website.
    - Response status and response time is commited to github repository.

- Incidents
    - Github issue is used for incident management.

# Contributing
Feel free to submit pull requests and/or file issues for bugs and suggestions.