import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="container py-5" >
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
  
        <div className="col-lg-6 text-center" > 
          <div className="p-5 bg-light rounded-3 shadow-sm">
            <h2 className="display-1">📋</h2>
            <p className="text-muted">Manage. Track. Deliver.</p>
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-5">
              <h2 className="h3 mb-4">Our Mission</h2>
              <p className="text-muted mb-0">
                We believe that effective project management shouldn't be complicated. 
                Trello was built to streamline team workflows, enhance productivity, 
                and make collaboration seamless. Whether you're a startup or an enterprise, 
                our platform adapts to your needs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="row mb-5">
        <div className="col-12 mb-4">
          <h2 className="h3 text-center mb-4">Key Features</h2>
        </div>
        
        <div className="col-md-4 mb-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center p-4">
              <div className="mb-3" style={{fontSize: "3rem"}}>⏱️</div>
              <h5 className="card-title">Time Tracking</h5>
              <p className="card-text text-muted">
                Track time spent on each task with built-in timer functionality. 
                Multiple sessions supported for accurate time management.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center p-4">
              <div className="mb-3" style={{fontSize: "3rem"}}>👥</div>
              <h5 className="card-title">Role-Based Access</h5>
              <p className="card-text text-muted">
                Admin, Manager, and Member roles with customized permissions 
                ensure security and proper workflow management.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center p-4">
              <div className="mb-3" style={{fontSize: "3rem"}}>🔄</div>
              <h5 className="card-title">Real-Time Updates</h5>
              <p className="card-text text-muted">
                See changes instantly with WebSocket technology. 
                Your team stays synchronized without refreshing.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center p-4">
              <div className="mb-3" style={{fontSize: "3rem"}}>🎨</div>
              <h5 className="card-title">Kanban Boards</h5>
              <p className="card-text text-muted">
                Visualize your workflow with drag-and-drop Kanban boards. 
                Customize columns to match your process.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center p-4">
              <div className="mb-3" style={{fontSize: "3rem"}}>📊</div>
              <h5 className="card-title">Task Prioritization</h5>
              <p className="card-text text-muted">
                Set priority levels (Low, Medium, High, Urgent) to help 
                your team focus on what matters most.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center p-4">
              <div className="mb-3" style={{fontSize: "3rem"}}>📅</div>
              <h5 className="card-title">Due Date Tracking</h5>
              <p className="card-text text-muted">
                Never miss a deadline with due date notifications 
                and overdue indicators on tasks.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="row mb-5">
        <div className="col-12 mb-4">
          <h2 className="h3 text-center mb-4">How It Works</h2>
        </div>

        <div className="col-md-3 mb-4">
          <div className="text-center">
            <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                 style={{width: "60px", height: "60px", fontSize: "1.5rem"}}>
              1
            </div>
            <h5>Create a Board</h5>
            <p className="text-muted small">
              Set up your project workspace with a custom board name and description.
            </p>
          </div>
        </div>

        <div className="col-md-3 mb-4">
          <div className="text-center">
            <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                 style={{width: "60px", height: "60px", fontSize: "1.5rem"}}>
              2
            </div>
            <h5>Add Columns</h5>
            <p className="text-muted small">
              Create workflow stages like "To Do", "In Progress", and "Done".
            </p>
          </div>
        </div>

        <div className="col-md-3 mb-4">
          <div className="text-center">
            <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                 style={{width: "60px", height: "60px", fontSize: "1.5rem"}}>
              3
            </div>
            <h5>Create Tasks</h5>
            <p className="text-muted small">
              Add tasks with details, assign team members, set priorities and deadlines.
            </p>
          </div>
        </div>

        <div className="col-md-3 mb-4">
          <div className="text-center">
            <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                 style={{width: "60px", height: "60px", fontSize: "1.5rem"}}>
              4
            </div>
            <h5>Track Progress</h5>
            <p className="text-muted small">
              Monitor time spent, move tasks through stages, and complete projects.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="row" style={{backgroundColor:'white', color:'black',borderRadius:'20px'}}>
        <div className="col-12">
          <div className="card border-0 shadow-sm bg-gradient text-black" 
               style={{background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"}}>
            <div className="card-body text-center p-5">
              <h2 className="h2 mb-3">Ready to Get Started?</h2>
              <p className="mb-4">
                Join thousands of teams already using Trello to manage their projects.
              </p>
              <div>
                <Link to="/register" className="btn btn-success btn-lg me-3">
                  Sign Up Free
                </Link>
                <Link to="/contact" className="btn btn-outline-primary btn-lg">
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