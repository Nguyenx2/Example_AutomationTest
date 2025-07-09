export class DateTimeHelper {
  // Get the current date and time
  static now(): string {
    return new Date().toISOString();
  }

  static formatDate(
    date: Date = new Date(),
    format: string = "YYYY-MM-DD"
  ): string {
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);

    switch (format) {
      case "YYYY-MM-DD":
        return `${year}-${month}-${day}`;
      case "MM/DD/YYYY":
        return `${day}/${month}/${year}`;
      case "DD-MM-YYYY":
        return `${day}-${month}-${year}`;
      case "DD/MM/YYYY":
        return `${day}/${month}/${year}`;
      case "MM-YYYY":
        return `${year}-${month}`;
      default:
        return date.toISOString();
    }
  }
}
