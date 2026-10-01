import AutomationJob from "../models/AutomationJob";
import { runBrowserTest } from "../automation/browser";

interface CreateAutomationJobInput {
  targetUrl: string;
  durationSeconds: number;
}

// ============================================================
// CREATE AUTOMATION JOB
// ============================================================

export async function createAutomationJob(
  input: CreateAutomationJobInput,
) {
  const job = await AutomationJob.create({
    targetUrl: input.targetUrl,
    durationSeconds: input.durationSeconds,
    status: "pending",
  });

  // Run the browser test in the background.
  runAutomationJob(job.id).catch((error) => {
    console.error("Automation job failed:", error);
  });

  return job;
}

// ============================================================
// RUN AUTOMATION JOB
// ============================================================

export async function runAutomationJob(
  jobId: string,
): Promise<void> {
  const job = await AutomationJob.findById(jobId);

  if (!job) {
    throw new Error("Automation job not found");
  }

  job.status = "running";
  job.startedAt = new Date();

  await job.save();

  try {
    const result = await runBrowserTest(
      job.targetUrl,
      job.durationSeconds,
    );

    job.status = result.success
      ? "completed"
      : "failed";

    job.message = result.message;
    job.completedAt = new Date();

    await job.save();
  } catch (error) {
    job.status = "failed";

    job.message =
      error instanceof Error
        ? error.message
        : "Automation job failed.";

    job.completedAt = new Date();

    await job.save();
  }
}

// ============================================================
// GET AUTOMATION JOBS
// ============================================================

export async function getAutomationJobs() {
  return AutomationJob.find()
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
}