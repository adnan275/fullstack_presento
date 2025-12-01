import "../styles/Terms.css";

const terms = [
  {
    title: "Custom Order Timelines",
    content:
      "Personalized hampers and Nikah Namas require 5-10 business days. Rush requests are accepted based on availability.",
  },
  {
    title: "Payments",
    content:
      "Secure online payments and UPI are accepted through our UPI QR Scanner. Your order will be confirmed and moved into production as soon as the payment is successfully completed.",
  }, 
  {
    title: "Returns / Exchanges",
    content:
      "As every order is custom-made, returns are not accepted. We’ll fix damage issues reported within 48 hours of delivery.",
  },
  {
    title: "Shipping",
    content:
      "We ship across India via trusted courier partners. Tracking IDs are shared once dispatched.",
  },
];

export default function Terms() {
  return (
    <div className="terms-page">
      <header className="terms-hero">
        <h1>Terms & Experience Guidelines</h1>
        <p>Soft rules to keep your pastel-perfect orders running smoothly.</p>
      </header>
      <section className="terms-grid">
        {terms.map((term) => (
          <article key={term.title} className="terms-card">
            <h3>{term.title}</h3>
            <p>{term.content}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
