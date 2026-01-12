import React from 'react'

const Dashboard = () => {
  return (
    <div className='container-fluid '>
      <div className="row" style={{height:'calc(100vh - 56px)'}}>
        {/* Sidebar */}
        <div className="col-3 bg-light border-end p-3">
          <h5 className="mb-3">Boards</h5>
            <ul className="list-group">
              <li className="list-group-item active">My Board</li>
              <li className="list-group-item ">Sprint Board</li>
              <li className="list-group-item ">Task</li>   
            </ul>

            <button className="btn btn-warning w-100 mt-3">
              + Create Board
            </button>
        </div>
        {/* Main Content */}
        <div className='col-9 p-4'>
          <h4 className=''>Select a board to view tasks</h4>
        </div>
      </div>
        
    </div>
  )
}

export default Dashboard