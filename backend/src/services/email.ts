import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import type { Order, PickupPoint } from '../types/db.js';
import { generateOrderConfirmationHTML, generateOrderConfirmationText } from '../templates/orderConfirmation.js';
import { generateBusinessNotificationHTML, generateBusinessNotificationText } from '../templates/businessOrderNotification.js';
import * as pickupPointsRepo from '../repositories/pickupPoints.js';

async function resolvePickupPoint(order: Order): Promise<PickupPoint | null> {
  if (order.deliveryType !== 'pickup' || !order.pickupPoint) {
    return null;
  }
  return pickupPointsRepo.getById(order.pickupPoint);
}

const createTransporter = (): Transporter => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

export async function sendOrderConfirmationEmail(order: Order): Promise<void> {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.warn('Email service not configured: Missing SMTP credentials - order confirmation email not sent');
      return;
    }

    const transporter = createTransporter();

    // Resolve pickup point details if applicable
    const pickupPointDetails = await resolvePickupPoint(order);

    let htmlContent: string;
    let textContent: string;

    try {
      htmlContent = generateOrderConfirmationHTML(order, pickupPointDetails);
      textContent = generateOrderConfirmationText(order, pickupPointDetails);
    } catch (templateError) {
      console.error('Error generating email template:', templateError);
      return;
    }

    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to: order.email,
      subject: `Order Confirmation - ${order.id}`,
      text: textContent,
      html: htmlContent,
    });

    console.log(`Order confirmation email sent to ${order.email} for order ${order.id}`);
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      if (error.stack) {
        console.error('Stack trace:', error.stack);
      }
    }
  }
}

export async function sendBusinessOrderNotification(order: Order): Promise<void> {
  try {
    const recipients = process.env.BUSINESS_NOTIFICATION_EMAILS;
    if (!recipients) {
      console.warn('Business notification not configured: Missing BUSINESS_NOTIFICATION_EMAILS');
      return;
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.warn('Email service not configured: Missing SMTP credentials - business notification not sent');
      return;
    }

    const transporter = createTransporter();

    // Resolve pickup point details if applicable
    const pickupPointDetails = await resolvePickupPoint(order);

    let htmlContent: string;
    let textContent: string;

    try {
      htmlContent = generateBusinessNotificationHTML(order, pickupPointDetails);
      textContent = generateBusinessNotificationText(order, pickupPointDetails);
    } catch (templateError) {
      console.error('Error generating business notification template:', templateError);
      return;
    }

    // Parse comma-separated email list and trim whitespace
    const emailList = recipients.split(',').map(email => email.trim()).filter(Boolean);

    if (emailList.length === 0) {
      console.warn('Business notification: No valid email addresses found');
      return;
    }

    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to: emailList.join(', '),
      subject: `New Order Received - #${order.id}`,
      text: textContent,
      html: htmlContent,
    });

    console.log(`Business order notification sent to ${emailList.join(', ')} for order ${order.id}`);
  } catch (error) {
    console.error('Error sending business order notification:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      if (error.stack) {
        console.error('Stack trace:', error.stack);
      }
    }
  }
}

export async function testEmailConnection(): Promise<boolean> {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('Email service connection verified');
    return true;
  } catch (error) {
    console.error('Email service connection failed:', error);
    return false;
  }
}
