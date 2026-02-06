import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Here you would typically send to backend
    console.log("Form submitted:", formData);
    
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="container py-5">
      {/* Hero Section */}
      <div className="row mb-5">
        <div className="col-12 text-center">
          <h1 className="display-4 fw-bold mb-3">Get In Touch</h1>
          <p className="lead text-black">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </div>

      <div className="row">
        {/* Contact Form */}
        <div className="col-lg-7 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h3 className="h4 mb-4">Send us a Message</h3>
              
              {submitted && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  <strong>✓ Success!</strong> Your message has been sent. We'll get back to you soon!
                  <button type="button" className="btn-close" onClick={() => setSubmitted(false)}></button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="name" className="form-label">Your Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="email" className="form-label">Email Address *</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="subject" className="form-label">Subject *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="How can we help you?"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="message" className="form-label">Message *</label>
                  <textarea
                    className="form-control"
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Tell us more about your inquiry..."
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary btn-lg w-100">
                  <span className="me-2">📧</span> Send Message
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h3 className="h5 mb-4">Contact Information</h3>
              
              <div className="mb-4 px-4">
                <div className="d-flex align-items-start mb-3">
                  <div>
                    <h6 className="mb-1">Address</h6>
                    <p className="text-muted mb-0">
                      123 Business Street<br />
                      Tech Park, Pune<br />
                      Maharashtra, India - 411001
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-start mb-3">
                  <div>
                    <h6 className="mb-1">Email</h6>
                    <p className="text-muted mb-0">
                      <a href="mailto:support@taskflowpro.com" className="text-decoration-none">
                        support@taskflowpro.com
                      </a>
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-start mb-3">
                  <div>
                    <h6 className="mb-1">Phone</h6>
                    <p className="text-muted mb-0">
                      +91 98765 43210<br />
                      <small>Mon-Fri: 9:00 AM - 6:00 PM IST</small>
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-start">
                  <div>
                    <h6 className="mb-1">Business Hours</h6>
                    <p className="text-muted mb-0">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 10:00 AM - 4:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h3 className="h5 mb-4">Follow Us</h3>
              <div className="d-flex gap-3">
                <a href="#" className="btn btn-outline-primary btn-lg flex-grow-1">
                  <i className="bi bi-twitter"></i> Twitter
                </a>
                <a href="https://www.linkedin.com/in/amanmukri" target="_blank" className="btn btn-outline-primary btn-lg flex-grow-1">
                  <i className="bi bi-linkedin"></i> LinkedIn
                </a>
              </div>
              <div className="d-flex gap-3 mt-3">
                <a href="#" className="btn btn-outline-primary btn-lg flex-grow-1">
                  <i className="bi bi-facebook"></i> Facebook
                </a>
                <a href="https://github.com/amanmukri03" target="_blank" className="btn btn-outline-primary btn-lg flex-grow-1">
                  <i className="bi bi-github"></i> GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="row mt-5">
        <div className="col-12">
          <h3 className="h4 text-center mb-4">Frequently Asked Questions</h3>
        </div>
        
        <div className="col-md-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">What is Trello?</h5>
              <p className="card-text text-muted">
                Trello is a comprehensive project management tool designed to help teams 
                collaborate effectively, track progress, and deliver projects on time.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Is there a free trial?</h5>
              <p className="card-text text-muted">
                Yes! We offer a 14-day free trial with full access to all features. 
                No credit card required to get started.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Can I invite team members?</h5>
              <p className="card-text text-muted">
                Absolutely! You can invite unlimited team members with different role 
                permissions (Admin, Manager, Member) to collaborate on projects.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">How secure is my data?</h5>
              <p className="card-text text-muted">
                We use industry-standard encryption and security measures to protect your data. 
                All data is backed up regularly and stored securely.
              </p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Contact;