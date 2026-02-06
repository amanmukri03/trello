import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div>
      {/* Hero Section */}
      <section 
        className="bg-gradient text-white py-5 position-relative overflow-hidden" 
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
          minHeight: "650px"
        }}
      >

        
        <div className="container position-relative" style={{zIndex: 1}}>
          <div className="row align-items-center" style={{minHeight: "550px"}}>
            <div className="col-lg-6 mb-5 mb-lg-0">
              <div className="mb-3">
                <span className="badge bg-warning text-dark px-3 py-2">
                  Now with Real-Time Collaboration
                </span>
              </div>
              <h1 className="display-2 fw-bold mb-4">
                Manage Projects <br />
                Like a <span className="text-warning">Pro</span>
              </h1>
              <p className="lead mb-4 fs-5">
                Trello helps teams collaborate effectively, track time, 
                and deliver projects on schedule. Simple, powerful, and built for modern teams.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3 mb-4">
                <Link to="/register" className="btn btn-warning btn-lg px-5 shadow">
                  Get Started Free
                </Link>
                <Link to="/login" className="btn btn-outline-light btn-lg px-5">
                  <span className="me-2">🔐</span> Login
                </Link>
              </div>
              <div className="d-flex flex-wrap gap-4 text-sm">
                <div>
                  <span className="me-2">✓</span> No credit card required
                </div>
                <div>
                  <span className="me-2">✓</span> Free 14-day trial
                </div>
                <div>
                  <span className="me-2">✓</span> Cancel anytime
                </div>
              </div>
            </div>
            
            <div className="col-lg-6">
              <div className="p-4">
                <div className="card border-0 shadow-lg">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h5 className="mb-0">Live Dashboard</h5>
                      <span className="badge bg-success">Real-time</span>
                    </div>
                    
                    <div className="row g-3 mb-3">
                      <div className="col-6">
                        <div className="bg-primary bg-opacity-10 rounded-3 p-3 text-center">
                          <div className="display-6 fw-bold text-primary mb-1">125</div>
                          <small className="text-muted">Active Tasks</small>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="bg-success bg-opacity-10 rounded-3 p-3 text-center">
                          <div className="display-6 fw-bold text-success mb-1">48</div>
                          <small className="text-muted">Completed</small>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-warning bg-opacity-10 rounded-3 p-3 text-center mb-3">
                      <div className="display-6 fw-bold text-warning mb-1">12</div>
                      <small className="text-muted">Team Members</small>
                    </div>
                    
                    <div className="progress" style={{height: "8px"}}>
                      <div className="progress-bar bg-success" style={{width: "75%"}}></div>
                    </div>
                    <div className="d-flex justify-content-between mt-2">
                      <small className="text-muted">Project Progress</small>
                      <small className="text-success fw-bold">75%</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-dark text-white py-4">
        <div className="container">
          <div className="row text-center">
            <div className="col-6 col-md-3 mb-3 mb-md-0">
              <div className="h2 fw-bold mb-1">1000+</div>
              <small className="text-white-50">Active Users</small>
            </div>
            <div className="col-6 col-md-3 mb-3 mb-md-0">
              <div className="h2 fw-bold mb-1">500+</div>
              <small className="text-white-50">Projects</small>
            </div>
            <div className="col-6 col-md-3">
              <div className="h2 fw-bold mb-1">10K+</div>
              <small className="text-white-50">Tasks</small>
            </div>
            <div className="col-6 col-md-3">
              <div className="h2 fw-bold mb-1">99.9%</div>
              <small className="text-white-50">Uptime</small>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <div className="container py-5">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <h2 className="display-5 fw-bold mb-3">Everything You Need to Succeed</h2>
              <p className="lead text-muted col-lg-8 mx-auto">
                Powerful features designed to make project management effortless and efficient
              </p>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm hover-card">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-primary bg-opacity-10 rounded-3 p-3 me-3">
                      <span style={{fontSize: "2rem"}}>⏱️</span>
                    </div>
                    <h4 className="mb-0">Time Tracking</h4>
                  </div>
                  <p className="text-muted mb-0">
                    Built-in timer with automatic session tracking. Monitor time spent on tasks 
                    with precision and generate detailed time reports.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm hover-card">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-success bg-opacity-10 rounded-3 p-3 me-3">
                      <span style={{fontSize: "2rem"}}>🎨</span>
                    </div>
                    <h4 className="mb-0">Kanban Boards</h4>
                  </div>
                  <p className="text-muted mb-0">
                    Intuitive drag-and-drop interface. Visualize your workflow and 
                    customize columns to match your team's process perfectly.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm hover-card">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-warning bg-opacity-10 rounded-3 p-3 me-3">
                      <span style={{fontSize: "2rem"}}>👥</span>
                    </div>
                    <h4 className="mb-0">Team Collaboration</h4>
                  </div>
                  <p className="text-muted mb-0">
                    Assign tasks, track progress, and communicate effectively. 
                    Role-based permissions (Admin, Manager, Member) ensure security.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm hover-card">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-danger bg-opacity-10 rounded-3 p-3 me-3">
                      <span style={{fontSize: "2rem"}}>🔄</span>
                    </div>
                    <h4 className="mb-0">Real-Time Sync</h4>
                  </div>
                  <p className="text-muted mb-0">
                    See updates instantly with WebSocket technology. Perfect for remote 
                    teams working together across different time zones.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm hover-card">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-info bg-opacity-10 rounded-3 p-3 me-3">
                      <span style={{fontSize: "2rem"}}>📊</span>
                    </div>
                    <h4 className="mb-0">Priority Management</h4>
                  </div>
                  <p className="text-muted mb-0">
                    Set task priorities (Low, Medium, High, Urgent) with color-coded badges. 
                    Help your team focus on critical work first.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm hover-card">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-secondary bg-opacity-10 rounded-3 p-3 me-3">
                      <span style={{fontSize: "2rem"}}>📅</span>
                    </div>
                    <h4 className="mb-0">Deadline Tracking</h4>
                  </div>
                  <p className="text-muted mb-0">
                    Set due dates with calendar integration. Get visual alerts for overdue 
                    tasks and never miss an important deadline.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-5 bg-white">
        <div className="container py-5">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <span className="badge bg-success px-3 py-2 mb-3">HOW IT WORKS</span>
              <h2 className="display-5 fw-bold mb-3">Get Started in 4 Simple Steps</h2>
              <p className="lead text-muted col-lg-8 mx-auto">
                From signup to project delivery in minutes, not hours
              </p>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-3 col-md-6">
              <div className="text-center">
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center shadow mb-4" 
                     style={{width: "100px", height: "100px", fontSize: "2.5rem", fontWeight: "bold"}}>
                  1
                </div>
                
                <h5 className="fw-bold mb-3">Create Account</h5>
                <p className="text-muted">
                  Sign up in seconds with just your email. No credit card required for trial.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="text-center">
                <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center shadow mb-4" 
                     style={{width: "100px", height: "100px", fontSize: "2.5rem", fontWeight: "bold"}}>
                  2
                </div>
                
                <h5 className="fw-bold mb-3">Set Up Board</h5>
                <p className="text-muted">
                  Create your project workspace and customize columns for your workflow.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="text-center">
                <div className="bg-warning text-white rounded-circle d-inline-flex align-items-center justify-content-center shadow mb-4" 
                     style={{width: "100px", height: "100px", fontSize: "2.5rem", fontWeight: "bold"}}>
                  3
                </div>
                
                <h5 className="fw-bold mb-3">Add Tasks</h5>
                <p className="text-muted">
                  Create tasks, assign team members, set priorities and deadlines.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="text-center">
                <div className="bg-danger text-white rounded-circle d-inline-flex align-items-center justify-content-center shadow mb-4" 
                     style={{width: "100px", height: "100px", fontSize: "2.5rem", fontWeight: "bold"}}>
                  4
                </div>
                
                <h5 className="fw-bold mb-3">Track & Deliver</h5>
                <p className="text-muted">
                  Monitor progress with real-time updates and deliver projects on time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {/* <section className="py-5 bg-light">
        <div className="container py-5">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <span className="badge bg-warning px-3 py-2 mb-3">TESTIMONIALS</span>
              <h2 className="display-5 fw-bold mb-3">Loved by Teams Worldwide</h2>
              <p className="lead text-muted col-lg-8 mx-auto">
                See what our users have to say about Trello
              </p>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div className="card border-0 shadow-sm h-100 hover-card">
                <div className="card-body p-4">
                  <div className="mb-3">
                    <span className="text-warning fs-5">★★★★★</span>
                  </div>
                  <p className="mb-4">
                    "Trello completely transformed our workflow. The time tracking feature 
                    alone has improved our productivity by 40%. Highly recommended!"
                  </p>
                  <div className="d-flex align-items-center">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3 fw-bold" 
                         style={{width: "50px", height: "50px", fontSize: "1.2rem"}}>
                      SJ
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold">Sarah Johnson</h6>
                      <small className="text-muted">Project Manager, Tech Corp</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="card border-0 shadow-sm h-100 hover-card">
                <div className="card-body p-4">
                  <div className="mb-3">
                    <span className="text-warning fs-5">★★★★★</span>
                  </div>
                  <p className="mb-4">
                    "The interface is clean and intuitive. Real-time collaboration keeps everyone 
                    in sync. Best project management tool we've used so far!"
                  </p>
                  <div className="d-flex align-items-center">
                    <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-3 fw-bold" 
                         style={{width: "50px", height: "50px", fontSize: "1.2rem"}}>
                      MC
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold">Michael Chen</h6>
                      <small className="text-muted">CTO, StartupHub</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 mx-auto">
              <div className="card border-0 shadow-sm h-100 hover-card">
                <div className="card-body p-4">
                  <div className="mb-3">
                    <span className="text-warning fs-5">★★★★★</span>
                  </div>
                  <p className="mb-4">
                    "Finally, a tool that doesn't feel overwhelming. Simple yet powerful. 
                    Our team adopted it in just one day. Love it!"
                  </p>
                  <div className="d-flex align-items-center">
                    <div className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center me-3 fw-bold" 
                         style={{width: "50px", height: "50px", fontSize: "1.2rem"}}>
                      PS
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold">Priya Sharma</h6>
                      <small className="text-muted">Team Lead, Design Co</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-5 bg-gradient text-white position-relative overflow-hidden" 
               style={{background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"}}>

        
        <div className="container py-5 position-relative" style={{zIndex: 1}}>
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <h2 className="display-4 fw-bold mb-4">
                Ready to Transform Your Team's Productivity?
              </h2>
              <p className="lead mb-5 fs-4">
                Join thousands of teams managing projects more efficiently. 
                Start your free 14-day trial today.
              </p>
              <div className="d-flex flex-column flex-sm-row justify-content-center gap-3 mb-4">
                <Link to="/register" className="btn btn-warning btn-lg px-5 shadow">
                   Start Free Trial
                </Link>
                <Link to="/contact" className="btn btn-outline-light btn-lg px-5">
                   Contact Sales
                </Link>
              </div>
              <p className="mb-0">
                <small>No credit card required • Free 14-day trial • Cancel anytime</small>
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-dark text-white py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-4">
              <h5 className="fw-bold mb-3">
                Trello
              </h5>
              <p className="text-white-50">
                Professional project management made simple. 
                Collaborate, track, and deliver with confidence.
              </p>
            </div>
            
            <div className="col-lg-2 col-md-4">
              <h6 className="fw-bold mb-3">Product</h6>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <a href="#features" className="text-white-50 text-decoration-none">Features</a>
                </li>
                <li className="mb-2">
                  <Link to="/about" className="text-white-50 text-decoration-none">About</Link>
                </li>
                <li className="mb-2">
                  <a href="#testimonials" className="text-white-50 text-decoration-none">Reviews</a>
                </li>
              </ul>
            </div>
            
            <div className="col-lg-2 col-md-4">
              <h6 className="fw-bold mb-3">Company</h6>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <Link to="/about" className="text-white-50 text-decoration-none">About Us</Link>
                </li>
                <li className="mb-2">
                  <Link to="/contact" className="text-white-50 text-decoration-none">Contact</Link>
                </li>
              </ul>
            </div>
            
            <div className="col-lg-2 col-md-4">
              <h6 className="fw-bold mb-3">Legal</h6>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <a href="#" className="text-white-50 text-decoration-none">Privacy</a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-white-50 text-decoration-none">Terms</a>
                </li>
              </ul>
            </div>
            
            <div className="col-lg-2 col-md-4">
              <h6 className="fw-bold mb-3">Connect</h6>
              <div className="d-flex gap-2">
                <a href="#" className="btn btn-outline-light btn-sm">Twitter</a>
                <a href="#" className="btn btn-outline-light btn-sm">LinkedIn</a>
              </div>
            </div>
          </div>
          
          <hr className="my-4 bg-white opacity-25" />
          
          <div className="row">
            <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
              <p className="mb-0 text-white-50">© 2026 Trello. All rights reserved.</p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <span className="text-white-50">Made with ❤️ in India</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom CSS */}
      <style>{`
        .hover-card {
          transition: all 0.3s ease;
        }
        .hover-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 1rem 3rem rgba(0,0,0,.175)!important;
        }
        
        @media (max-width: 991px) {
          .display-2 {
            font-size: 2.5rem;
          }
          .display-4 {
            font-size: 2rem;
          }
          .display-5 {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Landing;