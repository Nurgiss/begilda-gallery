import type { Order, PickupPoint } from '../types/db.js';

export function generateOrderConfirmationHTML(order: Order, pickupPointDetails?: PickupPoint | null): string {
  let deliveryInfo: string;
  if (order.deliveryType === 'pickup') {
    if (pickupPointDetails) {
      deliveryInfo = `Pickup at: ${pickupPointDetails.name}${pickupPointDetails.address ? `, ${pickupPointDetails.address}` : ''}${pickupPointDetails.city ? `, ${pickupPointDetails.city}` : ''}`;
    } else {
      deliveryInfo = 'Pickup at: Gallery';
    }
  } else {
    deliveryInfo = `Delivery to: ${order.address || ''}, ${order.city || ''}, ${order.postalCode || ''}, ${order.country || ''}`;
  }

  const itemsRows = order.items.map(item => {
    const subtotal = (item.price || 0) * item.quantity;
    return `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #E0E0E0;">${item.title}</td>
        <td style="padding: 12px; border-bottom: 1px solid #E0E0E0; text-transform: capitalize;">${item.itemType}</td>
        <td style="padding: 12px; border-bottom: 1px solid #E0E0E0; text-align: right;">$${item.price?.toFixed(2)}</td>
        <td style="padding: 12px; border-bottom: 1px solid #E0E0E0; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #E0E0E0; text-align: right;">$${subtotal.toFixed(2)}</td>
      </tr>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #F5F5F5; font-family: Arial, sans-serif;">
      <table style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF;">
        <!-- Header -->
        <tr>
          <td style="background-color: #2C2C2C; padding: 24px; text-align: center;">
            <h1 style="color: #D4AF37; font-size: 28px; margin: 0; letter-spacing: 2px;">BEGILDA GALLERY</h1>
          </td>
        </tr>

        <!-- Content -->
        <tr>
          <td style="padding: 32px 24px;">
            <h2 style="color: #2C2C2C; font-size: 24px; margin: 0 0 16px 0;">Order Confirmation</h2>
            <p style="color: #666666; font-size: 16px; line-height: 1.5; margin: 0 0 24px 0;">
              Thank you for your order. We have received your request and will contact you shortly.
            </p>

            <!-- Order Summary -->
            <table style="width: 100%; margin-bottom: 24px;">
              <tr>
                <td style="padding: 8px 0; color: #666666; font-size: 14px;"><strong>Order ID:</strong></td>
                <td style="padding: 8px 0; color: #2C2C2C; font-size: 14px; text-align: right;">${order.id}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666666; font-size: 14px;"><strong>Order Date:</strong></td>
                <td style="padding: 8px 0; color: #2C2C2C; font-size: 14px; text-align: right;">${new Date(order.createdAt!).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666666; font-size: 14px;"><strong>Status:</strong></td>
                <td style="padding: 8px 0; color: #D4AF37; font-size: 14px; text-align: right; text-transform: capitalize;">${order.status}</td>
              </tr>
            </table>

            <!-- Customer Info -->
            <h3 style="color: #2C2C2C; font-size: 18px; margin: 24px 0 12px 0;">Customer Information</h3>
            <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 0;">
              <strong>Name:</strong> ${order.fullName || 'N/A'}<br>
              <strong>Email:</strong> ${order.email}<br>
              <strong>Phone:</strong> ${order.phone || 'N/A'}
            </p>

            <!-- Delivery Info -->
            <h3 style="color: #2C2C2C; font-size: 18px; margin: 24px 0 12px 0;">Delivery Information</h3>
            <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 0;">
              <strong>Type:</strong> ${order.deliveryType === 'pickup' ? 'Pickup' : 'Delivery'}<br>
              ${deliveryInfo}
            </p>

            <!-- Items Table -->
            <h3 style="color: #2C2C2C; font-size: 18px; margin: 24px 0 12px 0;">Order Items</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #F5F5F5;">
                  <th style="padding: 12px; text-align: left; color: #2C2C2C; font-size: 14px;">Item</th>
                  <th style="padding: 12px; text-align: left; color: #2C2C2C; font-size: 14px;">Type</th>
                  <th style="padding: 12px; text-align: right; color: #2C2C2C; font-size: 14px;">Price</th>
                  <th style="padding: 12px; text-align: center; color: #2C2C2C; font-size: 14px;">Qty</th>
                  <th style="padding: 12px; text-align: right; color: #2C2C2C; font-size: 14px;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRows}
              </tbody>
            </table>

            <!-- Total -->
            <table style="width: 100%; margin-top: 16px;">
              <tr>
                <td style="padding: 12px; text-align: right; color: #2C2C2C; font-size: 18px; font-weight: bold;">Total:</td>
                <td style="padding: 12px; text-align: right; color: #D4AF37; font-size: 18px; font-weight: bold;">$${(order.totalAmount || 0).toFixed(2)} USD</td>
              </tr>
            </table>

            <!-- Next Steps -->
            <div style="background-color: #F5F5F5; padding: 16px; margin-top: 24px; border-radius: 4px;">
              <h4 style="color: #2C2C2C; font-size: 16px; margin: 0 0 8px 0;">Next Steps</h4>
              <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 0;">
                We will contact you within 24 hours to confirm your order and provide payment instructions.
              </p>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background-color: #2C2C2C; padding: 24px; text-align: center;">
            <p style="color: #D4AF37; font-size: 14px; margin: 0 0 8px 0;">Contact Us</p>
            <p style="color: #FFFFFF; font-size: 14px; line-height: 1.6; margin: 0;">
              Email: ${process.env.GALLERY_EMAIL || 'info@begilda.gallery'}<br>
              Phone: ${process.env.GALLERY_PHONE || '+7 (XXX) XXX-XX-XX'}<br>
              ${process.env.GALLERY_ADDRESS || 'Almaty, Kazakhstan'}
            </p>
            <p style="color: #999999; font-size: 12px; margin: 16px 0 0 0;">
              Thank you for supporting ${process.env.GALLERY_NAME || 'Begilda Gallery'}
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export function generateOrderConfirmationText(order: Order, pickupPointDetails?: PickupPoint | null): string {
  let deliveryInfo: string;
  if (order.deliveryType === 'pickup') {
    if (pickupPointDetails) {
      deliveryInfo = `Pickup at: ${pickupPointDetails.name}${pickupPointDetails.address ? `, ${pickupPointDetails.address}` : ''}${pickupPointDetails.city ? `, ${pickupPointDetails.city}` : ''}`;
    } else {
      deliveryInfo = 'Pickup at: Gallery';
    }
  } else {
    deliveryInfo = `Delivery to: ${order.address || ''}, ${order.city || ''}, ${order.postalCode || ''}, ${order.country || ''}`;
  }

  const itemsList = order.items.map(item => {
    const subtotal = (item.price || 0) * item.quantity;
    return `- ${item.title} (${item.itemType}) - $${item.price?.toFixed(2)} x ${item.quantity} = $${subtotal.toFixed(2)}`;
  }).join('\n');

  return `
BEGILDA GALLERY
Order Confirmation

Thank you for your order. We have received your request and will contact you shortly.

ORDER SUMMARY
Order ID: ${order.id}
Order Date: ${new Date(order.createdAt!).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
Status: ${order.status}

CUSTOMER INFORMATION
Name: ${order.fullName || 'N/A'}
Email: ${order.email}
Phone: ${order.phone || 'N/A'}

DELIVERY INFORMATION
Type: ${order.deliveryType === 'pickup' ? 'Pickup' : 'Delivery'}
${deliveryInfo}

ORDER ITEMS
${itemsList}

TOTAL: $${(order.totalAmount || 0).toFixed(2)} USD

NEXT STEPS
We will contact you within 24 hours to confirm your order and provide payment instructions.

CONTACT US
Email: ${process.env.GALLERY_EMAIL || 'info@begilda.gallery'}
Address: ${process.env.GALLERY_ADDRESS || 'Almaty, Kazakhstan'}

Thank you for supporting ${process.env.GALLERY_NAME || 'Begilda Gallery'}
  `.trim();
}
