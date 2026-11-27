import { Request, Response } from "express";
import { z } from "zod";
import {
  getClients,
  getClientById,
  updateClientStatus,
  suspendClientUsage,
  reactivateClient,
  getExpiringSubscriptions,
} from "./clients.service";

export async function listClients(req: Request, res: Response): Promise<void> {
  try {
    const { page, limit, status, search, industry } = req.query;

    const result = await getClients({
      page: page ? parseInt(page as string, 10) : undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
      status: typeof status === "string" ? status : undefined,
      search: typeof search === "string" ? search : undefined,
      industry: typeof industry === "string" ? industry : undefined,
    });

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Error in listClients:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching clients",
    });
  }
}

export async function getClient(req: Request, res: Response): Promise<void> {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const client = await getClientById(id);

    if (!client) {
      res.status(404).json({
        success: false,
        message: "Client not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      client,
    });
  } catch (error) {
    console.error("Error in getClient:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching client",
    });
  }
}

const statusSchema = z.object({
  status: z.enum(["lead", "active", "suspended", "cancelled"]),
});

export async function updateStatus(req: Request, res: Response): Promise<void> {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const parseResult = statusSchema.safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        message: "Invalid status. Must be 'lead', 'active', 'suspended', or 'cancelled'",
        errors: parseResult.error.flatten(),
      });
      return;
    }

    const updated = await updateClientStatus(id, parseResult.data.status);
    if (!updated) {
      res.status(404).json({
        success: false,
        message: "Client not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      client: updated,
    });
  } catch (error) {
    console.error("Error in updateStatus:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while updating client status",
    });
  }
}

export async function suspend(req: Request, res: Response): Promise<void> {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await suspendClientUsage(id);

    if (!result.client) {
      res.status(404).json({
        success: false,
        message: "Client not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Client and active subscriptions suspended",
      ...result,
    });
  } catch (error) {
    console.error("Error in suspend:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while suspending client",
    });
  }
}

export async function reactivate(req: Request, res: Response): Promise<void> {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await reactivateClient(id);

    if (!result.client) {
      res.status(404).json({
        success: false,
        message: "Client not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Client and suspended subscriptions reactivated",
      ...result,
    });
  } catch (error) {
    console.error("Error in reactivate:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while reactivating client",
    });
  }
}

export async function expiring(req: Request, res: Response): Promise<void> {
  try {
    const days = req.query.days ? parseInt(req.query.days as string, 10) : 7;
    const subscriptions = await getExpiringSubscriptions(days);

    res.status(200).json({
      success: true,
      count: subscriptions.length,
      subscriptions,
    });
  } catch (error) {
    console.error("Error in expiring:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching expiring subscriptions",
    });
  }
}
