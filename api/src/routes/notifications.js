const {Router} =  require('express')
const notificationsRouter = Router();
const {getNotifications} = require("../controllers/notificaciones/index.js")

notificationsRouter.get("/", getNotifications )

module.exports = notificationsRouter;