import { Request, Response } from "express";
import {
  getInvoices,
  getInvoiceById,
  generateInvoicePdf,
} from "./invoices.service";
import { sendInvoiceEmail } from "../../utils/emailService";

export async function listInvoices(req: Request, res: Response): Promise<void> {
  try {
    const { clientId, status, page, limit } = req.query;

    const result = await getInvoices({
      clientId: typeof clientId === "string" ? clientId : undefined,
      status: typeof status === "string" ? status : undefined,
      page: page ? parseInt(page as string, 10) : undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
    });

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Error in listInvoices:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching invoices",
    });
  }
}

export async function getInvoice(req: Request, res: Response): Promise<void> {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const invoice = await getInvoiceById(id);

    if (!invoice) {
      res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      invoice,
    });
  } catch (error) {
    console.error("Error in getInvoice:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching invoice",
    });
  }
}

export async function downloadInvoicePdf(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const invoice = await getInvoiceById(id);

    if (!invoice) {
      res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
      return;
    }

    const pdfBuffer = await generateInvoicePdf(id);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${invoice.invoice_number}.pdf"`
    );
    res.setHeader("Content-Length", pdfBuffer.length);
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error in downloadInvoicePdf:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while generating invoice PDF",
    });
  }
}

export async function sendEmail(req: Request, res: Response): Promise<void> {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const invoice = await getInvoiceById(id);

    if (!invoice) {
      res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
      return;
    }

    const result = await sendInvoiceEmail(invoice.client_id, invoice.id);

    if (!result.success) {
      res.status(502).json({
        success: false,
        message: result.error || "Failed to deliver invoice email",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Invoice email successfully sent to ${invoice.client_email}`,
      messageId: result.messageId,
    });
  } catch (error) {
    console.error("Error in sendEmail:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while sending invoice email",
    });
  }
}
