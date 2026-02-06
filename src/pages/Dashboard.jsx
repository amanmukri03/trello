import React, { useState, useEffect } from "react";
import api from "../api/axios";
import socket from "../socket";
import '../styles/Dashboard.css'

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const Dashboard = () => {
  const [boards, setBoards] = useState([]);
  const [columns, setColumns] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [taskLoading, setTaskLoading] = useState(false);

  const [selectedBoard, setSelectedBoard] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [boardName, setBoardName] = useState("");
  const [boardDescription, setBoardDescription] = useState("");

  const [showTaskModel, setShowTaskModel] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [activeColumnId, setActiveColumnId] = useState(null);

  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");

  const [editingTask, setEditingTask] = useState(null);

  const [showColumnModal, setShowColumnModal] = useState(false);
  const [columnName, setColumnName] = useState("");

  const [userRole, setUserRole] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const [runningTimers, setRunningTimers] = useState({});

  // ✅ NEW: Board Edit/Delete States
  const [showEditBoardModal, setShowEditBoardModal] = useState(false);
  const [editingBoard, setEditingBoard] = useState(null);
  const [showDeleteBoardDialog, setShowDeleteBoardDialog] = useState(false);
  const [boardToDelete, setBoardToDelete] = useState(null);

  // ✅ NEW: Column Edit/Delete States
  const [showEditColumnModal, setShowEditColumnModal] = useState(false);
  const [editingColumn, setEditingColumn] = useState(null);
  const [showDeleteColumnDialog, setShowDeleteColumnDialog] = useState(false);
  const [columnToDelete, setColumnToDelete] = useState(null);

  // ✅ NEW: Sidebar toggle for mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // ✅ Get user role from localStorage
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserRole(user.role || "");
        setCurrentUser(user);
        console.log("✅ Current User:", {
          role: user.role,
          id: user._id,
          name: user.name,
        });
        return;
      } catch (err) {
        console.error("Failed to parse user:", err);
      }
    }

    const fetchCurrentUser = async () => {
      try {
        const res = await api.get("/auth/me");
        setUserRole(res.data.role || "");
        setCurrentUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchCurrentUser();
  }, []);

  // ✅ Timer update logic
  useEffect(() => {
    const interval = setInterval(() => {
      setRunningTimers((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((taskId) => {
          updated[taskId] += 1;
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ✅ Fetch Boards
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const res = await api.get("/boards");
        setBoards(res.data);
      } catch (error) {
        setError(`Failed to load the boards ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchBoards();
  }, []);

  // ✅ Fetch columns + tasks
  useEffect(() => {
    if (!selectedBoard) return;

    const fetchBoardData = async () => {
      try {
        setTaskLoading(true);
        const [colRes, taskRes] = await Promise.all([
          api.get(`/columns/${selectedBoard._id}`),
          api.get(`/tasks/${selectedBoard._id}`),
        ]);
        setColumns(colRes.data);
        setTasks(taskRes.data);

        const timers = {};
        taskRes.data.forEach((task) => {
          if (task.timer?.isRunning) {
            const elapsed = Math.floor(
              (Date.now() - new Date(task.timer.startedAt).getTime()) / 1000
            );
            timers[task._id] = task.timer.totalSeconds + elapsed;
          }
        });
        setRunningTimers(timers);
      } catch {
        setError(`Failed to load board data`);
      } finally {
        setTaskLoading(false);
      }
    };
    fetchBoardData();
    socket.emit("joinBoard", selectedBoard._id);
  }, [selectedBoard]);

  // ✅ Listen to socket events
  useEffect(() => {
    socket.on("columnCreated", (newColumn) => {
      setColumns((prev) => {
        const exists = prev.some((col) => col._id === newColumn._id);
        if (exists) {
          console.log("⚠️ Column already exists, skipping:", newColumn._id);
          return prev;
        }
        console.log("✅ Adding new column:", newColumn.name);
        return [...prev, newColumn];
      });
    });

    socket.on("taskCreated", (task) => {
      setTasks((prev) => {
        const exists = prev.some((t) => t._id === task._id);
        if (exists) return prev;
        return [...prev, task];
      });
    });

    socket.on("taskUpdated", (updatedTask) => {
      console.log("📡 Socket: taskUpdated received:", updatedTask);

      setTasks((prev) => {
        const taskExists = prev.some((t) => t._id === updatedTask._id);
        if (!taskExists) {
          return [...prev, updatedTask];
        }
        return prev.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        );
      });

      // ✅ Update timer state
      if (updatedTask.timer?.isRunning) {
        const elapsed = Math.floor(
          (Date.now() - new Date(updatedTask.timer.startedAt).getTime()) / 1000
        );
        setRunningTimers((prev) => ({
          ...prev,
          [updatedTask._id]: updatedTask.timer.totalSeconds + elapsed,
        }));
      } else {
        setRunningTimers((prev) => {
          const updated = { ...prev };
          delete updated[updatedTask._id];
          return updated;
        });
      }
    });

    socket.on("taskDeleted", (taskId) => {
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
      setRunningTimers((prev) => {
        const updated = { ...prev };
        delete updated[taskId];
        return updated;
      });
    });

    return () => {
      socket.off("columnCreated");
      socket.off("taskCreated");
      socket.off("taskUpdated");
      socket.off("taskDeleted");
    };
  }, []);

  // ✅ Helper: Find "In Progress" column intelligently
  const getInProgressColumn = () => {
    return columns.find((col) => {
      const name = col.name.toLowerCase().replace(/[^a-z]/g, "");
      return (
        name === "inprogress" ||
        name === "progress" ||
        name === "ongoing" ||
        name === "working"
      );
    });
  };

  // ✅ Helper: Check if column is "Done/Completed"
  const isDoneColumn = (column) => {
    if (!column) return false;
    const name = column.name.toLowerCase().replace(/[^a-z]/g, "");
    return (
      name === "done" ||
      name === "completed" ||
      name === "finished" ||
      name === "closed"
    );
  };

  // ✅ Create board
  const handleCreateBoard = async () => {
    if (!boardName.trim()) return;

    try {
      const res = await api.post("/boards", {
        name: boardName,
        description: boardDescription,
      });

      setBoards([...boards, res.data]);
      showToast("Board created successfully!", "success");
      setBoardName("");
      setBoardDescription("");
      setShowModal(false);
    } catch {
      showToast("Failed to create board!", "danger");
    }
  };

  // ✅ NEW: Edit Board
  const handleEditBoard = (board, e) => {
    e.stopPropagation();
    setEditingBoard(board);
    setBoardName(board.name);
    setBoardDescription(board.description || "");
    setShowEditBoardModal(true);
  };

  // ✅ NEW: Update Board
  const handleUpdateBoard = async () => {
    if (!boardName.trim() || !editingBoard) return;

    try {
      const res = await api.put(`/boards/${editingBoard._id}`, {
        name: boardName,
        description: boardDescription,
      });

      setBoards(boards.map((b) => (b._id === editingBoard._id ? res.data : b)));

      if (selectedBoard?._id === editingBoard._id) {
        setSelectedBoard(res.data);
      }

      showToast("Board updated successfully!", "success");
      setBoardName("");
      setBoardDescription("");
      setEditingBoard(null);
      setShowEditBoardModal(false);
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to update board!",
        "danger"
      );
    }
  };

  // ✅ NEW: Delete Board Confirmation
  const handleDeleteBoardClick = (board, e) => {
    e.stopPropagation();
    setBoardToDelete(board);
    setShowDeleteBoardDialog(true);
  };

  // ✅ NEW: Delete Board
  const handleDeleteBoard = async () => {
    if (!boardToDelete) return;

    try {
      await api.delete(`/boards/${boardToDelete._id}`);

      setBoards(boards.filter((b) => b._id !== boardToDelete._id));

      if (selectedBoard?._id === boardToDelete._id) {
        setSelectedBoard(null);
        setColumns([]);
        setTasks([]);
      }

      showToast("Board deleted successfully!", "success");
      setBoardToDelete(null);
      setShowDeleteBoardDialog(false);
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to delete board!",
        "danger"
      );
    }
  };

  // ✅ Create Column
  const handleCreateColumn = async () => {
    if (!columnName.trim() || !selectedBoard) return;

    try {
      const res = await api.post("/columns", {
        name: columnName,
        boardId: selectedBoard._id,
      });

      setColumns((prev) => {
        const exists = prev.some((col) => col._id === res.data._id);
        if (exists) return prev;
        return [...prev, res.data];
      });

      showToast("Column created successfully!", "success");
      setColumnName("");
      setShowColumnModal(false);
    } catch (err) {
      console.error("Column creation error:", err);
      showToast("Failed to create column!", "danger");
    }
  };

  // ✅ NEW: Edit Column
  const handleEditColumn = (column, e) => {
    e.stopPropagation();
    setEditingColumn(column);
    setColumnName(column.name);
    setShowEditColumnModal(true);
  };

  // ✅ NEW: Update Column
  const handleUpdateColumn = async () => {
    if (!columnName.trim() || !editingColumn) return;

    try {
      const res = await api.put(`/columns/${editingColumn._id}`, {
        name: columnName,
      });

      setColumns(
        columns.map((c) => (c._id === editingColumn._id ? res.data : c))
      );

      showToast("Column updated successfully!", "success");
      setColumnName("");
      setEditingColumn(null);
      setShowEditColumnModal(false);
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to update column!",
        "danger"
      );
    }
  };

  // ✅ NEW: Delete Column Confirmation
  const handleDeleteColumnClick = (column, e) => {
    e.stopPropagation();
    setColumnToDelete(column);
    setShowDeleteColumnDialog(true);
  };

  // ✅ NEW: Delete Column
  const handleDeleteColumn = async () => {
    if (!columnToDelete) return;

    try {
      await api.delete(`/columns/${columnToDelete._id}`);

      setColumns(columns.filter((c) => c._id !== columnToDelete._id));
      setTasks(tasks.filter((t) => t.columnId !== columnToDelete._id));

      showToast("Column deleted successfully!", "success");
      setColumnToDelete(null);
      setShowDeleteColumnDialog(false);
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to delete column!",
        "danger"
      );
    }
  };

  const getTasksByColumn = (columnId) => {
    return tasks.filter((task) => task.columnId === columnId);
  };

  const handleSaveTask = async () => {
    if (!taskTitle.trim() || !activeColumnId) return;

    try {
      const taskData = {
        title: taskTitle,
        description: taskDescription,
        assignedTo: assignedTo.trim() || null,
        boardId: selectedBoard._id,
        columnId: activeColumnId,
        priority: priority,
        dueDate: dueDate || null,
      };

      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, taskData);
        showToast("Task updated successfully!", "success");
      } else {
        await api.post("/tasks", taskData);
        showToast("Task created successfully!", "success");
      }

      resetTaskForm();
    } catch (error) {
      console.error("Task save error:", error);
      showToast(
        error.response?.data?.message || "Failed to save task!",
        "danger"
      );
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskDescription(task.description || "");
    setAssignedTo(task.assignedTo?.email || task.assignedTo?.name || "");
    setPriority(task.priority || "Medium");
    setDueDate(task.dueDate ? task.dueDate.split("T")[0] : "");
    setActiveColumnId(task.columnId);
    setShowTaskModel(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await api.delete(`/tasks/${taskId}`);
      showToast("Task deleted successfully!", "success");
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to delete task!",
        "danger"
      );
    }
  };

  const handleStartTimer = async (taskId) => {
    try {
      const res = await api.post(`/tasks/${taskId}/start-timer`);
      const updatedTask = res.data;

      console.log("✅ Timer started, received task:", updatedTask);

      if (updatedTask.timer?.isRunning) {
        const elapsed = Math.floor(
          (Date.now() - new Date(updatedTask.timer.startedAt).getTime()) / 1000
        );
        setRunningTimers((prev) => ({
          ...prev,
          [taskId]: updatedTask.timer.totalSeconds + elapsed,
        }));
      }

      const inProgressCol = getInProgressColumn();

      if (inProgressCol && updatedTask.columnId !== inProgressCol._id) {
        try {
          const moveRes = await api.put(`/tasks/${taskId}`, {
            columnId: inProgressCol._id,
          });

          const movedTask = moveRes.data;
          console.log("✅ Task moved, received complete data:", movedTask);

          setTasks((prev) => prev.map((t) => (t._id === taskId ? movedTask : t)));

          showToast(
            `Timer started! Task moved to "${inProgressCol.name}"`,
            "success"
          );
        } catch (err) {
          console.error("Failed to move task:", err);
          setTasks((prev) =>
            prev.map((t) => (t._id === taskId ? updatedTask : t))
          );
          showToast("Timer started!", "success");
        }
      } else {
        setTasks((prev) => prev.map((t) => (t._id === taskId ? updatedTask : t)));

        if (!inProgressCol) {
          showToast(
            'Timer started! (Tip: Create "In Progress" column for auto-move)',
            "info"
          );
        } else {
          showToast("Timer started!", "success");
        }
      }
    } catch (error) {
      console.error("Timer start error:", error);
      showToast(
        error.response?.data?.message || "Failed to start timer!",
        "danger"
      );
    }
  };

  const handleStopTimer = async (taskId) => {
    try {
      const res = await api.post(`/tasks/${taskId}/stop-timer`);
      const task = res.data;

      setRunningTimers((prev) => {
        const updated = { ...prev };
        delete updated[taskId];
        return updated;
      });

      setTasks((prev) => prev.map((t) => (t._id === taskId ? task : t)));

      showToast("Timer stopped!", "success");
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to stop timer!",
        "danger"
      );
    }
  };

  const resetTaskForm = () => {
    setTaskTitle("");
    setTaskDescription("");
    setAssignedTo("");
    setPriority("Medium");
    setDueDate("");
    setActiveColumnId(null);
    setEditingTask(null);
    setShowTaskModel(false);
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      3000
    );
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      Low: "success",
      Medium: "primary",
      High: "warning",
      Urgent: "danger",
    };
    return colors[priority] || "secondary";
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceColumnId = source.droppableId;
    const destColumnId = destination.droppableId;

    if (sourceColumnId !== destColumnId) {
      try {
        const destColumn = columns.find((col) => col._id === destColumnId);
        const isCompletionColumn = isDoneColumn(destColumn);

        const draggedTask = tasks.find((t) => t._id === draggableId);

        if (isCompletionColumn && draggedTask?.timer?.isRunning) {
          console.log("⏸️ Stopping timer before marking complete...");
          try {
            await api.post(`/tasks/${draggableId}/stop-timer`);

            setRunningTimers((prev) => {
              const updated = { ...prev };
              delete updated[draggableId];
              return updated;
            });
          } catch (err) {
            console.error("Failed to stop timer:", err);
          }
        }

        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === draggableId
              ? {
                  ...task,
                  columnId: destColumnId,
                  isCompleted: isCompletionColumn ? true : task.isCompleted,
                  completedAt: isCompletionColumn
                    ? new Date().toISOString()
                    : task.completedAt,
                }
              : task
          )
        );

        const updateData = {
          columnId: destColumnId,
        };

        if (isCompletionColumn) {
          updateData.isCompleted = true;
          updateData.completedAt = new Date().toISOString();
        }

        const res = await api.put(`/tasks/${draggableId}`, updateData);

        setTasks((prevTasks) =>
          prevTasks.map((task) => (task._id === draggableId ? res.data : task))
        );

        showToast(
          isCompletionColumn
            ? `Task completed! ✓ Moved to "${destColumn.name}"`
            : `Task moved to "${destColumn.name}"`,
          "success"
        );
      } catch (error) {
        console.error("Drag error:", error);
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === draggableId ? { ...task, columnId: sourceColumnId } : task
          )
        );

        showToast(
          error.response?.data?.message || "Failed to move task!",
          "danger"
        );
      }
    }
  };

  const isAdminOrManager = userRole === "Admin" || userRole === "Manager";

  const canSeeAssignedTo = (task) => {
    if (isAdminOrManager) return true;
    if (currentUser && task.assignedTo) {
      return (
        task.assignedTo._id === currentUser._id ||
        task.assignedTo.email === currentUser.email
      );
    }
    return false;
  };

  return (
    <div className="container-fluid" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <div className="row" style={{ minHeight: "calc(100vh - 56px)" }}>
        {/* ✅ Sidebar - Responsive with mobile toggle */}
        <div 
          className={`col-lg-3 col-md-4 bg-light border-end p-3 ${sidebarOpen ? 'd-block' : 'd-none d-md-block'}`}
          style={{ 
            position: sidebarOpen ? 'fixed' : 'relative',
            top: sidebarOpen ? '0' : 'auto',
            left: sidebarOpen ? '0' : 'auto',
            height: sidebarOpen ? '100vh' : 'auto',
            zIndex: sidebarOpen ? '1050' : 'auto',
            width: sidebarOpen ? '80%' : 'auto',
            overflowY: 'auto'
          }}
        >
          {/* ✅ Close button for mobile */}
          {sidebarOpen && (
            <button 
              className="btn btn-sm btn-close float-end d-md-none mb-2"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          
          <h5 className="mb-3">Boards</h5>

          {userRole && (
            <div
              className="alert alert-info py-1 px-2 mb-2"
              style={{ fontSize: "0.8rem" }}
            >
              👤 <strong>{userRole}</strong>
              {currentUser && (
                <small className="d-block text-muted">
                  {currentUser.name || currentUser.email}
                </small>
              )}
            </div>
          )}

          {loading && <p>Loading...</p>}
          {error && <p className="text-danger">{error}</p>}

          {!loading && boards.length === 0 && (
            <p className="text-muted">No boards yet. Create one!</p>
          )}

          <ul className="list-group mt-3">
            {boards.map((board) => (
              <li
                key={board._id}
                className={`list-group-item d-flex justify-content-between align-items-center ${
                  selectedBoard?._id === board._id ? "active" : ""
                }`}
                onClick={() => {
                  setSelectedBoard(board);
                  setSidebarOpen(false); // Close sidebar on mobile after selection
                }}
                style={{ cursor: "pointer" }}
              >
                <span>{board.name}</span>

                {isAdminOrManager && (
                  <div className="dropdown" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="btn btn-sm btn-link text-secondary p-0"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <svg
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                      </svg>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={(e) => handleEditBoard(board, e)}
                        >
                          ✏️ Edit
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item text-danger"
                          onClick={(e) => handleDeleteBoardClick(board, e)}
                        >
                          🗑️ Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>

          {isAdminOrManager && (
            <button
              className="btn btn-warning w-100 mt-3"
              onClick={() => setShowModal(true)}
            >
              + Create Board
            </button>
          )}
        </div>

        {/* ✅ Main Content - Responsive */}
        <div className="col-lg-9 col-md-8 col-12 p-3 p-md-4" style={{ backgroundColor: "white", minHeight: "100%" }}>
          {/* ✅ Mobile Menu Toggle */}
          <button 
            className="btn btn-primary d-md-none mb-3"
            onClick={() => setSidebarOpen(true)}
          >
            ☰ Boards
          </button>

          {!selectedBoard ? (
            <div className="text-center mt-5">
              <h4 className="text-muted">📋 Select a board to view tasks</h4>
              <p className="text-secondary">
                Choose a board from the sidebar to get started
              </p>
            </div>
          ) : (
            <>
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-2">
                <div>
                  <h4 className="mb-1">{selectedBoard.name}</h4>
                  <p className="text-muted mb-0">{selectedBoard.description}</p>
                </div>
                {isAdminOrManager && (
                  <button
                    className="btn btn-success"
                    onClick={() => setShowColumnModal(true)}
                  >
                    + Add Column
                  </button>
                )}
              </div>

              {columns.length > 0 && !getInProgressColumn() && (
                <div
                  className="alert alert-warning alert-dismissible fade show"
                  role="alert"
                >
                  💡 <strong>Tip:</strong> Create a column named "In Progress"
                  for automatic task movement when timer starts!
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="alert"
                  ></button>
                </div>
              )}

              <DragDropContext onDragEnd={handleDragEnd}>
                {/* ✅ Responsive columns container with horizontal scroll */}
                <div 
                  className="mt-3" 
                  style={{ 
                    overflowX: "auto",
                    overflowY: "visible",
                    paddingBottom: "20px"
                  }}
                >
                  {columns.length === 0 ? (
                    <div className="text-center mt-5">
                      <h5 className="text-muted">No columns yet!</h5>
                      <p className="text-secondary">
                        {isAdminOrManager
                          ? 'Click "Add Column" to create your workflow (e.g., Todo, In Progress, Done)'
                          : "Ask your admin/manager to create columns"}
                      </p>
                    </div>
                  ) : (
                    <div 
                      className="d-flex gap-3"
                      style={{ 
                        minWidth: "fit-content"
                      }}
                    >
                      {columns.map((col) => (
                        <div 
                          key={col._id}
                          style={{ 
                            minWidth: "320px",
                            maxWidth: "400px",
                            flex: "1 1 320px"
                          }}
                        >
                          <div className="card h-100">
                            <div className="card-header fw-bold d-flex justify-content-between align-items-center">
                              <span>{col.name}</span>

                              <div className="d-flex align-items-center gap-2">
                                <span className="badge bg-secondary">
                                  {getTasksByColumn(col._id).length}
                                </span>

                                {isAdminOrManager && (
                                  <div
                                    className="dropdown"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <button
                                      className="btn btn-sm btn-link text-secondary p-0"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                    >
                                      <svg
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        viewBox="0 0 16 16"
                                      >
                                        <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                                      </svg>
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end">
                                      <li>
                                        <button
                                          className="dropdown-item"
                                          onClick={(e) => handleEditColumn(col, e)}
                                        >
                                          ✏️ Edit
                                        </button>
                                      </li>
                                      <li>
                                        <button
                                          className="dropdown-item text-danger"
                                          onClick={(e) =>
                                            handleDeleteColumnClick(col, e)
                                          }
                                        >
                                          🗑️ Delete
                                        </button>
                                      </li>
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>

                            <Droppable droppableId={col._id}>
                              {(provided, snapshot) => (
                                <div
                                  className="card-body"
                                  style={{
                                    minHeight: "400px",
                                    maxHeight: "70vh",
                                    overflowY: "auto",
                                    backgroundColor: snapshot.isDraggingOver
                                      ? "#e3f2fd"
                                      : "white",
                                    transition: "background-color 0.2s",
                                  }}
                                  ref={provided.innerRef}
                                  {...provided.droppableProps}
                                >
                                  {isAdminOrManager && (
                                    <button
                                      className="btn btn-sm btn-outline-primary w-100 mb-3"
                                      onClick={() => {
                                        setActiveColumnId(col._id);
                                        setEditingTask(null);
                                        resetTaskForm();
                                        setActiveColumnId(col._id);
                                        setShowTaskModel(true);
                                      }}
                                    >
                                      + Add Task
                                    </button>
                                  )}

                                  {taskLoading ? (
                                    <p className="text-center">Loading...</p>
                                  ) : getTasksByColumn(col._id).length === 0 ? (
                                    <p className="text-muted text-center">No Tasks</p>
                                  ) : (
                                    getTasksByColumn(col._id).map((task, index) => (
                                      <Draggable
                                        key={task._id}
                                        draggableId={task._id}
                                        index={index}
                                      >
                                        {(provided, snapshot) => (
                                          <div
                                            className="card mb-2 shadow-sm"
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={{
                                              ...provided.draggableProps.style,
                                              opacity: snapshot.isDragging ? 0.7 : 1,
                                              cursor: "grab",
                                              backgroundColor: task.isCompleted
                                                ? "#f0f9ff"
                                                : "white",
                                              borderLeft: task.isCompleted
                                                ? "4px solid #22c55e"
                                                : task.timer?.isRunning &&
                                                  !task.isCompleted
                                                ? "4px solid #3b82f6"
                                                : "none",
                                            }}
                                          >
                                            <div className="card-body p-2">
                                              <div className="d-flex justify-content-between align-items-start mb-2">
                                                <h6 className="mb-0 flex-grow-1">
                                                  {task.isCompleted ? (
                                                    <s>{task.title}</s>
                                                  ) : (
                                                    task.title
                                                  )}
                                                </h6>
                                                <span
                                                  className={`badge bg-${getPriorityColor(
                                                    task.priority
                                                  )} ms-2`}
                                                  style={{ fontSize: "0.7rem" }}
                                                >
                                                  {task.priority}
                                                </span>
                                              </div>

                                              {task.isCompleted && (
                                                <div className="mb-2">
                                                  <span className="badge bg-success">
                                                    ✓ Completed
                                                  </span>
                                                </div>
                                              )}

                                              {task.timer?.isRunning &&
                                                !task.isCompleted && (
                                                  <div className="mb-2">
                                                    <span className="badge bg-primary">
                                                      🔵 Timer Running
                                                    </span>
                                                  </div>
                                                )}

                                              {task.description && (
                                                <p
                                                  className="text-muted mb-2"
                                                  style={{ fontSize: "0.85rem" }}
                                                >
                                                  {task.description}
                                                </p>
                                              )}

                                              {task.dueDate && (
                                                <div className="mb-2">
                                                  <small
                                                    className={`${
                                                      isOverdue(task.dueDate)
                                                        ? "text-danger fw-bold"
                                                        : "text-secondary"
                                                    }`}
                                                  >
                                                    📅 Due:{" "}
                                                    {new Date(
                                                      task.dueDate
                                                    ).toLocaleDateString()}
                                                    {isOverdue(task.dueDate) &&
                                                      " (Overdue)"}
                                                  </small>
                                                </div>
                                              )}

                                              {canSeeAssignedTo(task) &&
                                                task.assignedTo && (
                                                  <div className="mb-2">
                                                    <small className="text-secondary">
                                                      👤 Assigned to:{" "}
                                                      <strong>
                                                        {task.assignedTo.name ||
                                                          task.assignedTo.email}
                                                      </strong>
                                                    </small>
                                                  </div>
                                                )}

                                              {task.createdBy && (
                                                <div className="mb-2">
                                                  <small className="text-muted">
                                                    📝 Assigned by:{" "}
                                                    {task.createdBy.name ||
                                                      task.createdBy.email ||
                                                      "Unknown"}
                                                    {task.createdBy.role &&
                                                      ` (${task.createdBy.role})`}
                                                  </small>
                                                </div>
                                              )}

                                              <div className="mb-2 p-2 bg-light rounded">
                                                {task.isCompleted ? (
                                                  <div className="text-center">
                                                    <small className="text-success fw-bold">
                                                      ⏱️ Total:{" "}
                                                      {formatTime(
                                                        task.timer?.totalSeconds || 0
                                                      )}
                                                    </small>
                                                    {task.timer?.sessions?.length >
                                                      0 && (
                                                      <small className="text-muted d-block">
                                                        Sessions:{" "}
                                                        {task.timer.sessions.length}
                                                      </small>
                                                    )}
                                                  </div>
                                                ) : (
                                                  <>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                      <small className="text-secondary">
                                                        ⏱️{" "}
                                                        {runningTimers[task._id]
                                                          ? formatTime(
                                                              runningTimers[task._id]
                                                            )
                                                          : formatTime(
                                                              task.timer
                                                                ?.totalSeconds || 0
                                                            )}
                                                      </small>

                                                      {task.timer?.isRunning ? (
                                                        <button
                                                          className="btn btn-sm btn-danger"
                                                          onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleStopTimer(task._id);
                                                          }}
                                                          style={{
                                                            fontSize: "0.7rem",
                                                          }}
                                                        >
                                                          ⏸️ Stop
                                                        </button>
                                                      ) : (
                                                        <button
                                                          className="btn btn-sm btn-success"
                                                          onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleStartTimer(
                                                              task._id
                                                            );
                                                          }}
                                                          style={{
                                                            fontSize: "0.7rem",
                                                          }}
                                                        >
                                                          {task.timer?.totalSeconds >
                                                          0
                                                            ? "▶️ Resume"
                                                            : "▶️ Start"}
                                                        </button>
                                                      )}
                                                    </div>

                                                    {task.timer?.sessions?.length >
                                                      0 && (
                                                      <small className="text-muted d-block mt-1">
                                                        Sessions:{" "}
                                                        {task.timer.sessions.length}
                                                      </small>
                                                    )}
                                                  </>
                                                )}
                                              </div>

                                              {isAdminOrManager && (
                                                <div className="d-flex gap-1 mt-2">
                                                  <button
                                                    className="btn btn-sm btn-outline-secondary flex-grow-1"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      handleEditTask(task);
                                                    }}
                                                  >
                                                    ✏️ Edit
                                                  </button>
                                                  <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      handleDeleteTask(task._id);
                                                    }}
                                                  >
                                                    🗑️
                                                  </button>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        )}
                                      </Draggable>
                                    ))
                                  )}
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </DragDropContext>
            </>
          )}
        </div>

        {/* All the modals remain the same... */}
        {/* Create Board Modal */}
        {showModal && (
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Create Board</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  />
                </div>
                <div className="modal-body">
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Board name"
                    value={boardName}
                    onChange={(e) => setBoardName(e.target.value)}
                  />
                  <textarea
                    className="form-control"
                    placeholder="Board description"
                    rows="3"
                    value={boardDescription}
                    onChange={(e) => setBoardDescription(e.target.value)}
                  ></textarea>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleCreateBoard}>
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Board Modal */}
        {showEditBoardModal && (
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Board</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowEditBoardModal(false);
                      setBoardName("");
                      setBoardDescription("");
                      setEditingBoard(null);
                    }}
                  />
                </div>
                <div className="modal-body">
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Board name"
                    value={boardName}
                    onChange={(e) => setBoardName(e.target.value)}
                  />
                  <textarea
                    className="form-control"
                    placeholder="Board description"
                    rows="3"
                    value={boardDescription}
                    onChange={(e) => setBoardDescription(e.target.value)}
                  ></textarea>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowEditBoardModal(false);
                      setBoardName("");
                      setBoardDescription("");
                      setEditingBoard(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleUpdateBoard}>
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Board Confirmation */}
        {showDeleteBoardDialog && (
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title text-danger">Delete Board</h5>
                  <button
                    className="btn-close"
                    onClick={() => {
                      setShowDeleteBoardDialog(false);
                      setBoardToDelete(null);
                    }}
                  />
                </div>
                <div className="modal-body">
                  <p>
                    Are you sure you want to delete{" "}
                    <strong>{boardToDelete?.name}</strong>?
                  </p>
                  <div className="alert alert-warning">
                    ⚠️ This will delete all columns and tasks in this board!
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowDeleteBoardDialog(false);
                      setBoardToDelete(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-danger" onClick={handleDeleteBoard}>
                    Delete Board
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Column Modal */}
        {showColumnModal && (
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Create Column</h5>
                  <button
                    className="btn-close"
                    onClick={() => setShowColumnModal(false)}
                  />
                </div>
                <div className="modal-body">
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Column name (e.g. Todo, In Progress, Done)"
                    value={columnName}
                    onChange={(e) => setColumnName(e.target.value)}
                  />
                  <div className="alert alert-info">
                    <small>
                      <strong>💡 Tips:</strong>
                      <ul className="mb-0 mt-1">
                        <li>Create "In Progress" for automatic timer moves</li>
                        <li>
                          Create "Done" or "Completed" for task completion
                        </li>
                        <li>Add as many columns as your workflow needs!</li>
                      </ul>
                    </small>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowColumnModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={handleCreateColumn}
                  >
                    Create Column
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Column Modal */}
        {showEditColumnModal && (
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Column</h5>
                  <button
                    className="btn-close"
                    onClick={() => {
                      setShowEditColumnModal(false);
                      setColumnName("");
                      setEditingColumn(null);
                    }}
                  />
                </div>
                <div className="modal-body">
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Column name"
                    value={columnName}
                    onChange={(e) => setColumnName(e.target.value)}
                  />
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowEditColumnModal(false);
                      setColumnName("");
                      setEditingColumn(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleUpdateColumn}>
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Column Confirmation */}
        {showDeleteColumnDialog && (
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title text-danger">Delete Column</h5>
                  <button
                    className="btn-close"
                    onClick={() => {
                      setShowDeleteColumnDialog(false);
                      setColumnToDelete(null);
                    }}
                  />
                </div>
                <div className="modal-body">
                  <p>
                    Are you sure you want to delete{" "}
                    <strong>{columnToDelete?.name}</strong>?
                  </p>
                  <div className="alert alert-warning">
                    ⚠️ All tasks in this column will also be deleted!
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowDeleteColumnDialog(false);
                      setColumnToDelete(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-danger" onClick={handleDeleteColumn}>
                    Delete Column
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create/Edit Task Modal */}
        {showTaskModel && (
          <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingTask ? "Edit Task" : "Create Task"}
                  </h5>
                  <button className="btn-close" onClick={resetTaskForm} />
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Task Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter task title"
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      placeholder="Enter task description"
                      rows={3}
                      value={taskDescription}
                      onChange={(e) => setTaskDescription(e.target.value)}
                    />
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6 mb-2 mb-md-0">
                      <label className="form-label">Priority</label>
                      <select
                        className="form-select"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Due Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Assign To</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter email or name (Optional)"
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                    />
                    <small className="text-muted">Leave blank for unassigned</small>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={resetTaskForm}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleSaveTask}>
                    {editingTask ? "Update Task" : "Create Task"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notifications */}
        {toast.show && (
          <div
            className="toast-container position-fixed bottom-0 end-0 p-3"
            style={{ zIndex: 1060 }}
          >
            <div className={`toast show text-bg-${toast.type}`}>
              <div className="toast-body">{toast.message}</div>
            </div>
          </div>
        )}
      </div>
      
      {/* ✅ Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50 d-md-none"
          style={{ zIndex: 1040 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;