import React, { useState, useEffect } from "react";
import api from "../api/axios";
import socket from "../socket";

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
        console.log("✅ Current User:", { role: user.role, id: user._id, name: user.name });
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
    return columns.find(col => {
      const name = col.name.toLowerCase().replace(/[^a-z]/g, '');
      return name === 'inprogress' || 
             name === 'progress' || 
             name === 'ongoing' ||
             name === 'working';
    });
  };

  // ✅ Helper: Check if column is "Done/Completed"
  const isDoneColumn = (column) => {
    if (!column) return false;
    const name = column.name.toLowerCase().replace(/[^a-z]/g, '');
    return name === 'done' || 
           name === 'completed' || 
           name === 'finished' ||
           name === 'closed';
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

  // ✅ FIX 1: START TIMER - Auto move to "In Progress" with proper data handling
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

      // ✅ Smart auto-move to "In Progress" column
      const inProgressCol = getInProgressColumn();
      
      if (inProgressCol && updatedTask.columnId !== inProgressCol._id) {
        try {
          const moveRes = await api.put(`/tasks/${taskId}`, {
            columnId: inProgressCol._id
          });

          // ✅ FIX: Use the response from move API which has complete task data
          const movedTask = moveRes.data;
          console.log("✅ Task moved, received complete data:", movedTask);

          setTasks((prev) =>
            prev.map((t) =>
              t._id === taskId ? movedTask : t
            )
          );

          showToast(`Timer started! Task moved to "${inProgressCol.name}"`, "success");
        } catch (err) {
          console.error("Failed to move task:", err);
          // ✅ Even if move fails, update with timer data
          setTasks((prev) =>
            prev.map((t) => (t._id === taskId ? updatedTask : t))
          );
          showToast("Timer started!", "success");
        }
      } else {
        // ✅ No move needed, just update timer
        setTasks((prev) =>
          prev.map((t) => (t._id === taskId ? updatedTask : t))
        );
        
        if (!inProgressCol) {
          showToast('Timer started! (Tip: Create "In Progress" column for auto-move)', "info");
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

      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? task : t))
      );

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

  // ✅ FIX 2: DRAG & DROP - Stop timer when moved to Done column
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
        
        // ✅ Find the task being dragged
        const draggedTask = tasks.find(t => t._id === draggableId);

        // ✅ FIX: If moving to Done and timer is running, stop it first
        if (isCompletionColumn && draggedTask?.timer?.isRunning) {
          console.log("⏸️ Stopping timer before marking complete...");
          try {
            await api.post(`/tasks/${draggableId}/stop-timer`);
            
            // ✅ Remove from running timers
            setRunningTimers((prev) => {
              const updated = { ...prev };
              delete updated[draggableId];
              return updated;
            });
          } catch (err) {
            console.error("Failed to stop timer:", err);
          }
        }

        // ✅ Optimistic update
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
        
        // ✅ Update with server response to ensure consistency
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === draggableId ? res.data : task
          )
        );

        showToast(
          isCompletionColumn
            ? `Task completed! ✓ Moved to "${destColumn.name}"`
            : `Task moved to "${destColumn.name}"`,
          "success"
        );
      } catch (error) {
        console.error("Drag error:", error);
        // ✅ Rollback on error
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === draggableId
              ? { ...task, columnId: sourceColumnId }
              : task
          )
        );

        showToast(
          error.response?.data?.message || "Failed to move task!",
          "danger"
        );
      }
    }
  };

  // ✅ Role-based permissions
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
    <div className="container-fluid" style={{backgroundColor:'white'}}>
      <div className="row" style={{ height: "calc(100vh - 56px)" }}>
        {/* Sidebar */}
        <div className="col-3 bg-light border-end p-3">
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
                className={`list-group-item ${
                  selectedBoard?._id === board._id ? "active" : ""
                }`}
                onClick={() => setSelectedBoard(board)}
                style={{ cursor: "pointer" }}
              >
                {board.name}
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

        {/* Main Content */}
        <div className="col-9 p-4">
          {!selectedBoard ? (
            <div className="text-center mt-5">
              <h4 className="text-muted">📋 Select a board to view tasks</h4>
              <p className="text-secondary">Choose a board from the sidebar to get started</p>
            </div>
          ) : (
            <>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h4 className="mb-1">{selectedBoard.name}</h4>
                  <p className="text-muted mb-0">
                    {selectedBoard.description}
                  </p>
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

              {/* ✅ Helpful tips */}
              {columns.length > 0 && !getInProgressColumn() && (
                <div className="alert alert-warning alert-dismissible fade show" role="alert">
                  💡 <strong>Tip:</strong> Create a column named "In Progress" for automatic task movement when timer starts!
                  <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                </div>
              )}

              <DragDropContext onDragEnd={handleDragEnd}>
                <div className="row mt-3">
                  {columns.length === 0 ? (
                    <div className="col-12 text-center mt-5">
                      <h5 className="text-muted">No columns yet!</h5>
                      <p className="text-secondary">
                        {isAdminOrManager 
                          ? 'Click "Add Column" to create your workflow (e.g., Todo, In Progress, Done)'
                          : 'Ask your admin/manager to create columns'
                        }
                      </p>
                    </div>
                  ) : (
                    columns.map((col) => (
                      <div className="col-4" key={col._id}>
                        <div className="card">
                          <div className="card-header fw-bold text-center d-flex justify-content-between align-items-center">
                            <span>{col.name}</span>
                            <span className="badge bg-secondary">
                              {getTasksByColumn(col._id).length}
                            </span>
                          </div>

                          <Droppable droppableId={col._id}>
                            {(provided, snapshot) => (
                              <div
                                className="card-body"
                                style={{
                                  minHeight: "400px",
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
                                  <p className="text-muted text-center">
                                    No Tasks
                                  </p>
                                ) : (
                                  getTasksByColumn(col._id).map(
                                    (task, index) => (
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
                                              opacity: snapshot.isDragging
                                                ? 0.7
                                                : 1,
                                              cursor: "grab",
                                              backgroundColor: task.isCompleted
                                                ? "#f0f9ff"
                                                : "white",
                                              borderLeft: task.isCompleted
                                                ? "4px solid #22c55e"
                                                : task.timer?.isRunning && !task.isCompleted
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

                                              {/* ✅ FIX: Only show "Timer Running" badge if NOT completed */}
                                              {task.timer?.isRunning && !task.isCompleted && (
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

                                              {/* ✅ Timer Display */}
                                              <div className="mb-2 p-2 bg-light rounded">
                                                {task.isCompleted ? (
                                                  <div className="text-center">
                                                    <small className="text-success fw-bold">
                                                      ⏱️ Total:{" "}
                                                      {formatTime(
                                                        task.timer
                                                          ?.totalSeconds || 0
                                                      )}
                                                    </small>
                                                    {task.timer?.sessions
                                                      ?.length > 0 && (
                                                      <small className="text-muted d-block">
                                                        Sessions:{" "}
                                                        {
                                                          task.timer.sessions
                                                            .length
                                                        }
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
                                                              runningTimers[
                                                                task._id
                                                              ]
                                                            )
                                                          : formatTime(
                                                              task.timer
                                                                ?.totalSeconds ||
                                                                0
                                                            )}
                                                      </small>

                                                      {task.timer?.isRunning ? (
                                                        <button
                                                          className="btn btn-sm btn-danger"
                                                          onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleStopTimer(
                                                              task._id
                                                            );
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
                                                          {task.timer
                                                            ?.totalSeconds > 0
                                                            ? "▶️ Resume"
                                                            : "▶️ Start"}
                                                        </button>
                                                      )}
                                                    </div>

                                                    {task.timer?.sessions
                                                      ?.length > 0 && (
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
                                                      handleDeleteTask(
                                                        task._id
                                                      );
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
                                    )
                                  )
                                )}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </DragDropContext>
            </>
          )}
        </div>

        {/* Board Create Modal */}
        {showModal && (
          <div className="modal fade show d-block" tabIndex="-1">
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
                  <button
                    className="btn btn-primary"
                    onClick={handleCreateBoard}
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Column Modal */}
        {showColumnModal && (
          <div className="modal fade show d-block" tabIndex="-1">
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
                        <li>Create "Done" or "Completed" for task completion</li>
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

        {/* Create/Edit Task Modal */}
        {showTaskModel && (
          <div className="modal fade show d-block" tabIndex={-1}>
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
                    <div className="col-6">
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
                    <div className="col-6">
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
                    <small className="text-muted">
                      Leave blank for unassigned
                    </small>
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
            style={{ zIndex: 1000 }}
          >
            <div className={`toast show text-bg-${toast.type}`}>
              <div className="toast-body">{toast.message}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;