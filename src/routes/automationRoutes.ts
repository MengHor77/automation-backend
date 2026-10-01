import { Router } from "express";

import {
  createJob,
  listJobs,
} from "../controllers/automationController";

const router = Router();

// ============================================================
// AUTOMATION JOB ROUTES
// ============================================================

// POST /api/automation/jobs
router.post("/jobs", createJob);

// GET /api/automation/jobs
router.get("/jobs", listJobs);

export default router;