const vscode = require('vscode');

module.exports = class FoldingRangeProvider {

  constructor(filters = {}, bufferTop = 0, bufferBottom = 0) {
    const {more = [], less = []} = filters;
    this.bufferBottom = bufferBottom;
    this.bufferTop = bufferTop;
    this.checkString = (str)  => {
      // Check if the string matches any string in the "more" array
      let moreResult = more.some(searchStr => str.toLowerCase().includes(searchStr.toLowerCase()));

      // Check if the string matches any of the strings in the "less" array
      let lessResult = less.some(searchStr => str.toLowerCase().includes(searchStr.toLowerCase()));

      // Return true if moreResult is true and lessResult is false
      return moreResult && !lessResult;
    }
  }

  // This method is called by VSCode to get the folding ranges for a document
  provideFoldingRanges(document) {    
    // Loop through each line of the document
    let linesToDisplay = [];
    const lineCount = document.lineCount;
    for (let i = 0; i < lineCount; i++) {
      // Get the current line      
      let line = document.lineAt(i);      
      // Check if the line passes the test      
      if (this.checkString(line.text)) {        
        linesToDisplay.push(i);
      }
    }
    
    // create a new array of numbers, that adds the bufferBottom and bufferTop
    // paddings to the lines to display
    let linesToDisplayWithBuffer = [];
    linesToDisplay.forEach((lineIndex) => {
      const start = lineIndex - this.bufferTop;
      const end = lineIndex + this.bufferBottom;
      for (let i = start; i <= end; i++) {
        if (i >= 0 && i < lineCount && !linesToDisplayWithBuffer.includes(i)) {
          linesToDisplayWithBuffer.push(i);
        }
      }
    });
    
    linesToDisplayWithBuffer.sort((a, b) => a - b);
    
    // from the array of lines to display, we create
    // an array of ranges that should NOT be displayed
    const ranges = [];
    let start = 0;
    let end = 0;
    for (let i = 0; i < lineCount; i++) {
      if (linesToDisplayWithBuffer.includes(i)) {
        // this line should be visible!
        // if there is a range that is not empty, push it to the ranges array
        if (start !== end) {
          ranges.push({
            start,
            end
          });
        }
        start = i;
        end = i;
      } else {
        // this line should be hidden!
        end = i;
      }
    }
    // push the last range
    if (start !== end) {
      ranges.push({
        start,
        end
      });
    }
    
    const foldingRanges = ranges.map(range => (
      new vscode.FoldingRange(range.start, range.end, vscode.FoldingRangeKind.Comment)
    ));
        
    console.log(foldingRanges);
    
    // Return the array of folding ranges
    return foldingRanges
  }
}
