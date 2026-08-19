import { Router } from "express";
import { scheduleController } from "../controllers/scheduleController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { idParamSchema } from "../validators/common.js";
import {
  scheduleCreateSchema,
  scheduleListQuerySchema,
  scheduleMonthQuerySchema,
  scheduleUpdateSchema,
} from "../validators/scheduleValidators.js";

let router = Router();

router.use(requireAuth);

router.get("/month", validate(scheduleMonthQuerySchema, "query"), asyncHandler(scheduleController.getMonth));
router.get("/", validate(scheduleListQuerySchema, "query"), asyncHandler(scheduleController.list));
router.get("/:id", validate(idParamSchema, "params"), asyncHandler(scheduleController.getById));
router.post("/", validate(scheduleCreateSchema), asyncHandler(scheduleController.create));
router.patch(
  "/:id",
  validate(idParamSchema, "params"),
  validate(scheduleUpdateSchema),
  asyncHandler(scheduleController.update)
);
router.delete("/:id", validate(idParamSchema, "params"), asyncHandler(scheduleController.remove));

export default router;
