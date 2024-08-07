export class Collection<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly parser: any;

  items: Map<string, T>;
  onChanged: () => void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(parser: any, onChanged: () => void) {
    this.items = new Map<string, T>();
    this.parser = parser;
    this.onChanged = onChanged;
  }

  erase() {
    this.items.clear();
    this.onChanged();
  }

  toObject() {
    return [...this.items.entries()].map(([id, doc]) => {
      return { id, doc };
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fromJson(elements: { id: string; doc: any }[]) {
    this.items.clear();
    for (const element of elements) {
      this.items.set(element.id, new this.parser(element.doc));
    }
  }

  insert(document: T) {
    this.items.set(randomId(), document);
    this.onChanged();
  }

  bulkInsert(documents: T[]) {
    for (const document of documents) {
      this.insert(document);
    }
    this.onChanged();
  }

  find(selector?: Partial<T>): [string, T][] {
    selector ??= {};

    return [...this.items.entries()].filter(([_, value]) => {
      return Object.entries(selector).every(
        ([selectorKey, selectorValue]) => value[selectorKey] === selectorValue,
      );
    });
  }

  findOne(selector: Partial<T>): [string | undefined, T] {
    const result = [...this.items.entries()].find(([_, value]) => {
      return Object.entries(selector).every(
        ([selectorKey, selectorValue]) => value[selectorKey] === selectorValue,
      );
    });
    if (!result) return [undefined, null as T];
    return [result[0], result[1]];
  }

  updateOne(
    selector: Partial<T>,
    update: Partial<T>,
    options?: { upsert?: boolean },
  ) {
    options ??= {};

    const [id, doc] = this.findOne(selector);
    if (!id) {
      if (options.upsert) {
        const newDoc = new this.parser({
          ...selector,
          ...update,
        });
        this.insert(newDoc);
      }
      return;
    }

    Object.keys(update).forEach((key) => {
      doc[key] = update[key];
    });
    this.items.set(id, doc);
    this.onChanged();
  }

  deleteMany(selector: Partial<T>) {
    const docs = this.find(selector);
    docs.forEach(([id]) => {
      this.items.delete(id);
    });
    this.onChanged();
  }

  deleteOne(selector: Partial<T> | string) {
    if (typeof selector === 'string') {
      this.items.delete(selector);
      this.onChanged();
      return;
    }

    const [id] = this.findOne(selector);
    if (!id) return;

    this.items.delete(id);
    this.onChanged();
  }
}
