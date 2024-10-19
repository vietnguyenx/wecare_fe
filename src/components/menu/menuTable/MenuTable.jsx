import React, { useEffect, useState } from "react";
import MenuTableAction from "./MenuTableAction"; // Tùy chỉnh cho menu
import { fetchAllMenus } from "../../../services/menuService"; // Gọi API từ menuService
import "./MenuTable.scss";

const TABLE_HEADS = [
  "Tên menu",
  "Chuyên gia dinh dưỡng",
  "Mô tả",
  "Bệnh phù hợp",
  "Hoạt động",
  "Tổng calo",
  "Tổng Carbohydrates",
  "Tổng Protein",
  "Tổng chất béo",
  "Tổng chất xơ",
  "Tổng lượng đường",
  "Tổng Purine",
  "Tổng Cholesterol",
  "Ngày tạo",
  "Trạng thái",
  "Thao tác",
];

const MenuTable = () => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAllMenus(); // Gọi API để lấy danh sách menu
        const urlRegex = /(https?:\/\/[^\s]+)/g; // Biểu thức chính quy để tìm URL
        const formattedData = data.results
          .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate)) // Sắp xếp theo createdDate
          .map((menu) => ({
            id: menu.id,
            menuName: menu.menuName,
            dietitianName: menu.dietitian.name, // Tên chuyên gia dinh dưỡng
            description: menu.description.replace(urlRegex, ''), // Loại bỏ URL khỏi phần mô tả
            suitableFor:
              menu.suitableFor === 0
                ? 'Diabetes'
                : menu.suitableFor === 1
                ? 'Gout'
                : 'Both', // Điều kiện logic cho suitableFor
            status: menu.status === 0 ? 'Pending' : 'Completed', // Điều kiện logic cho status
            totalCalories: menu.totalCalories,
            totalCarbohydrates: menu.totalCarbohydrates,
            totalProtein: menu.totalProtein,
            totalFat: menu.totalFat,
            totalFiber: menu.totalFiber,
            totalSugar: menu.totalSugar,
            totalPurine: menu.totalPurine,
            totalCholesterol: menu.totalCholesterol,
            createdDate: new Date(menu.createdDate).toLocaleDateString(),
            isDeleted: menu.isDeleted ? 'Deleted' : 'Active', // Trạng thái xóa
          }));
  
        setTableData(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);

  // Hàm để xử lý sự kiện nhấn nút "Tạo mới"
  const handleCreateMenu = () => {
    console.log("Tạo mới menu");
    // Có thể mở modal hoặc redirect đến một trang khác
  };

  return (
    <section className="content-menu-table">
      <div className="data-table-info">
        <h4 className="data-table-title">Danh sách Menu</h4>
        {/* Nút Tạo mới menu */}
        <button className="create-menu-button" onClick={handleCreateMenu}>
          Tạo mới menu
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
                <td>{dataItem.menuName}</td>
                <td>{dataItem.dietitianName}</td>
                <td>{dataItem.description}</td>
                <td>{dataItem.suitableFor}</td>
                <td>{dataItem.status}</td>
                <td>{dataItem.totalCalories}</td>
                <td>{dataItem.totalCarbohydrates}</td>
                <td>{dataItem.totalProtein}</td>
                <td>{dataItem.totalFat}</td>
                <td>{dataItem.totalFiber}</td>
                <td>{dataItem.totalSugar}</td>
                <td>{dataItem.totalPurine}</td>
                <td>{dataItem.totalCholesterol}</td>
                <td>{dataItem.createdDate}</td>
                <td>{dataItem.isDeleted}</td>
                <td className="dt-cell-action">
                  <MenuTableAction />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default MenuTable;
