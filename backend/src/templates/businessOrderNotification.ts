import type { Order, PickupPoint } from '../types/db.js';

export function generateBusinessNotificationHTML(order: Order, pickupPointDetails?: PickupPoint | null): string {
  let deliveryInfo: string;
  if (order.deliveryType === 'pickup') {
    if (pickupPointDetails) {
      deliveryInfo = `${pickupPointDetails.name}${pickupPointDetails.address ? `, ${pickupPointDetails.address}` : ''}${pickupPointDetails.city ? `, ${pickupPointDetails.city}` : ''}`;
    } else {
      deliveryInfo = 'Gallery';
    }
  } else {
    deliveryInfo = `${order.address || ''}, ${order.city || ''}, ${order.postalCode || ''}, ${order.country || ''}`;
  }

  const itemsRows = order.items.map(item => {
    const subtotal = (item.price || 0) * item.quantity;
    return `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #E0E0E0;">${item.title}</td>
        <td style="padding: 10px; border-bottom: 1px solid #E0E0E0; text-transform: capitalize;">${item.itemType}</td>
        <td style="padding: 10px; border-bottom: 1px solid #E0E0E0; text-align: right;">$${item.price?.toFixed(2)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #E0E0E0; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #E0E0E0; text-align: right;">$${subtotal.toFixed(2)}</td>
      </tr>
    `;
  }).join('');

  const paintingCount = order.items.filter(i => i.itemType === 'painting').length;
  const shopItemCount = order.items.filter(i => i.itemType === 'shop').length;

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
          <td style="background-color: #1a5f2a; padding: 20px; text-align: center;">
            <h1 style="color: #FFFFFF; font-size: 22px; margin: 0;">NEW ORDER RECEIVED</h1>
            <p style="color: #FFFFFF; font-size: 14px; margin: 8px 0 0 0; opacity: 0.9;">Order #${order.id}</p>
          </td>
        </tr>

        <!-- Quick Summary -->
        <tr>
          <td style="padding: 20px; background-color: #f8f9fa; border-bottom: 2px solid #1a5f2a;">
            <table style="width: 100%;">
              <tr>
                <td style="text-align: center; padding: 10px;">
                  <p style="margin: 0; font-size: 24px; font-weight: bold; color: #1a5f2a;">$${(order.totalAmount || 0).toFixed(2)}</p>
                  <p style="margin: 4px 0 0 0; font-size: 12px; color: #666;">Total Amount</p>
                </td>
                <td style="text-align: center; padding: 10px; border-left: 1px solid #ddd;">
                  <p style="margin: 0; font-size: 24px; font-weight: bold; color: #2C2C2C;">${order.items.length}</p>
                  <p style="margin: 4px 0 0 0; font-size: 12px; color: #666;">Items (${paintingCount} paintings, ${shopItemCount} shop)</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Content -->
        <tr>
          <td style="padding: 24px;">
            <!-- Customer Info -->
            <h3 style="color: #2C2C2C; font-size: 16px; margin: 0 0 12px 0; border-bottom: 1px solid #eee; padding-bottom: 8px;">Customer Details</h3>
            <table style="width: 100%; margin-bottom: 20px;">
              <tr>
                <td style="padding: 6px 0; color: #666; font-size: 14px; width: 100px;">Name:</td>
                <td style="padding: 6px 0; color: #2C2C2C; font-size: 14px; font-weight: bold;">${order.fullName || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666; font-size: 14px;">Email:</td>
                <td style="padding: 6px 0; color: #2C2C2C; font-size: 14px;"><a href="mailto:${order.email}" style="color: #1a5f2a;">${order.email}</a></td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666; font-size: 14px;">Phone:</td>
                <td style="padding: 6px 0; color: #2C2C2C; font-size: 14px;"><a href="tel:${order.phone || ''}" style="color: #1a5f2a;">${order.phone || 'Not provided'}</a></td>
              </tr>
            </table>

            <!-- Delivery Info -->
            <h3 style="color: #2C2C2C; font-size: 16px; margin: 0 0 12px 0; border-bottom: 1px solid #eee; padding-bottom: 8px;">Delivery</h3>
            <table style="width: 100%; margin-bottom: 20px;">
              <tr>
                <td style="padding: 6px 0; color: #666; font-size: 14px; width: 100px;">Type:</td>
                <td style="padding: 6px 0; color: #2C2C2C; font-size: 14px; font-weight: bold; text-transform: capitalize;">${order.deliveryType || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666; font-size: 14px;">Details:</td>
                <td style="padding: 6px 0; color: #2C2C2C; font-size: 14px;">${deliveryInfo}</td>
              </tr>
            </table>

            <!-- Items Table -->
            <h3 style="color: #2C2C2C; font-size: 16px; margin: 0 0 12px 0; border-bottom: 1px solid #eee; padding-bottom: 8px;">Order Items</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <thead>
                <tr style="background-color: #f8f9fa;">
                  <th style="padding: 10px; text-align: left; color: #2C2C2C;">Item</th>
                  <th style="padding: 10px; text-align: left; color: #2C2C2C;">Type</th>
                  <th style="padding: 10px; text-align: right; color: #2C2C2C;">Price</th>
                  <th style="padding: 10px; text-align: center; color: #2C2C2C;">Qty</th>
                  <th style="padding: 10px; text-align: right; color: #2C2C2C;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRows}
              </tbody>
              <tfoot>
                <tr style="background-color: #f8f9fa;">
                  <td colspan="4" style="padding: 12px; text-align: right; font-weight: bold;">Total:</td>
                  <td style="padding: 12px; text-align: right; font-weight: bold; color: #1a5f2a;">$${(order.totalAmount || 0).toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>

            <!-- Order Meta -->
            <table style="width: 100%; margin-top: 20px; font-size: 12px; color: #666;">
              <tr>
                <td>Order ID: ${order.id}</td>
                <td style="text-align: right;">Created: ${new Date(order.createdAt!).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background-color: #f8f9fa; padding: 16px; text-align: center; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 12px; margin: 0;">
              This is an automated notification from ${process.env.GALLERY_NAME || 'Begilda Gallery'}
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export function generateBusinessNotificationText(order: Order, pickupPointDetails?: PickupPoint | null): string {
  let deliveryInfo: string;
  if (order.deliveryType === 'pickup') {
    if (pickupPointDetails) {
      deliveryInfo = `${pickupPointDetails.name}${pickupPointDetails.address ? `, ${pickupPointDetails.address}` : ''}${pickupPointDetails.city ? `, ${pickupPointDetails.city}` : ''}`;
    } else {
      deliveryInfo = 'Gallery';
    }
  } else {
    deliveryInfo = `${order.address || ''}, ${order.city || ''}, ${order.postalCode || ''}, ${order.country || ''}`;
  }

  const itemsList = order.items.map(item => {
    const subtotal = (item.price || 0) * item.quantity;
    return `- ${item.title} (${item.itemType}) - $${item.price?.toFixed(2)} x ${item.quantity} = $${subtotal.toFixed(2)}`;
  }).join('\n');

  const paintingCount = order.items.filter(i => i.itemType === 'painting').length;
  const shopItemCount = order.items.filter(i => i.itemType === 'shop').length;

  return `
NEW ORDER RECEIVED
==================

Order #${order.id}
Total: $${(order.totalAmount || 0).toFixed(2)} USD
Items: ${order.items.length} (${paintingCount} paintings, ${shopItemCount} shop items)

CUSTOMER DETAILS
----------------
Name: ${order.fullName || 'N/A'}
Email: ${order.email}
Phone: ${order.phone || 'Not provided'}

DELIVERY
--------
Type: ${order.deliveryType || 'N/A'}
Details: ${deliveryInfo}

ORDER ITEMS
-----------
${itemsList}

TOTAL: $${(order.totalAmount || 0).toFixed(2)} USD

---
Order created: ${new Date(order.createdAt!).toLocaleString('en-US')}
This is an automated notification from ${process.env.GALLERY_NAME || 'Begilda Gallery'}
  `.trim();
}
