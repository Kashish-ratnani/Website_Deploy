import React, { useEffect, useState } from "react";

const API_URL = "https://jsonplaceholder.typicode.com/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all todos
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}?_limit=5`); // Limit for demo
      const data = await res.json();
      setTodos(data);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add or update todo
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editId) {
      // Update
      const res = await fetch(`${API_URL}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, completed: false }),
      });
      const updated = await res.json();
      setTodos((prev) =>
        prev.map((todo) => (todo.id === editId ? { ...todo, title: updated.title } : todo))
      );
      setEditId(null);
    } else {
      // Create
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, completed: false }),
      });
      const newTodo = await res.json();
      setTodos((prev) => [...prev, { ...newTodo, id: Date.now() }]); // Fake ID
    }

    setTitle("");
  };

  // Edit todo
  const handleEdit = (todo) => {
    setEditId(todo.id);
    setTitle(todo.title);
  };

  // Delete todo
  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h1>Todo List</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter todo..."
          style={{ padding: 10, width: "70%" }}
        />
        <button type="submit" style={{ padding: 10, marginLeft: 10 }}>
          {editId ? "Update" : "Add"}
        </button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        todos.map((todo) => (
          <div
            key={todo.id}
            style={{
              background: "#f4f4f4",
              padding: 10,
              marginBottom: 10,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>{todo.title}</span>
            <div>
              <button onClick={() => handleEdit(todo)} style={{ marginRight: 10 }}>
                Edit
              </button>
              <button onClick={() => handleDelete(todo.id)}>Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default App;
