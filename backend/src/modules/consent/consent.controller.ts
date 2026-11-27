import { Request, Response } from "express";
import {
  withdrawConsent,
  getAllConsentRecords,
  getConsentRecord,
} from "./consent.service";

export async function handleWithdrawConsent(
  req: Request,
  res: Response
): Promise<void> {
  const token = req.query.token as string;

  if (!token) {
    res.status(400).json({
      success: false,
      message: "This link is invalid or has expired.",
    });
    return;
  }

  try {
    const result = await withdrawConsent(token);

    if ("alreadyWithdrawn" in result && result.alreadyWithdrawn) {
      res.status(200).json({
        success: true,
        message: "Your consent was already withdrawn.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message:
        "Your consent has been withdrawn. Your personal data will be deleted within 30 days as required by the DPDP Act 2023.",
      deletionDate: result.deletionDate,
    });
  } catch (error: any) {
    if (error?.message === "INVALID_TOKEN") {
      res.status(400).json({
        success: false,
        message: "This link is invalid or has expired.",
      });
      return;
    }

    console.error("Error in handleWithdrawConsent:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while processing consent withdrawal",
    });
  }
}

export async function listConsentRecords(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { page, limit, status } = req.query;

    const result = await getAllConsentRecords({
      page: page ? parseInt(page as string, 10) : undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
      status: typeof status === "string" ? status : undefined,
    });

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Error in listConsentRecords:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching consent records",
    });
  }
}

export async function getClientConsent(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const clientId = Array.isArray(req.params.clientId)
      ? req.params.clientId[0]
      : req.params.clientId;

    const record = await getConsentRecord(clientId);

    if (!record) {
      res.status(404).json({
        success: false,
        message: "Consent record not found for this client",
      });
      return;
    }

    res.status(200).json({
      success: true,
      record,
    });
  } catch (error) {
    console.error("Error in getClientConsent:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching consent record",
    });
  }
}
