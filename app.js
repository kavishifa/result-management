import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [form, setForm] = useState({
    name: "",
    registerNumber: "",
    department: "",
    marks: "",
    grade: ""
  });

  const [results, setResults] = useState([]);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // Handle input change
  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  // Fetch results
  const fetchResults = async () => {
    try {
      const res = await axios.get("http://localhost:5000/results");
      setResults(res.data);
    } catch (err) {
      console.error(err);
      alert("Cannot fetch results. Backend might not be running.");
    }
  };

  useEffect(() => { fetchResults(); }, []);

  // Add result
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!form.registerNumber || !form.name) { alert("Name & Register Number required"); return; }
    try {
      await axios.post("http://localhost:5000/add", form);
      alert("Result Added");
      setForm({name:"", registerNumber:"", department:"", marks:"", grade:""});
      fetchResults();
    } catch (err) {
      console.error(err);
      alert("Failed to add result. Backend might not be running.");
    }
  };

  // Edit result
  const handleEdit = async (r) => {
    const newGrade = prompt("Enter new grade", r.grade);
    if(newGrade) {
      try {
        await axios.put(`http://localhost:5000/edit/${r.registerNumber}`, {...r, grade: newGrade});
        fetchResults();
      } catch (err) {
        console.error(err);
        alert("Failed to edit. Backend might not be running.");
      }
    }
  };

  // Delete result
  const handleDelete = async (r) => {
    if(window.confirm("Delete this result?")) {
      try {
        await axios.delete(`http://localhost:5000/delete/${r.registerNumber}`);
        fetchResults();
      } catch (err) {
        console.error(err);
        alert("Failed to delete. Backend might not be running.");
      }
    }
  };

  // Search & Filter
  const filteredResults = results.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.registerNumber.includes(search)
  );

  // Sort
  const sortedResults = [...filteredResults].sort((a,b)=>{
    if(!sortField) return 0;
    const valA = a[sortField];
    const valB = b[sortField];
    if(sortOrder==="asc") return valA>valB?1:(valA<valB?-1:0);
    else return valA<valB?1:(valA>valB?-1:0);
  });

  return (
    <div className="container">
      <h2>Result Management System</h2>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Student Name" value={form.name} onChange={handleChange} />
        <input name="registerNumber" placeholder="Register No" value={form.registerNumber} onChange={handleChange} />
        <input name="department" placeholder="Department" value={form.department} onChange={handleChange} />
        <input name="marks" placeholder="Marks" value={form.marks} onChange={handleChange} />
        <input name="grade" placeholder="Grade" value={form.grade} onChange={handleChange} />
        <button type="submit">Add Result</button>
      </form>

      <h3>All Results</h3>
      <input
        type="text"
        placeholder="Search by Name or Register No"
        value={search}
        onChange={e=>setSearch(e.target.value)}
        className="search-bar"
      />

      <table>
        <thead>
          <tr>
            <th onClick={()=>{setSortField("name"); setSortOrder(sortOrder==="asc"?"desc":"asc");}}>Name</th>
            <th onClick={()=>{setSortField("registerNumber"); setSortOrder(sortOrder==="asc"?"desc":"asc");}}>Register No</th>
            <th onClick={()=>{setSortField("department"); setSortOrder(sortOrder==="asc"?"desc":"asc");}}>Department</th>
            <th onClick={()=>{setSortField("marks"); setSortOrder(sortOrder==="asc"?"desc":"asc");}}>Marks</th>
            <th onClick={()=>{setSortField("grade"); setSortOrder(sortOrder==="asc"?"desc":"asc");}}>Grade</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedResults.map((r,i)=>(
            <tr key={i}>
              <td>{r.name}</td>
              <td>{r.registerNumber}</td>
              <td>{r.department}</td>
              <td>{r.marks}</td>
              <td>{r.grade}</td>
              <td>
                <button className="edit" onClick={()=>handleEdit(r)}>Edit</button>
                <button className="delete" onClick={()=>handleDelete(r)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
