# NESST-tree-watering

The backend google sheet used to produce the map can be found here: https://docs.google.com/spreadsheets/d/17wqRM2MQVLbRcZiMKTLVl_Ypx7yZcrtEYcGHoowHypg/edit?usp=sharing

## How it fits together

- `Map-script` is the Google Apps Script bound to the sheet. NFC tags open its web app URL with `?id=<tree id>` to log a watering. `?view=data` returns the map data as JSON.
- `index.html` is the public map, served by GitHub Pages at https://nesst-trees.github.io/NESST-tree-watering/. It loads its data from the Apps Script `?view=data` endpoint. If the address changes, update `MAP_PAGE_URL` in `Map-script` too (the tap page links to the map and loads Leaflet from it).

## The sheet

- **Trees**: one row per tree. `Tree ID` is what the NFC tag links to, so never renumber or reuse one. `Planted` can be a planting season (`Winter 25/26`, counted as planted on 1 March 2026), a date or a year. `Responsibility` is `Amey` or `Community - until <month> <year>`.
- **Log**: one row per tag tap. `Litres` is filled in only if the volunteer picks an amount on the tap page; blank counts as the default amount.
- **Summary** settings (column H, blank means the default):
  - H1: base watering interval in days (7)
  - H2: rain in 48 h that counts as a watering, in mm (25)
  - H3 / H4: first and last month of the watering season (May / Sep)
  - H5: drought mode, `on` or `off`
  - H6: litres assumed when no amount is picked (5)

## Watering priority

How often a tree needs the community to water it depends on its age, who looks after it and whether drought mode is on (base interval 7 days):

| Tree age | Community | Community, drought | Amey | Amey, drought |
|---|---|---|---|---|
| 1st year after planting | 7 days | 4 days | Amey only | 7 days |
| 2nd year | 14 days | 7 days | Amey only | 14 days |
| 3rd year | 28 days | 14 days | Amey only | 28 days |
| Established | none | 28 days | none | none |

Amey waters its trees weekly, so in a drought they need a community top-up on the normal schedule. Drought mode also switches watering on outside the season. During the season, trees with no watering yet count from the 1st of the month the season started.

The map's "trees need water" list is sorted by urgency: days since watering ÷ the tree's interval. A tree in its first year therefore comes ahead of an older tree that has been dry for the same time.

After changing `Map-script`, paste it into the Apps Script editor and publish a new version of the existing deployment (Deploy > Manage deployments > Edit > New version), so the web app URL on the tags stays the same.

### Demo controls (season and drought preview)

For now the map always shows a small demo panel with two switches: Season (In / Out) and Drought (Off / On). Each switch starts on the real state; picking the other option previews it, and picking the real one again returns to it. Nothing in the sheet changes. Links can open a view directly: `?preview=in`, `?preview=out`, `?drought=on`, `?drought=off`.

To hide the panel again, set `DEMO_CONTROLS = false` in `index.html`. After that, only links containing `?preview` or `?drought` show it.

On the map, community trees are circles and Amey trees are smaller circles. Newly planted (1st year) trees that are 2 or more days overdue get a "!" badge.
