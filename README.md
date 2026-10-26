# NESST-tree-watering

The backend google sheet used to produce the map can be found here: https://docs.google.com/spreadsheets/d/17wqRM2MQVLbRcZiMKTLVl_Ypx7yZcrtEYcGHoowHypg/edit?usp=sharing

## How it fits together

- `Map-script` is the Google Apps Script bound to the sheet. NFC tags open its web app URL with `?id=<tree id>` to log a watering. `?view=data` returns the map data as JSON.
- `index.html` is the public map, served by GitHub Pages. It loads its data from the Apps Script `?view=data` endpoint.

### Season preview

Add `?preview` to the map link to show a toggle between today's view, the in-season view and the out-of-season view. Use `?preview=in` or `?preview=out` to open straight in one of them. A previewed view is labelled "Preview — not the real status". The toggle stays hidden on the normal link.
