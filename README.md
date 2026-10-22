# NESST-tree-watering

The backend google sheet used to produce the map can be found here: https://docs.google.com/spreadsheets/d/17wqRM2MQVLbRcZiMKTLVl_Ypx7yZcrtEYcGHoowHypg/edit?usp=sharing

## How it fits together

- `Map-script` is the Google Apps Script bound to the sheet. NFC tags open its web app URL with `?id=<tree id>` to log a watering. `?view=data` returns the map data as JSON.
- `index.html` is the public map, served by GitHub Pages. It loads its data from the Apps Script `?view=data` endpoint.

### Setup

1. `DATA_URL` in `index.html` must be the Apps Script web app URL (ends in `/exec`). Keep it in sync if the deployment changes.
2. In the repo settings, under Pages, set the source to deploy from the `main` branch, root folder.
3. In Apps Script, under Project Settings > Script Properties:
   - `key`: the CARTO basemaps API key
   - `mapUrl` (optional): the GitHub Pages URL. Once set, the tap page links there and the old `?view=map` redirects there.
4. Optional, on the Summary sheet: `H1` is the number of days before a tree is overdue (default 7). `H2` is the rainfall in mm over 48 hours that counts as a watering (default 25).
