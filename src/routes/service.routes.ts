import { Router } from "express";
import { ServiceController } from "../controllers/service.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { UserRole } from "../domain/interfaces/user.interface";

const router = Router();
router.get("/", ServiceController.getList);

router.get("/:id", ServiceController.getById);

router.post(
  "/",
  authenticate,
  authorize(UserRole.SERVICE_PROVIDER),
  ServiceController.create
);

router.put(
  "/:id",
  authenticate,
  authorize(UserRole.SERVICE_PROVIDER),
  ServiceController.update
);

router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.SERVICE_PROVIDER),
  ServiceController.delete
);

export default router;
