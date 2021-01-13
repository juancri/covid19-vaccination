
## covid19-vaccination

Generates CSV file from DEIS vaccination report.

### Releases

Since this process is not yet straightforward, I run it every day and publish the updated data in [Releases](https://www.github.com/juancri/covid19-vaccination/releases). Check the last release [here](https://www.github.com/juancri/covid19-vaccination/releases/latest). Each release include the output file called `output.csv`.

## Requirements

- [Node 12.x](https://nodejs.org/en/)
- [tsc](https://www.typescriptlang.org/)
- [make](https://www.gnu.org/software/make/)

## Setup

- Run `npm install`
- Visit https://deis.minsal.cl
- Click on "Avance de Vacunación Campaña SARS-CoV-2"
- Open the dev tools of your web browser (eg: [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools))
- Look for the right JSON file. Usually the last file with the URL `jobs?...`
- Download the JSON file and place it in this directory with the name `data.json`

## Build

Run `make`

## Run

`node dist/process.js`

This will generate a new file: `output.csv`
