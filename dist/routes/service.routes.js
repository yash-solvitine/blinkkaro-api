"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const service_controller_1 = require("../controllers/service.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const user_interface_1 = require("../domain/interfaces/user.interface");
const router = (0, express_1.Router)();
router.get("/", service_controller_1.ServiceController.getList);
router.get("/:id", service_controller_1.ServiceController.getById);
router.post("/", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(user_interface_1.UserRole.SERVICE_PROVIDER), service_controller_1.ServiceController.create);
router.put("/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(user_interface_1.UserRole.SERVICE_PROVIDER), service_controller_1.ServiceController.update);
router.delete("/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(user_interface_1.UserRole.SERVICE_PROVIDER), service_controller_1.ServiceController.delete);
exports.default = router;
//# sourceMappingURL=service.routes.js.map