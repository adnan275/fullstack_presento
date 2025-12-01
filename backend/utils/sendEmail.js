import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const {
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_USER,
    EMAIL_PASS,
    ORDER_NOTIFY_EMAIL = "adnan.ashar7869@gmail.com",
    ORDER_NOTIFY_NAME = "Presento Treasure Alerts",
} = process.env;

let cachedTransporter = null;

const getTransporter = () => {
    if (!EMAIL_USER || !EMAIL_PASS) {
        console.warn("Email credentials missing. Skipping order notification email.");
        return null;
    }

    if (cachedTransporter) {
        return cachedTransporter;
    }

    cachedTransporter = nodemailer.createTransport({
        host: EMAIL_HOST || "smtp.gmail.com",
        port: EMAIL_PORT ? Number(EMAIL_PORT) : 465,
        secure: EMAIL_PORT ? Number(EMAIL_PORT) === 465 : true,
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS,
        },
    });

    return cachedTransporter;
};

const formatDate = (dateString) => {
    try {
        return new Date(dateString).toLocaleString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return dateString;
    }
};

export async function sendOrderEmail(order) {
    const transporter = getTransporter();
    if (!transporter) return;

    const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = order.items.reduce(
        (sum, item) => sum + item.quantity * (item.price || item.product?.price || 0),
        0
    );

    const subject = `New Order #${order.id} - ₹${totalAmount}`;
    const plainText = [
        "A new order has been received.",
        "",
        `Order ID: #${order.id}`,
        `Total Amount: ₹${totalAmount}`,
        `Items: ${totalItems}`,
        `Placed On: ${formatDate(order.createdAt)}`,
        order.user?.name ? `Customer: ${order.user.name}` : "",
        order.user?.email ? `Email: ${order.user.email}` : "",
        "",
        "Please prepare the order promptly.",
    ]
        .filter(Boolean)
        .join("\n");

    const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; color:#111;">
      <h2 style="color:#db2777;">New Order Received</h2>
      <p>A new order has been placed on Presento Treasure.</p>
      <ul style="line-height:1.6;">
        <li><strong>Order ID:</strong> #${order.id}</li>
        <li><strong>Total Amount:</strong> ₹${totalAmount}</li>
        <li><strong>Items:</strong> ${totalItems}</li>
        <li><strong>Placed On:</strong> ${formatDate(order.createdAt)}</li>
        ${order.user?.name
            ? `<li><strong>Customer:</strong> ${order.user.name}</li>`
            : ""
        }
        ${order.user?.email
            ? `<li><strong>Email:</strong> ${order.user.email}</li>`
            : ""
        }
      </ul>
      <p style="margin-top:1rem;">Please prepare the order.</p>
    </div>
  `;

    await transporter.sendMail({
        from: `"${ORDER_NOTIFY_NAME}" <${EMAIL_USER || "no-reply@presento.com"}>`,
        to: ORDER_NOTIFY_EMAIL,
        subject,
        text: plainText,
        html,
    });
}
