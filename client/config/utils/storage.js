export default class Storage {
  constructor(config) {
    this.config = {
      cacheDuration: 3600, // 1hr
      extend: true,
      ...config,
    };
  }

  isExpired(record) {
    return record ? new Date().getTime() > parseInt(record.ts, 10) : null;
  }

  getItem(key) {
    const item = localStorage.getItem(key);
    let record = null;

    if (item) {
      try {
        record = JSON.parse(item);
      } catch (error) {
        localStorage.removeItem(key);
        return undefined;
      }
    }

    if (!record) {
      return undefined;
    }

    if (this.isExpired(record)) {
      localStorage.removeItem(key);
      return undefined;
    }

    if (!this.isExpired(record) && this.config.extend) {
      this.setItem(key, record.value || record);
    }

    return record.value;
  }

  setItem(key, value, ttl) {
    const cacheTTL = ttl || this.config.cacheDuration;

    if (value === null) {
      this.removeItem(key);
    }

    const record = {
      value,
      ts: new Date().getTime() + parseInt(cacheTTL * 1000, 10),
    };

    localStorage.setItem(key, JSON.stringify(record));
  }

  removeItem(key) {
    return localStorage.removeItem(key);
  }
}
