import { useEffect, useState } from "react";
import api from "../services/api";

function ServicesPage() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    api.get("/services")
      .then(res => setServices(res.data));
  }, []);

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-green-700">
        Available Services 🌱
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {services.map(s => (
          <div
            key={s.id}
            className="bg-white p-4 rounded shadow"
          >
            <h3 className="text-lg font-bold">{s.name}</h3>
            <p className="text-gray-600">{s.description}</p>
            <p className="text-green-600 font-semibold">
              ₹ {s.price}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ServicesPage;