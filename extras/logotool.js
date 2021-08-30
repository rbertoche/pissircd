// logotool.js
// Reconstruct src/version.c.SH with the logo banner of your choice!
// Hacked together by owo on pissnet <https://github.com/Prouser123>
// To create a logo: 'figlet -f big <message> > new_logo.txt'
//                   'node extras/logotool.js'

const fs = require("fs")

// Load in the source file
const scriptFile = fs.readFileSync("src/version.c.SH")

// Step 0: Figure out where the logo definition is

const start = scriptFile.indexOf("char unreallogo[]")
// -2 to get rid of the two newlines before this match
// This means the last char is the closing }; of the logo definition
const end = scriptFile.indexOf("char *dalinfotext[] =") - 2


const unrealLogoDefinition = scriptFile.slice(start, end).toString()

console.log(`Found unreal logo definition at indexes ${start}-${end}`)

//console.log(`"${unrealLogoDefinition}"`)

/**
 * 
 * char unreallogo[] =
 * {
 * [11 ascii points (eg. 1,2,3,4,5,6,7,8,9,10,11, )]
 * };
 * 
 */

// 1. Remove the {} blocks so we are left with just the code points, comma seperated.

// +3 to start after the { and \n
const openingBracket = unrealLogoDefinition.indexOf("{") + 3
const closingBracket = unrealLogoDefinition.indexOf("};")

let addresses = unrealLogoDefinition.slice(openingBracket, closingBracket)

//console.log("'" + addresses + "'")


// 2. Create an array of ascii code points
const codePoints = addresses.split(",")


// 2b. print the current message
console.log("Current message:\n------------------------------------------------------------")
console.log(String.fromCharCode(...codePoints))

// 3. Take input for the new message
// TODO: Integrate with figlet
console.log("------------------------------------------------------------")
console.log("To create a logo: 'figlet -f big <message> > new_logo.txt'")
console.log("                  'node extras/logotool.js'")
console.log("\nClose enough! :tm:")
console.log("------------------------------------------------------------")
console.log("Loading new logo from new_logo.txt")

const newLogo = fs.readFileSync("new_logo.txt")

let keys = []
newLogo.forEach(l => keys.push(l))

console.log("------------------------------------------------------------")
//console.log(String.fromCharCode(...keys))
//console.log("------------------------------------------------------------")

// 3.1. Remove trailing lines
/*
  Each trailing line is made of:
  
  56x 32 (space)
  1x 10 (\n)
  
  eg:  32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,
       32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,
       32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,10
  
       (moved across multiple lines for readability)
 */


// Regex to remove instances of blank lines (as defined above)

// bugfix: 56x for the default "UnrealIRCd logo", but custom logos have different widths
//         using 2+ spaces in a row followed by newline for now.
keys2 = keys.toString().replace(/((,32){2,},10){1,}/gm, "").split(",")

// If last item is a 10 (newline), remove it
// bugfix: try commenting this out since ircd places the git string on the same line as the chars
//         (should be on it's own n)
//if (keys2[keys2.length-1] = "10") keys2.pop()


/*
  UNUSED
  ------
  if (keys2.length % 2 != 0) {
    keys2.push("0")
    // Index is odd! we need to add an extra character for padding

}*/

console.log(String.fromCharCode(...keys2))
console.log("------------------------------------------------------------")

// Step $x - add name of product for some reason?
// eg. original message has "UnrealIRCd" as last line

// Step 4 - Re-construct version.c.SH

// Step 4.1 - Get the file *around* our indexes (aka the whole file except the definition)
const fileBeforeDef = scriptFile.slice(0, start)
const fileAfterDef = scriptFile.slice(end, scriptFile.length)

// debug file outputs disabled | fs.writeFileSync("test.txt", `${fileBeforeDef}${fileAfterDef}`)

// Step 4.1 - Prepare for creation of new logo definition
//            (See line 20) We ideally want to match tbe format of 11 ascii points per line


// ceil just in case (round up to next whole number)
// eg. 28.8 -> 29
const rows = Math.ceil(keys2.length / 11)

console.log(`(debug) We need **${rows}** rows to match the existing 11 points / line format!`)

const rowsData = []

for (row = 0; row < rows; row++) {
    // Iterate this every row

    const rowData = []
    

    // Get the first 11 items from keys2
    for (i = 0; i < 11; i++) {
        //console.log("(debug) Getting item " + i)
        const charcode = keys2.shift()

        // Only push if chars are available (otherwise we get undefined elements in rowData)
        charcode ? rowData.push(charcode) : "skip; no elements left"

    }

    // Push this row's chars to the global "list of rows"
    rowsData.push(rowData)
}

//console.log(rowsData)

// Step 4.2 - Format rowsData into a logo definition
const stringRows = []

for (i = 0; i < rowsData.length; i++) {
    // Add the contents of each row to a variable, comma seperated
    let rowContents = rowsData[i].join(",")
    // Add a comma to the end except on the last line
    if ((i + 1 != rowsData.length)) rowContents += ","
    // Now our format for this line should match the requirements (line 21), so we can push it to a output array!
    stringRows.push(rowContents)
}

// Step 4.3 - Create the *new* logo definition

const newLogoDef = `char unreallogo[] = 
{
${stringRows.join("\n")}};\n`

//console.log(newLogoDef)

// Step 4.4 - Write the new file
fs.writeFileSync("src/version.c.SH", `${fileBeforeDef}${newLogoDef}${fileAfterDef}`)

// debug file outputs disabled | fs.writeFileSync("src/version.c.SH.original", scriptFile)