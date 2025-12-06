import React, { useState } from 'react';
import './FAQ.css';

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "How to place an order?",
            answer: "Browse our products, select the items you love, add them to your cart, and proceed to checkout. Fill in your delivery details and complete your order securely using our UPI QR Scanner."
        },
        {
            question: "How long does delivery take?",
            answer: "Standard delivery takes 5-7 business days. Express delivery is available for 2-3 business days. You'll receive a tracking number once your order is shipped."
        },
        {
            question: "How do I track my order?",
            answer: "Once your order is shipped, you'll receive a tracking link via email and SMS. You can also track your order from the 'My Orders' section in your profile."
        },
        {
            question: "Do you offer customization?",
            answer: "Yes! We offer personalization options for many of our products. Contact our support team for special requests."
        },
        {
            question: "What payment options are available?",
            answer: "We accept secure online payments through our UPI QR Scanner. Once the payment is successfully completed, your order will be confirmed and moved into production."
        },
        {
            question: "What if I need support?",
            answer: "Our customer support team is here to help! Reach out via WhatsApp, email, or phone from our Contact page. We typically respond within 24 hours."
        }
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="faq-section">
            <div className="faq-container">
                <div className="faq-header">
                    <h2>Frequently Asked Questions</h2>
                    <p>Got questions? We've got answers!</p>
                </div>

                <div className="faq-list">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`faq-item ${openIndex === index ? 'active' : ''}`}
                        >
                            <button
                                className="faq-question"
                                onClick={() => toggleFAQ(index)}
                            >
                                <span>{faq.question}</span>
                                <svg
                                    className="faq-icon"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M5 7.5L10 12.5L15 7.5"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                            <div className="faq-answer-wrapper">
                                <div className="faq-answer">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
