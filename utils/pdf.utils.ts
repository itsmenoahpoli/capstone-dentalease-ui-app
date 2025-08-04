import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface ExportData {
  headers: string[];
  data: any[][];
  title: string;
}

export const exportToPDF = (exportData: ExportData) => {
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("DentalEase - Dental Clinic", pageWidth / 2, 20, {
    align: "center",
  });

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(exportData.title, pageWidth / 2, 35, { align: "center" });

  const currentDate = new Date().toLocaleDateString();
  doc.setFontSize(10);
  doc.text(`Generated on: ${currentDate}`, pageWidth - 20, 45, {
    align: "right",
  });

  autoTable(doc, {
    head: [exportData.headers],
    body: exportData.data,
    startY: 55,
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { top: 10 },
  });

  const fileName = `${exportData.title.toLowerCase().replace(/\s+/g, "_")}_${
    new Date().toISOString().split("T")[0]
  }.pdf`;
  doc.save(fileName);
};
