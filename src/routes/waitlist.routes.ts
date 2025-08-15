import { Router } from "express";
import { WaitlistController } from "../controllers/waitlist.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { UserRole } from "../domain/interfaces/user.interface";

const router = Router();

// Public route for joining waitlist
router.post("/join", WaitlistController.join);

// Admin routes
router.get(
  "/",
  authenticate,
  authorize(UserRole.ADMIN),
  WaitlistController.getList
);

router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  WaitlistController.delete
);

export default router;
