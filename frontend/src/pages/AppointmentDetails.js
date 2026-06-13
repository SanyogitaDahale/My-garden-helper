import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function AppointmentDetails() {

  const { id } = useParams();

  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
  fetchAppointment();
  // eslint-disable-next-line
}, []);

  const fetchAppointment = async () => {

    try {

      const response = await axios.get(
        `http://my-garden-helper-backend.onrender.com/appointments/${id}`,
        {
          auth: {
            username: "user",
            password: "Sanyogita#123"
          }
        }
      );

      setAppointment(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  if (!appointment) {

    return (
      <div className="text-center mt-20 text-2xl">
        Loading...
      </div>
    );

  }

  return (

    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">

        <h1 className="text-4xl font-bold text-green-700 mb-8">
          Appointment Details
        </h1>

        {/* SERVICES */}
        <div className="mb-6">

          <h2 className="text-xl font-semibold mb-3">
            Services
          </h2>

          <ul className="space-y-2">

            {appointment.serviceNames?.map((service, index) => (

              <li
                key={index}
                className="bg-green-100 text-green-800 px-4 py-2 rounded-lg"
              >
                {service}
              </li>

            ))}

          </ul>

        </div>

        {/* DATE */}
        <div className="mb-4">

          <span className="font-bold">
            Date:
          </span>

          {" "}

          {new Date(appointment.appointmentDate)
            .toLocaleDateString()}

        </div>

        {/* TIME */}
        <div className="mb-4">

          <span className="font-bold">
            Time:
          </span>

          {" "}

          {new Date(appointment.appointmentDate)
            .toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            })}

        </div>

        {/* ADDRESS */}
        <div className="mb-4">

          <span className="font-bold">
            Address:
          </span>

          {" "}

          {appointment.address}

        </div>

        {/* PHONE */}
        <div className="mb-4">

          <span className="font-bold">
            Phone:
          </span>

          {" "}

          {appointment.phone}

        </div>

        {/* STATUS */}
        <div className="mb-4">

          <span className="font-bold">
            Status:
          </span>

          {" "}

          <span className="text-green-700 font-semibold">
            {appointment.status}
          </span>

        </div>

      </div>

    </div>

  );
}

export default AppointmentDetails;