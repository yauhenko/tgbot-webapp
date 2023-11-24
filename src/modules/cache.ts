class Cache {
  private data: Record<string, any> = {};
  get = <T>(key: string): T | undefined => this.data[key];
  set = (key: string, value: any) => (this.data[key] = value);
  remove = (key: string) => delete this.data[key];
}

const cache = new Cache();
export default cache;
