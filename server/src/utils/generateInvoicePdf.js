import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateInvoicePdf = ({
    invoiceNumber,
    name,
    email,
    plan,
    amount,
    paymentId,
    orderId,
    date,
}) => {
    const doc = new PDFDocument({
        size: "A4",
        margin: 50,
    });

    const primaryColor = "#0f172a"; // slate-900
    const mutedColor = "#64748b"; // slate-500
    const borderColor = "#e5e7eb"; // gray-200

    /* --------------------------------------------------
        HEADER (Logo + Tagline)
    -------------------------------------------------- */

    const logoPath = path.join(process.cwd(), "assets", "Bunchly-light.png");

    if (fs.existsSync(logoPath)) {
        // Logo sized to visually replace "Bunchly" text width
        doc.image(logoPath, 50, 45, { width: 110 });
    }

    doc.fontSize(10)
        .fillColor(mutedColor)
        .text("One Link. Every Identity.", 50, 78);

    doc.moveTo(50, 100).lineTo(545, 100).strokeColor(borderColor).stroke();

    /* --------------------------------------------------
        INVOICE TITLE + META (RIGHT BLOCK)
    -------------------------------------------------- */

    doc.fontSize(18).fillColor(primaryColor).text("Invoice", 50, 120);

    doc.fontSize(10)
        .fillColor(mutedColor)
        .text("Invoice Number", 350, 120)
        .fillColor(primaryColor)
        .fontSize(11)
        .text(invoiceNumber, 350, 135);

    doc.fontSize(10)
        .fillColor(mutedColor)
        .text("Invoice Date", 350, 155)
        .fillColor(primaryColor)
        .fontSize(11)
        .text(date, 350, 170);

    /* --------------------------------------------------
        BILLING INFO
    -------------------------------------------------- */

    doc.fontSize(10).fillColor(mutedColor).text("Billed To", 50, 165);

    doc.fontSize(11).fillColor(primaryColor).text(name, 50, 180);

    doc.fontSize(10).fillColor(mutedColor).text(email, 50, 195);

    /* --------------------------------------------------
        TABLE HEADER
    -------------------------------------------------- */

    const tableTop = 240;

    doc.moveTo(50, tableTop)
        .lineTo(545, tableTop)
        .strokeColor(borderColor)
        .stroke();

    doc.fontSize(10)
        .fillColor(mutedColor)
        .text("Description", 50, tableTop + 10)
        .text("Amount", 450, tableTop + 10, { align: "right" });

    doc.moveTo(50, tableTop + 32)
        .lineTo(545, tableTop + 32)
        .strokeColor(borderColor)
        .stroke();

    /* --------------------------------------------------
        TABLE ROW
    -------------------------------------------------- */

    doc.fontSize(11)
        .fillColor(primaryColor)
        .text(`Bunchly ${plan} Plan (Monthly)`, 50, tableTop + 48)
        .text(`₹${amount / 100}`, 450, tableTop + 48, {
            align: "right",
        });

    /* --------------------------------------------------
        TOTAL
    -------------------------------------------------- */

    const totalTop = tableTop + 110;

    doc.moveTo(300, totalTop)
        .lineTo(545, totalTop)
        .strokeColor(borderColor)
        .stroke();

    doc.fontSize(11)
        .fillColor(primaryColor)
        .text("Total Paid", 300, totalTop + 16)
        .fontSize(14)
        .text(`₹${amount / 100}`, 450, totalTop + 13, {
            align: "right",
        });

    /* --------------------------------------------------
        PAYMENT DETAILS (SEPARATE BLOCK)
    -------------------------------------------------- */

    const paymentTop = totalTop + 70;

    doc.fontSize(10)
        .fillColor(mutedColor)
        .text("Payment Details", 50, paymentTop);

    doc.moveTo(50, paymentTop + 12)
        .lineTo(545, paymentTop + 12)
        .strokeColor(borderColor)
        .stroke();

    doc.fontSize(10)
        .fillColor(mutedColor)
        .text("Payment ID", 50, paymentTop + 25)
        .fillColor(primaryColor)
        .text(paymentId, 200, paymentTop + 25);

    doc.fontSize(10)
        .fillColor(mutedColor)
        .text("Order ID", 50, paymentTop + 45)
        .fillColor(primaryColor)
        .text(orderId, 200, paymentTop + 45);

    /* --------------------------------------------------
        FOOTER
    -------------------------------------------------- */

    doc.moveTo(50, 720).lineTo(545, 720).strokeColor(borderColor).stroke();

    doc.fontSize(9)
        .fillColor(mutedColor)
        .text(
            "This is a system-generated invoice. No signature is required.",
            50,
            735,
            { align: "center", width: 495 }
        );

    doc.fontSize(9).text(
        `© ${new Date().getFullYear()} Bunchly. All rights reserved.`,
        50,
        750,
        { align: "center", width: 495 }
    );

    return doc;
};
