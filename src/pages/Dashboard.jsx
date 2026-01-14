import React, {useState, useEffect} from 'react'
import api from '../api/axios'

const Dashboard = () => {
  const [ boards, setBoards ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState("");
  const [ selectedBoard, setSelectedBoard ] = useState(null);
  const [ showModal, setShowModal ] = useState(false);
  const [ boardName, setBoardName ] = useState("");
  const [ boardDescription, setBoardDescription ] = useState("");

  // Toast Notification logic
  const [ toast, setToast ] = useState({
    show: false,
    message: "",
    type: "success", //success / danger
  })

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const res = await api.get("/board");
        setBoards(res.data)
      } catch (error) {
        setError(`Failed to load the boards ${error.message}`);
      }
      finally{
        setLoading(false);
      }
    }
    fetchBoards();
  }, []);

  const handleCreateBoard = async () => {
    if(!boardName.trim) return;

    try {
      const res = await api.post("/board", {
         name: boardName,
         description: boardDescription,
      });

      setBoards([...boards, res.data]);
      setToast({
        show: true,
        message: "Board Created Successfully...",
        type: "success",
      });
      setBoardName("");
      setBoardDescription("");
      setShowModal(false);
    } catch (error) {
      setToast({
        show: true,
        message: "Failed to create board!",
        type: "danger",
      });
    }

    // Auto hide toast after 4sec
    setTimeout(() => {
      setToast({...toast, show: false})
    }, 4000);
  }

  return (
    <div className="container-fluid">
      <div className="row" style={{ height: "calc(100vh - 56px)"}}>
        {/* Sidebar */}
        <div className="col-3 bg-light border-end p-3">
          <h5 className="mb-3">Boards</h5>

          {loading && <p>Loading...</p>}
          {error && <p className="text-danger">{error}</p>}

          {/* Empty State Message */}
          {!loading && boards.length === 0 && (
            <p className="text-muted">No boards yet. Create one!</p>
          )}

          <ul className="list-group">

            {boards.map((board) => (
              <li key={board._id} 
                className={`list-group-item ${selectedBoard?._id === board._id ? "active" : ""}`} 
                onClick={() => setSelectedBoard(board)} style={{cursor: "pointer"}}>
                  {board.name}
              </li>
            ))}
          </ul>

          <button className="btn btn-warning w-100 mt-3"
          onClick={() => setShowModal(true)}>
            + Create Board
          </button>
        </div>

        {/* Main Content */}
        <div className="col-9 p-4">
          {!selectedBoard ? (
            <h4>Select a board to view tasks.</h4>
          ) : (
            <>
              <h4>{selectedBoard.name}</h4>
              <p className="text-muted">{selectedBoard.description}</p>
            </>
          )}
        </div>

        {/* Board create logic */}

        {showModal && (
          <div className="modal fade show d-block" tabIndex="">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Create Board</h5>
                  <button type="btn-close" className="btn-close"
                  onClick={() => setShowModal(false)}/>
                </div>
                <div className="modal-body">
                  <input type="text" className='form-control' placeholder='Board Name' value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                  />

                  <textarea className="form-control" placeholder='board description' rows="3" value={boardDescription}
                  onChange={(e) => setBoardDescription(e.target.value)}></textarea>
                </div>
                <div className="modal-footer p-2">
                  <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleCreateBoard}>Create</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Display toast */}
      {toast.show && (
        <div className="toast-container position-fixed bottom- end- p-3" style={{zIndex: 1000}}>
          <div className={`toast show text-bg-${toast.type}`}>
            <div className="toast-body">
              {toast.message}
            </div>
          </div>
        </div>

      )}
    </div>
  )
}

export default Dashboard