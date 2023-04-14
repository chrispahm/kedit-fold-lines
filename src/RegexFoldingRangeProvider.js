const vscode = require('vscode');


module.exports = class RegexFoldingRangeProvider {

  constructor(filters = {}, bufferTop = 0, bufferBottom = 0) {
    const {more = [], less = []} = filters;
    this.bufferBottom = bufferBottom;
    this.bufferTop = bufferTop;
    this.checkString = (str)  => {
      // Check if the string matches any of the regexes in the "more" array
      let moreResult = more.some(regex => regex.test(str));

      // Check if the string matches any of the regexes in the "less" array
      let lessResult = less.some(regex => regex.test(str));

      // Return true if moreResult is true and lessResult is false
      return moreResult && !lessResult;
    }
  }

  // This method is called by VSCode to get the folding ranges for a document
  provideFoldingRanges(document, context, token) {
    // Loop through each line of the document
    let ranges = [];
    let curStart = 0;
    let curEnd = 0;
    for (let i = 0; i < document.lineCount; i++) {
      // Get the current line
      let line = document.lineAt(i);

      // Check if the line fails the test, aka the line does not match the regex
      if (!this.checkString(line.text)) {        
        curEnd = i;
      } else {        
        // this line matches the regex!
        if (curEnd > curStart) {
          // Create a folding range for the current block
          let range = { start: curStart, end: curEnd }
          // Add the range to the array
          ranges.push(range);
        }
        curStart = i;
      }
    }
    if (curEnd > curStart) {
      // Create a folding range for the current block
      let range = { start: curStart, end: curEnd }
      // Add the range to the array
      ranges.push(range);
    }    
    // buffer the ranges by bufferTop lines to the top, and bufferBottom lines to the bottom
    // we need to ensure that the ranges do not overlap
    const newRanges = ranges.reduce((acc, range) => {
      let start = range.start + this.bufferBottom;
      if (range.start === 0) {
        start = 0;
      }
      let end = range.end - this.bufferTop;
      // first check if the range is valid
      if (start >= end || end < 0 || start >= document.lineCount || start === end) {
        return acc;
      }
      if (acc.length > 0) {
        let prev = acc[acc.length - 1];
        if (prev.end > start) {
          prev.end = end;
        } else {
          acc.push({
            start,
            end
          });
        }
      } else {
        acc.push({
          start,
          end
        });
      }
      return acc;
    }, []);
    
    const foldingRanges = newRanges.map(range => (
      new vscode.FoldingRange(range.start, range.end, vscode.FoldingRangeKind.Comment)
    ));
    console.log(foldingRanges);
    

    // Return the array of folding ranges
    return foldingRanges
  }
}
