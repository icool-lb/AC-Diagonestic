# AC Fault DB Wave 4 Coverage

## Totals
- Total records: 185
- Brands covered: 11
- Official/regional-official sources indexed: 16

## Records by brand
- AUX: 25
- Beko: 11
- Daikin: 26
- Gree: 33
- Haier: 16
- Hisense: 13
- LG: 2
- Midea: 42
- Mitsubishi Electric: 8
- Samsung: 4
- Vestel: 5

## Methodology
- Model-first structure: brand → unit_type → technology → series → model_family → code.
- Only codes with a direct official or regional-official trace were added in Wave 4.
- User-manual-level sources (e.g. some Vestel/Beko codes) are kept, but flagged through source_type/notes so they can later be upgraded with service-manual evidence.
- Samsung and LG remain deliberately narrower because the official public pages found during this wave expose fewer explicit code meanings than Midea/Gree/Daikin/AUX.

## New in Wave 4
- Added 67 new records beyond Wave 3.
- Added richer metadata: source_key, source_url, source_type, confidence, notes.
- Added CSV export and SQL seed file.
- Added a minimal searchable Next.js front-end suitable for GitHub/Vercel deployment.