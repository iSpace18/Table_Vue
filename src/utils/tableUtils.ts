import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export function saveAsPDF() {
  const tableElement = document.getElementById('myTable') as HTMLElement;
  html2canvas(tableElement).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('l', 'pt', [canvas.width, canvas.height]);
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save('table.pdf');
  });
}