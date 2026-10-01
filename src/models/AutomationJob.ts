import mongoose, {
  Document,
  Schema,
} from "mongoose";

// ============================================================
// JOB STATUS
// ============================================================

export type AutomationJobStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed";

// ============================================================
// DOCUMENT INTERFACE
// ============================================================

export interface IAutomationJob extends Document {
  targetUrl: string;
  durationSeconds: number;
  status: AutomationJobStatus;
  startedAt?: Date;
  completedAt?: Date;
  message?: string;
}

// ============================================================
// SCHEMA
// ============================================================

const automationJobSchema =
  new Schema<IAutomationJob>(
    {
      targetUrl: {
        type: String,
        required: true,
        trim: true,
      },

      durationSeconds: {
        type: Number,
        required: true,
        min: 1,
        max: 3600,
      },

      status: {
        type: String,
        enum: [
          "pending",
          "running",
          "completed",
          "failed",
        ],
        default: "pending",
      },

      startedAt: {
        type: Date,
      },

      completedAt: {
        type: Date,
      },

      message: {
        type: String,
        trim: true,
      },
    },
    {
      timestamps: true,
    },
  );

// ============================================================
// MODEL
// ============================================================

const AutomationJob =
  mongoose.model<IAutomationJob>(
    "AutomationJob",
    automationJobSchema,
  );

export default AutomationJob;