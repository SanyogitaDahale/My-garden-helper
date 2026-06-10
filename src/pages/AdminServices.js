import { useState, useEffect } from "react";
import api from "../services/api";

function AdminServices() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = () => {
    api.get("/services")
      .then(res => setServices(res.data))
      .catch(() => setMessage("Error loading services "));
  };

  const handleSubmit = () => {
    // ✅ Validation
    if (!form.name.trim() || !form.price) {
      setMessage("Name and Price are required ");
      return;
    }

    setLoading(true);

    if (editingId) {
      // ✅ Update
      api.put(`/services/${editingId}`, form)
        .then(() => {
          setMessage("Service updated successfully");
          resetForm();
          fetchServices();
        })
        .catch(() => setMessage("Update failed"))
        .finally(() => setLoading(false));
    } else {
      // ✅ Add
      api.post("/services", form)
        .then(() => {
          setMessage("Service added successfully");
          resetForm();
          fetchServices();
        })
        .catch(() => setMessage("Add failed"))
        .finally(() => setLoading(false));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      api.delete(`/services/${id}`)
        .then(() => {
          setMessage("Service deleted");
          fetchServices();
        })
        .catch(() => setMessage("Delete failed "));
    }
  };

  const handleEdit = (service) => {
    setForm(service);
    setEditingId(service.id);
  };

  const resetForm = () => {
    setForm({ name: "", description: "", price: "" });
    setEditingId(null);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-green-700">
        🌿 Service Management Panel
      </h2>

      {/* MESSAGE */}
      {message && (
        <div className="mb-4 p-2 bg-blue-100 text-blue-700 rounded">
          {message}
        </div>
      )}

      {/* FORM */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            className="border p-2 rounded"
            placeholder="Service Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />

          <input
            className="border p-2 rounded"
            placeholder="Description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />

          <input
            type="number"
            className="border p-2 rounded"
            placeholder="Price"
            value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })}
          />
        </div>

        <div className="mt-3">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded mr-2"
          >
            {loading
              ? "Processing..."
              : editingId
                ? "Update Service"
                : "Add Service"}
          </button>

          {editingId && (
            <button
              onClick={resetForm}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* SERVICES LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.length === 0 ? (
          <p className="text-gray-500 text-center mt-4 col-span-2">
            No services available 🌱
          </p>
        ) : (
          services.map(service => (
            <div
              key={service.id}
              className="bg-white p-4 rounded shadow"
            >
              <h3 className="text-lg font-bold">{service.name}</h3>
              <p className="text-gray-600">{service.description}</p>
              <p className="text-green-600 font-semibold">
                ₹ {service.price}
              </p>

              <div className="mt-3">
                <button
                  onClick={() => handleEdit(service)}
                  className="bg-yellow-400 px-3 py-1 rounded mr-2"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(service.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminServices;