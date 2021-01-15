
## covid19-vaccination

Tracks vaccinations for SARS CoV-2 in Chile

### Releases

Since this process is not yet straightforward and the information published by DEIS MINSAL has changed through time, I run (and fix, if necessary) the code every day day and publish the updated data in [Releases](https://www.github.com/juancri/covid19-vaccination/releases). Check the last release [here](https://www.github.com/juancri/covid19-vaccination/releases/latest). Each release include the output file called `output.csv`.

### Format

The output file (`output.csv`) includes two rows:

- **Chile:** People vaccinated with the first dose
- **Chile2:** People vaccinated with the second dose

***Note:*** Even when I try to keep this data updated, I had to approximate the values for the following dates since I don't have exact data for that exact day:

- 2020-01-13

## Run it yourself

If you decide to run the code yourself...

### Requirements

- [Node 12.x](https://nodejs.org/en/)
- [tsc](https://www.typescriptlang.org/)
- [make](https://www.gnu.org/software/make/)

### Setup

- Run `npm install`

### Build

Run `make`

### Run

#### Process old JSON file (no longer works)

`node dist/process.js`

This will generate a new file: `output.csv`

#### Add new values to the spreadsheet

`node dist/add.js`

This will add the values to `output.csv`
