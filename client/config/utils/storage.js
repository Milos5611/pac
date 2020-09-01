export default class Storage {
  constructor(config) {
    this.config = {
      cacheDuration: 3600, // 1hr
      extend: true,
      ...config,
    };
  }

  getItem(key) {
    let record = null;
    Object.keys(sessionStorage).forEach(item => {
      if (item.includes(key)) {
        record = item
      }
    });

    if (record) {
      try {
        record = JSON.parse(sessionStorage.getItem(record))
      } catch (error) {
        sessionStorage.removeItem(key);
        return undefined;
      }
    }

    if (!record) {
      return undefined;
    }

    return record.id_token;
  }

  removeItem(key) {
    return sessionStorage.removeItem(key);
  }
}
