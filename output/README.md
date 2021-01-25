
# COVID-19 Vaccination Data

## chile-vaccination.csv

This file includes data about the total of vaccines reported by [DEIS](https://deis.minsal.cl/).

This file is updated daily (around 00:00 UTC).

### Columns

- **Region:** Region of Chile or "*Total*", which is the sum of all regions.
- **Dose:** "*First*" or "*Second*"
- **Dates:** Other columns are dates in ISO format

### Values

The value of each cell can be a number of total-to-date or empty if there's no information. Since we didn't track vaccinations per region before Jan 23, 2021, values for previous dates are empty for specific regions. Only *Total* rows have values.
