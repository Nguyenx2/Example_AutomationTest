import fs from "fs";
import path from "path";

export class JSONHelper {
  private filePath: string;

  constructor(fileName: string) {
    this.filePath = path.resolve(__dirname, fileName);
  }

  // Read Json Data
  read(): any {
    const data = fs.readFileSync(this.filePath, "utf-8");
    return JSON.parse(data);
  }

  // Write Json data
  write(data: any): void {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), "utf-8");
  }

  // Update key in Json
  update(key: string, value: any): void {
    const data = this.read();
    data[key] = value;
    this.write(data);
  }
}
