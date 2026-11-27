import { Request, Response } from "express";
import { z } from "zod";
import {
  getPlans,
  assignPlanToClient,
  incrementConversationCount,
} from "./plans.service";

export async function listPlans(_req: Request, res: Response): Promise<void> {
  try {
    const plans = await getPlans();
    res.status(200).json({
      success: true,
      count: plans.length,
      plans,
    });
  } catch (error) {
    console.error("Error in listPlans:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching plans",
    });
  }
}

const assignPlanSchema = z.object({
  planId: z.string().uuid("Invalid plan ID format"),
});

export async function assignPlan(req: Request, res: Response): Promise<void> {
  try {
    const clientId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const parseResult = assignPlanSchema.safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed: planId is required and must be a valid UUID",
        errors: parseResult.error.flatten(),
      });
      return;
    }

    const { planId } = parseResult.data;
    const subscription = await assignPlanToClient(clientId, planId);

    res.status(200).json({
      success: true,
      message: "Plan assigned successfully",
      subscription,
    });
  } catch (error: any) {
    if (error?.message === "CLIENT_NOT_FOUND") {
      res.status(404).json({
        success: false,
        message: "Client not found",
      });
      return;
    }
    if (error?.message === "PLAN_NOT_FOUND") {
      res.status(404).json({
        success: false,
        message: "Plan not found",
      });
      return;
    }

    console.error("Error in assignPlan:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while assigning plan",
    });
  }
}

export async function incrementUsage(req: Request, res: Response): Promise<void> {
  try {
    const clientId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await incrementConversationCount(clientId);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    if (error?.message === "NO_ACTIVE_SUBSCRIPTION") {
      res.status(404).json({
        success: false,
        message: "No active subscription found for this client",
      });
      return;
    }

    console.error("Error in incrementUsage:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while incrementing usage",
    });
  }
}
