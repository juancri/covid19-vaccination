
# Process

This program:

- Downloads reports from [DEIS](https://deis.minsal.cl/)
- Generates CSV output files (See [output](../output))
- Prints a human-friendly summary of the vaccination process to date

# Requirements

- [Node 18.x](https://nodejs.org)
- [GNU Make](https://www.gnu.org/software/make/)

## Setup

### Install dependencies

Run `npm install`

## Build

Run `make`

## Run

`node dist/main.js`

This will modify the files in the [output](../output) directory.
