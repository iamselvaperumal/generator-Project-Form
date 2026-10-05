import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Generate and download a fixed layout A4 PDF containing all 3 pages.
 * Captures Page 1, Page 2, Page 3 via an off-screen isolated A4 container
 * to ensure 100% precision, zero clipping, exact A4 aspect ratio, and crisp typography.
 */
export async function downloadFixedPdf(
  pageIds = ['page-1', 'page-2', 'page-3', 'page-4'],
  filename = 'TPRE_Installation_Commissioning_Certificate.pdf'
) {
  // Save current scroll position
  const originalScrollY = window.scrollY;
  const originalScrollX = window.scrollX;
  window.scrollTo(0, 0);

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  // Create isolated container in viewport with exact A4 dimensions (210mm x 297mm)
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '0';
  container.style.top = '0';
  container.style.width = '210mm';
  container.style.height = '297mm';
  container.style.backgroundColor = '#ffffff';
  container.style.boxSizing = 'border-box';
  container.style.overflow = 'hidden';
  container.style.zIndex = '999999';
  document.body.appendChild(container);

  let validPagesCount = 0;

  try {
    for (let i = 0; i < pageIds.length; i++) {
      const pageId = pageIds[i];
      const pageEl = document.getElementById(pageId);

      if (!pageEl) {
        console.warn(`Page element #${pageId} not found`);
        continue;
      }

      // Clone target page element
      const clone = pageEl.cloneNode(true);

      // Force clone to exact A4 box model
      clone.style.width = '210mm';
      clone.style.height = '297mm';
      clone.style.minHeight = '297mm';
      clone.style.maxHeight = '297mm';
      clone.style.margin = '0';
      clone.style.boxShadow = 'none';
      clone.style.border = 'none';
      clone.style.position = 'relative';
      clone.style.top = '0';
      clone.style.left = '0';
      clone.style.boxSizing = 'border-box';

      // Copy input/textarea values into clone elements
      const origInputs = pageEl.querySelectorAll('input, select, textarea');
      const cloneInputs = clone.querySelectorAll('input, select, textarea');
      origInputs.forEach((input, index) => {
        if (cloneInputs[index]) {
          if (input.type === 'checkbox' || input.type === 'radio') {
            cloneInputs[index].checked = input.checked;
          } else {
            cloneInputs[index].value = input.value;
          }
        }
      });

      // Clear container and append clone
      container.innerHTML = '';
      container.appendChild(clone);

      // Brief delay for DOM reflow
      await new Promise((resolve) => setTimeout(resolve, 100));

      if (validPagesCount > 0) {
        pdf.addPage('a4', 'portrait');
      }

      // Capture clone at 2.5x resolution for ultra-crisp output
      const canvas = await html2canvas(clone, {
        scale: 2.5,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: container.offsetWidth,
        height: container.offsetHeight,
        scrollX: 0,
        scrollY: 0,
        x: 0,
        y: 0
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      validPagesCount++;
    }
  } finally {
    // Clean up container and restore scroll
    if (container.parentNode) {
      document.body.removeChild(container);
    }
    window.scrollTo(originalScrollX, originalScrollY);
  }

  if (validPagesCount === 0) {
    throw new Error('No certificate pages found to export');
  }

  pdf.save(filename);
}

