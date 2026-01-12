import React from 'react'
import { Link } from 'react-router-dom'

const Landing = () => {
  return (
    <>
      {/* HERO SECTION */}
      <div className="bg-dark text-light py-5">
        <div className="container text-center py-5">
          <h1 className="display-4 fw-bold">
            Manage Your Work Smarter
          </h1>

          <p className="lead text-secondary mt-3 mx-auto" style={{ maxWidth: "800px" }}>
            Organize tasks, track progress, and collaborate with your team —
            all in one powerful and easy-to-use platform.
          </p>

          <div className="mt-4 d-flex justify-content-center gap-3">
            <Link to="/register" className="btn btn-primary btn-lg px-4">
              Get Started Free
            </Link>

            <Link to="/login" className="btn btn-outline-light btn-lg px-4">
              Login
            </Link>
          </div>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="container py-5">
        <h2 className="text-center fw-bold mb-5">
          Everything You Need to Manage Work
        </h2>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0 text-center p-4">
              <h5 className="fw-bold">Boards & Tasks</h5>
              <p className="text-muted mt-2">
                Create boards, add tasks, and organize your workflow clearly and efficiently.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0 text-center p-4">
              <h5 className="fw-bold">Team Collaboration</h5>
              <p className="text-muted mt-2">
                Work together with your team, assign tasks, and stay aligned in real time.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0 text-center p-4">
              <h5 className="fw-bold">Track Progress</h5>
              <p className="text-muted mt-2">
                Monitor task completion and project progress with ease.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CALL TO ACTION */}
      <div className="bg-light py-5">
        <div className="container text-center">
          <h2 className="fw-bold">
            Start Managing Your Projects Today
          </h2>

          <p className="text-muted mt-2">
            Sign up for free and take control of your workflow.
          </p>

          <Link className="btn btn-primary btn-lg mt-3 px-4" to="/register">
            Create Free Account
          </Link>
        </div>
      </div>
    </>
  )
}

export default Landing
