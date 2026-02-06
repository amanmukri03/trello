import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const About = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="container py-5">
      {/* Hero Section */}
      <div className="row align-items-center mb-5">
        <div className="col-lg-6">
          <h1 className="display-4 fw-bold mb-4">
            Welcome to Trello
          </h1>
          <p className="lead text-muted">
            A powerful, intuitive project management platform designed to help teams collaborate,
            track progress, and deliver results efficiently.
          </p>
        </div>

        <div className="col-lg-6 text-center">
          <div className="p-5 bg-light rounded-3 shadow-sm">
            <h2 className="display-1">📋</h2>
            <p className="text-muted">Manage. Track. Deliver.</p>
          </div>
        </div>
      </div>

      {/* Mission */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-5">
              <h2 className="h3 mb-4">Our Mission</h2>
              <p className="text-muted mb-0">
                We believe that effective project management shouldn't be complicated.
                Trello was built to streamline team workflows, enhance productivity,
                and make collaboration seamless.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="row mb-5">
        <div className="col-12 mb-4">
          <h2 className="h3 text-center mb-4">Key Features</h2>
        </div>

        {[
          { icon: "⏱️", title: "Time Tracking", text: "Track time spent on each task accurately." },
          { icon: "👥", title: "Role-Based Access", text: "Manager and Member roles with permissions." },
          { icon: "🔄", title: "Real-Time Updates", text: "Instant updates with WebSocket support." },
          { icon: "🎨", title: "Kanban Boards", text: "Drag-and-drop task boards." },
          { icon: "📊", title: "Task Prioritization", text: "Low, Medium, High, Urgent priorities." },
          { icon: "📅", title: "Due Date Tracking", text: "Never miss a deadline." },
        ].map((item, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <div className="mb-3" style={{ fontSize: "3rem" }}>{item.icon}</div>
                <h5 className="card-title">{item.title}</h5>
                <p className="card-text text-muted">{item.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="row">
        <div className="col-12">
          <div
            className="card border-0 shadow-sm text-black"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "20px"
            }}
          >
            <div className="card-body text-center p-5">
              <h2 className="h2 mb-3">Ready to Get Started?</h2>
              <p className="mb-4">
                Join thousands of teams already using Trello to manage their projects.
              </p>

              <div>
                {!isAuthenticated ? (
                  <Link to="/register" className="btn btn-success btn-lg me-3">
                    Sign Up Free
                  </Link>
                ) : (
                  <Link to="/dashboard" className="btn btn-primary btn-lg me-3">
                    Go to Dashboard
                  </Link>
                )}

                <Link to="/contact" className="btn btn-outline-light btn-lg">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="row mt-5 text-center">
        <div className="col-md-3">
          <h3 className="display-5 fw-bold">1000+</h3>
          <p className="text-muted">Active Users</p>
        </div>
        <div className="col-md-3">
          <h3 className="display-5 fw-bold">500+</h3>
          <p className="text-muted">Projects Completed</p>
        </div>
        <div className="col-md-3">
          <h3 className="display-5 fw-bold">10K+</h3>
          <p className="text-muted">Tasks Managed</p>
        </div>
        <div className="col-md-3">
          <h3 className="display-5 fw-bold">99.9%</h3>
          <p className="text-muted">Uptime</p>
        </div>
      </div>
    </div>
  );
};

export default About;
