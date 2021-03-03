
# COVID-19 Vaccination Data

- All files are updated automatically every 4 hours hours ([update workflow](https://github.com/juancri/covid19-vaccination/actions?query=workflow%3Aupdate))
- Source: [DEIS](https://deis.minsal.cl/)

## [status.txt](status.txt)

Summary output from the update process

## [chile-vaccination.csv](chile-vaccination.csv)

Vaccines by region and dose

### Columns

- **Region:** Region of Chile or "*Total*", which is the sum of all regions.
- **Dose:** "*First*" or "*Second*"
- **Dates:** Other columns are dates in ISO format

### Values

The value of each cell is the total-to-date

## [chile-vaccination-comunas.csv](chile-vaccination-comunas.csv)

Vaccines by comuna and dose

### Columns

- **Comuna:** Comuna
- **Dose:** "*First*" or "*Second*"
- **Dates:** Other columns are dates in ISO format

### Values

The value of each cell is the total-to-date

## [chile-vaccination-type.csv](chile-vaccination-type.csv)

Vaccines by type and dose

### Columns

- **Type:** Vaccine type (eg: Pfizer, Sinovac)
- **Dose:** "*First*" or "*Second*"
- **Dates:** Other columns are dates in ISO format

### Values

The value of each cell is the total-to-date

## [chile-vaccination-ages.csv](chile-vaccination-ages.csv)

Vaccinations by population age and dose

### Columns

- **Age:** Population age range
- **Dose:** "*First*" or "*Second*"
- **Dates:** Other columns are dates in ISO format

### Values

The value of each cell is the total-to-date

## [chile-vaccination-ages-comunas.csv](chile-vaccination-ages-comunas.csv)

Vaccinations by comuna, population age and dose

### Columns

- **Comuna:** Comuna
- **Age:** Population age range
- **Dose:** "*First*" or "*Second*"
- **Dates:** Other columns are dates in ISO format

### Values

The value of each cell is the total-to-date

## [chile-vaccination-groups.csv](chile-vaccination-groups.csv)

Vaccinations by population risk groups

### Columns

- **Group:** Population risk group
- **Dose:** "*First*" or "*Second*"
- **Dates:** Other columns are dates in ISO format

### Values

The value of each cell is the total-to-date
