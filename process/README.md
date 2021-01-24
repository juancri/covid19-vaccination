
# Process

This program:

- Converts information from a JSON file grabbed from [DEIS](https://deis.minsal.cl/)
- Joins this information with the previous data stored in [chile-vaccination.csv](../output)
- Prints a human-friendly summary of the vaccination process to date

# Requirements

- [Node 12.x](https://nodejs.org/en/)
- [make](https://www.gnu.org/software/make/)

## Setup

### Install dependencies

Run `npm install`

### Download JSON file

- Go to the [DEIS website)[]
- Click on "*Avance de Vacunación Campaña SARS-CoV-2*" ([last known URL](https://informesdeis.minsal.cl/SASVisualAnalytics/?reportUri=%2Freports%2Freports%2F1a8cc7ff-7df0-474f-a147-929ee45d1900&sectionIndex=0&sso_guest=true&reportViewOnly=true&reportContextBar=false&sas-welcome=false))
- Inspect the network activity ([Google Chrome](https://developers.google.com/web/tools/chrome-devtools/network))
- Reload the page to allow the network activity monitor to populate
- Looks for the right `jobs` file. You can find it by searching for `Arica y Parinacota` in its contents.
- Download the file -by copying the data or by using cURL- to `data.json` in this directory

## Build

Run `make`

## Run

`node dist/main.js`

This will modify the files in the [output](../output) directory.
