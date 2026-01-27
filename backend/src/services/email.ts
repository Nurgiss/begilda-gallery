import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import type { Order } from '../types/db.js';
import { generateOrderConfirmationHTML, generateOrderConfirmationText } from '../templates/orderConfirmation.js';

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

    let htmlContent: string;
    let textContent: string;

    try {
      htmlContent = generateOrderConfirmationHTML(order);
      textContent = generateOrderConfirmationText(order);
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
