
## covid19-vaccination

Generates CSV file from DEIS vaccination report

## Requirements

- [Node 12.x](https://nodejs.org/en/)
- [tsc](https://www.typescriptlang.org/)
- [make](https://www.gnu.org/software/make/)

## Setup

1.- Run `npm install`
2.- Visit https://deis.minsal.cl
3.- Click on "Avance de Vacunación Campaña SARS-CoV-2"
4.- Open the dev tools of your web browser (eg: [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools))
5.- Look for the right JSON file. Usually the last file with the URL `jobs?...`
6.- Download the JSON file and place it in this directory with the name `data.json`

## Run

```
make
node process.js
```

This will generate a new file: `output.csv`



