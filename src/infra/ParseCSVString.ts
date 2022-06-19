/* eslint-disable no-cond-assign, no-var, prefer-destructuring, prefer-regex-literals */
// https://stackoverflow.com/questions/1293147/javascript-code-to-parse-csv-data
import type {RawObject} from "../types";

export const CSVToArray = (strData: string, strDelimiter = ","): string[][] => {
    // Create a regular expression to parse the CSV values.
    const objPattern = new RegExp(
        (
            // Delimiters.
            `(\\${strDelimiter}|\\r?\\n|\\r|^)` +

            // Quoted fields.
            `(?:"([^"]*(?:""[^"]*)*)"|` +

            // Standard fields.
            `([^"\\${strDelimiter}\\r\\n]*))`
        ),
        "gi"
    );


    // Create an array to hold our data. Give the array
    // a default empty first row.
    const arrData: string[][] = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    let arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec(strData)) {

        // Get the delimiter that was found.
        const strMatchedDelimiter = arrMatches[1];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length > 0 &&
            strMatchedDelimiter !== strDelimiter
        ) {

            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push([]);

        }

        var strMatchedValue;

        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[2]) {
            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            strMatchedValue = arrMatches[2].replace(
                new RegExp("\"\"", "g"),
                "\""
            );
        } else {
            // We found a non-quoted value.
            strMatchedValue = arrMatches[3];
        }

        // Now that we have our value string, let's add
        // it to the data array.
        arrData[arrData.length - 1].push(strMatchedValue);
    }

    // Return the parsed data.
    return arrData;
}

const isRawObject = (obj: Record<string, unknown>): obj is RawObject => true

export const aoaToObjects = (aoa: string[][]): RawObject[] => {
    if (aoa.length === 0) {
        return [];
    }
    const headers = aoa.shift();
    if (!(Array.isArray(headers))) {
        return [];
    }
    const objects: RawObject[] = []
    aoa.forEach(row => {
        const obj: Record<string, unknown> = {};
        headers.forEach((header, index) => {
            switch (header) {
                case 'Date': {
                    obj.Date = new Date(row[index]).getTime();
                    break;
                }
                case 'Hours': {
                    obj.Minutes = Math.round((Number.parseFloat(row[index]) * 60))
                    break;
                }
                case 'Hourly Rate':
                case 'Amount': {
                    obj[header] = Math.round(Number.parseFloat(row[index]));
                    break;
                }
                default: {
                    obj[header] = row[index];
                }
            }
        });

        if (isRawObject(obj)) {
            objects.push(obj);
        } else {
            console.error('bad object', obj);
        }
    });
    return objects;
}