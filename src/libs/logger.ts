// Common logger for all modules

class Logger {
  public prefix: string;
  public defaultContext: string;

  constructor(prefix: string, defaultContext: string) {
    this.prefix = prefix;
    this.defaultContext = defaultContext;
  }

  public log(...args: any[]) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    console.log(`[${this.prefix}]`, ...args);
  }
}

export default Logger;
