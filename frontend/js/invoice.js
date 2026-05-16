function downloadInvoice(booking) {
  const invoiceHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8"/>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
        .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
        .logo { font-size: 1.5rem; font-weight: 700; color: #1a73e8; }
        .logo span { color: #0d47a1; }
        .invoice-title { font-size: 2rem; color: #1a73e8; font-weight: 700; }
        .details { margin: 30px 0; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background: #1a73e8; color: #fff; padding: 12px; text-align: left; }
        td { padding: 12px; border-bottom: 1px solid #eee; }
        .total { font-size: 1.2rem; font-weight: 700; color: #1a73e8; }
        .footer { margin-top: 40px; text-align: center; color: #999; font-size: 0.85rem; }
        .status { padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; background: #e8f5e9; color: #388e3c; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="logo">🏠 Unices <span>Services</span></div>
          <p style="color:#777;font-size:0.85rem">Professional Home Services</p>
          <p style="color:#777;font-size:0.85rem">Chennai, Tamil Nadu</p>
          <p style="color:#777;font-size:0.85rem">hello@unices.in | +91 98765 43210</p>
        </div>
        <div style="text-align:right">
          <div class="invoice-title">INVOICE</div>
          <p style="color:#777">#${booking._id.slice(-8).toUpperCase()}</p>
          <p style="color:#777">Date: ${new Date().toLocaleDateString('en-IN')}</p>
          <span class="status">${booking.status}</span>
        </div>
      </div>

      <div class="details">
        <h3 style="margin-bottom:10px;color:#1a73e8">Bill To:</h3>
        <p><strong>${booking.name}</strong></p>
        <p>${booking.phone}</p>
        <p>${booking.address}</p>
      </div>

      <table>
        <tr>
          <th>Service</th>
          <th>Date</th>
          <th>Time Slot</th>
          <th>Staff</th>
          <th>Amount</th>
        </tr>
        <tr>
          <td>${booking.service}</td>
          <td>${booking.date}</td>
          <td>${booking.timeSlot}</td>
          <td>${booking.staffName || 'TBD'}</td>
          <td>₹${booking.price}</td>
        </tr>
      </table>

      <div style="text-align:right;margin-top:20px">
        <table style="width:300px;margin-left:auto">
          <tr>
            <td>Subtotal:</td>
            <td style="text-align:right">₹${booking.price}</td>
          </tr>
          <tr>
            <td>GST (18%):</td>
            <td style="text-align:right">₹${Math.round(booking.price * 0.18)}</td>
          </tr>
          <tr style="background:#f5f5f5">
            <td class="total">Total:</td>
            <td class="total" style="text-align:right">₹${Math.round(booking.price * 1.18)}</td>
          </tr>
        </table>
      </div>

      <div class="footer">
        <p>Thank you for choosing Unices Services! 🏠</p>
        <p>For support: hello@unices.in | +91 98765 43210</p>
        <p style="margin-top:10px">© 2025 Unices Services. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  const blob   = new Blob([invoiceHTML], { type: 'text/html' });
  const url    = URL.createObjectURL(blob);
  const link   = document.createElement('a');
  link.href     = url;
  link.download = `Invoice-${booking._id.slice(-8).toUpperCase()}.html`;
  link.click();
  URL.revokeObjectURL(url);
}