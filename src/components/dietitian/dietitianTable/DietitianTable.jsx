import React, { useEffect, useState } from "react";
import DietitianTableAction from "./DietitianTableAction"; // Tùy chỉnh cho dietitian
import { fetchAllDietitians } from "../../../services/dietitianService"; // Gọi API từ dietitianService
import "./DietitianTable.scss";

const TABLE_HEADS = [
  "Họ tên",
  "Email",
  "Số điện thoại",
  "Chuyên môn",
  "Ngày tạo",
  "Trạng thái",
  "Action",
];

const DietitianTable = () => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAllDietitians(); // Gọi API để lấy danh sách dietitian
        const formattedData = data.results
          .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate)) // Sắp xếp theo createdDate
          .map((dietitian) => ({
            id: dietitian.id,
            name: dietitian.name,
            email: dietitian.email,
            phone: dietitian.phone,
            specialization: dietitian.specialization,
            createDate: new Date(dietitian.createdDate).toLocaleDateString(), // Định dạng ngày tạo
            isDeleted: dietitian.isDeleted ? "Deleted" : "Active", // Hiển thị trạng thái
          }));

        setTableData(formattedData); 
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Hàm để xử lý sự kiện nhấn nút "Tạo mới"
  const handleCreateDietitian = () => {
    console.log("Tạo mới chuyên gia dinh dưỡng");
    // Có thể mở modal hoặc redirect đến một trang khác
  };

  return (
    <section className="content-dietitian-table">
      <div className="data-table-info">
        <h4 className="data-table-title">Danh sách chuyên gia dinh dưỡng</h4>
        {/* Nút Tạo mới chuyên gia dinh dưỡng */}
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
                  <DietitianTableAction />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default DietitianTable;
