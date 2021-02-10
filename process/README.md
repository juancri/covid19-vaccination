
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

## Build

Run `make`

## Run

`node dist/main.js`

This will modify the files in the [output](../output) directory.
