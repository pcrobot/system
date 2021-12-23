const Service = require('egg').Service;
// import config from '../../config/config.default'

class NewsService extends Service {
  async list(page = 1) {
    // read config
    // const { serverUrl, pageSize } = config.news;
    const serverUrl = 'https://hacker-news.firebaseio.com/v0'
    const pageSize = 5
    // use build-in http client to GET hacker-news api
    const { data: idList } = await this.ctx.curl(`${serverUrl}/topstories.json`, {
      data: {
        orderBy: '"$key"',
        startAt: `"${pageSize * (page - 1)}"`,
        endAt: `"${pageSize * page - 1}"`,
      },
      dataType: 'json',
    });

    // parallel GET detail
    const newsList = await Promise.all(
      Object.keys(idList).map(key => {
        const url = `${serverUrl}/item/${idList[key]}.json`;
        return this.ctx.curl(url, { dataType: 'json' });
      })
    );
    return newsList.map(res => res.data);
  }
}

module.exports = NewsService;