import { Request, Response } from "express";

import {
  createAutomationJob,
  getAutomationJobs,
} from "../services/automationService";

// ============================================================
// CREATE AUTOMATION JOB
// ============================================================

export async function createJob(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { targetUrl, durationSeconds } = req.body;

    // --------------------------------------------------------
    // Validate URL
    // --------------------------------------------------------

    if (!targetUrl || typeof targetUrl !== "string") {
      res.status(400).json({
        success: false,
        message: "targetUrl is required.",
      });

      return;
    }

    try {
      new URL(targetUrl);
    } catch {
      res.status(400).json({
        success: false,
        message: "Invalid targetUrl.",
      });

      return;
    }

    // --------------------------------------------------------
    // Validate duration
    // --------------------------------------------------------

    const duration = Number(durationSeconds);

    if (
      !Number.isFinite(duration) ||
      duration < 1 ||
      duration > 3600
    ) {
      res.status(400).json({
        success: false,
        message: "durationSeconds must be between 1 and 3600.",
      });

      return;
    }

    // --------------------------------------------------------
    // Create job
    // --------------------------------------------------------

    const job = await createAutomationJob({
      targetUrl: targetUrl.trim(),
      durationSeconds: duration,
    });

    res.status(201).json({
      success: true,
      job: {
        id: job.id,
        targetUrl: job.targetUrl,
        durationSeconds: job.durationSeconds,
        status: job.status,
        startedAt: job.startedAt,
        completedAt: job.completedAt,
        message: job.message,
      },
    });
  } catch (error) {
    console.error("Create automation job error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create automation job.",
    });
  }
}

// ============================================================
// GET AUTOMATION JOBS
// ============================================================

export async function listJobs(
  _req: Request,
  res: Response,
): Promise<void> {
  try {
    const jobs = await getAutomationJobs();

    res.json({
      success: true,
      jobs: jobs.map((job) => ({
        id: job._id.toString(),
        targetUrl: job.targetUrl,
        durationSeconds: job.durationSeconds,
        status: job.status,
        startedAt: job.startedAt,
        completedAt: job.completedAt,
        message: job.message,
      })),
    });
  } catch (error) {
    console.error("Get automation jobs error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load automation jobs.",
    });
  }
}