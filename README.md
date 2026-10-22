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
   - `mapUrl` (optional): overrides the map address the tap page links to, and that old `?view=map` links redirect to. The default is the GitHub Pages URL.
4. Optional settings on the Summary sheet:
   - `H1`: days between waterings for a first-year tree (default 7)
   - `H2`: rainfall in mm over 48 hours that counts as a watering (default 25)
   - `H3` / `H4`: first and last month of the watering season, as a number or a name such as `May` (default May to September). Outside the season, the map shows no tree as needing water.
5. Optional on the Trees sheet: column F, `Planted`, takes a date or just a year. Trees are watered every `H1` days in their first year, 2×`H1` in the second, 4×`H1` in the third, and not on a schedule after that. A blank cell counts as first year. A year on its own counts as 31 December of that year.

`vendor/` holds Leaflet 1.9.4 and Leaflet.markercluster 1.5.3, served from GitHub Pages instead of a CDN.
