const LoginLogsService = require(`../service/login_logs.service`);

class LoginLogsController {

    async find_by_id(req, res) {
        res.setHeader("Content-Type", "application/json");
        const data = req.body;
        const logid = data.logid;
        const login_log = await LoginLogsService.find_by_id(logid)

        res.json(login_log)
    }

    async create(req, res) {
        res.setHeader("Content-Type", "application/json");
        const data = req.body;
        const msg = data.msg;
        const response = await LoginLogsService.create(msg)

        if (response.$metadata.httpStatusCode === 200) {
            const json_response = { msg: "Added Login Log", status: "Success" };
            res.json(json_response);
        } else {
            const json_response = { msg: "Unable to add a Login Log", status: "Error" };
            res.json(json_response);
        }
    }
}

module.exports = new LoginLogsController()