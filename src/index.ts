import fs from "fs";

class NumberSorter {
  public numbers: number[];

  constructor(private inputFile: string, private outputFile: string) {
    this.numbers = [];
  }

  public readNumber(): void {
    try {
      // Read the content of the input file synchronously
      const fileData = fs.readFileSync(this.inputFile, 'utf-8');

      // Define the delimiter for splitting numbers (assuming CSV-like format)
      const delimiter = ',';

      // Split the file data by the delimiter, parse each number, and filter out any NaN values
      this.numbers = fileData.split(delimiter).map((num) => parseFloat(num)).filter((num) => !isNaN(num));
    } catch (error) {
      // Handle errors when reading the input file
      console.error("Error reading the input file:", error);
      process.exit(1);
    }
  }

  public sortNumber(descending: boolean): void {
    // Sort the numbers in ascending or descending order based on the 'descending' flag
    this.numbers.sort((a, b) => descending ? b - a : a - b);
  }

  public writeNumbers(): void {
    try {
      // Join the sorted numbers into a string with commas in between
      const result = this.numbers.join(", ");

      // Write the sorted numbers to the output file
      fs.writeFileSync(this.outputFile, result);
      console.log("Sorted numbers written to", this.outputFile);
    } catch (error) {
      // Handle errors when writing to the output file
      console.error("Error writing to the output file:", error);
      process.exit(1);
    }
  }
}

function main() {
  const args = process.argv.slice(2);
  const inputFileName = args[0] || "input.txt";
  const outputFileName = args[1] || "output.txt";
  const descending = args.includes("--descending");

  // Create an instance of the NumberSorter class
  const sorter = new NumberSorter(inputFileName, outputFileName);

  // Read numbers from the input file
  sorter.readNumber();

  // Sort the numbers (in ascending or descending order)
  sorter.sortNumber(descending);

  // Write the sorted numbers to the output file
  sorter.writeNumbers();

  // Perform a performance test with a large list of random numbers
  performanceTest();

  function performanceTest() {
    // Generate a large list of random numbers (1 million in this case)
    const largeList = generateLargeRandomList(1000000);
    const sorter = new NumberSorter("input.txt", "output.txt");

    const startTime = performance.now();
    sorter.numbers = largeList.slice(); // Copy the list to avoid modifying the original
    sorter.sortNumber(true); // Sort the large list in descending order
    const endTime = performance.now();

    console.log(`Sorting 1 million numbers took ${endTime - startTime} milliseconds.`);
  }

  function generateLargeRandomList(size: number): number[] {
    const randomList = [];
    for (let i = 0; i < size; i++) {
      randomList.push(Math.random());
    }
    return randomList;
  }
}

// Call the main function to start the program
main();
