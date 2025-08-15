"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const waitlist_controller_1 = require("../controllers/waitlist.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const user_interface_1 = require("../domain/interfaces/user.interface");
const router = (0, express_1.Router)();
router.post("/join", waitlist_controller_1.WaitlistController.join);
router.get("/", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(user_interface_1.UserRole.ADMIN), waitlist_controller_1.WaitlistController.getList);
router.delete("/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(user_interface_1.UserRole.ADMIN), waitlist_controller_1.WaitlistController.delete);
exports.default = router;
//# sourceMappingURL=waitlist.routes.js.map