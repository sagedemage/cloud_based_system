const LoginLogsRepository = require(`../repository/login_logs.repository`);

class LoginLogsService {
  async find_by_id(logid) {
    const data = await LoginLogsRepository.find_by_id(logid);

    if (data) {
      return data.Item;
    }

    return data;
  }

  async create(msg) {
    return await LoginLogsRepository.create(msg);
  }
}

module.exports = new LoginLogsService();
