// dietitianTable.jsx
import React, { useEffect, useState } from "react";
import DietitianTableAction from "./DietitianTableAction"; // Add action component for dietitian
import { fetchAllDietitians, createDietitian } from "../../../services/dietitianService";
import DietitianModal from "../dietitianModal/DietitianModal"; // Import the modal
import "./DietitianTable.scss";

const TABLE_HEADS = [
  "Họ tên",
  "Email",
  "Số điện thoại",
  "Chuyên môn",
  "Ngày tạo",
  "Trạng thái",
  "Thao tác",
];

const DietitianTable = () => {
  const [tableData, setTableData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAllDietitians(); // Fetch dietitian data
        const formattedData = data.results
          .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
          .map((dietitian) => ({
            id: dietitian.id,
            name: dietitian.name,
            email: dietitian.email,
            phone: dietitian.phone,
            specialization: dietitian.specialization,
            createDate: new Date(dietitian.createdDate).toLocaleDateString(),
            isDeleted: dietitian.isDeleted ? "Deleted" : "Active",
          }));

        setTableData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const addDietitian = (newDietitian) => {
    const formattedDietitian = {
      id: newDietitian.id,
      name: newDietitian.name,
      email: newDietitian.email,
      phone: newDietitian.phone,
      specialization: newDietitian.specialization,
      createDate: new Date().toLocaleDateString(),
      isDeleted: newDietitian.isDeleted ? "Deleted" : "Active",
    };

    setTableData((prev) => [formattedDietitian, ...prev]);
  };

  const handleCreateDietitian = () => {
    setIsModalOpen(true); // Open the modal for creating a new dietitian
  };

  const handleDietitianDeleted = (id) => {
    setTableData((prev) => 
      prev.map((dietitian) =>
        dietitian.id === id ? { ...dietitian, isDeleted: "Deleted" } : dietitian
      )
    );
  };

  return (
    <section className="content-dietitian-table">
      <div className="data-table-info">
        <h4 className="data-table-title">Danh sách chuyên gia dinh dưỡng</h4>
        <button className="create-dietitian-button" onClick={handleCreateDietitian}>
          Tạo mới chuyên gia dinh dưỡng
        </button>
      </div>
      <div className="data-table-diagram">
        <table>
          <thead>
            <tr>
              {TABLE_HEADS?.map((th, index) => (
                <th key={index}>{th}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData?.map((dataItem) => (
              <tr key={dataItem.id}>
                <td>{dataItem.name}</td>
                <td>{dataItem.email}</td>
                <td>{dataItem.phone}</td>
                <td>{dataItem.specialization}</td>
                <td>{dataItem.createDate}</td>
                <td>{dataItem.isDeleted}</td>
                <td className="dt-cell-action">
                  <DietitianTableAction 
                    dietitianId={dataItem.id} 
                    name={dataItem.name} // Truyền tên vào đây
                    onDietitianDeleted={handleDietitianDeleted} 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal to create a new dietitian */}
      {isModalOpen && <DietitianModal onClose={() => setIsModalOpen(false)} onDietitianCreated={addDietitian} />}
    </section>
  );
};

export default DietitianTable;
