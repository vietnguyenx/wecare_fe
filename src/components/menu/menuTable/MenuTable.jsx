import React, { useEffect, useState } from "react";
import MenuTableAction from "./MenuTableAction"; // Tùy chỉnh cho menu
import { fetchAllMenus } from "../../../services/menuService"; // Gọi API từ menuService
import MenuModal from "../menuModal/MenuModal"; // Import modal
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
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái modal

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await fetchAllMenus();
      const formattedData = data.results
          .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate)) // Sắp xếp theo createdDate
          .map((menu) => ({
        id: menu.id,
        menuName: menu.menuName,
        dietitianName: menu.dietitian.name,
        description: menu.description,
        suitableFor: menu.suitableFor === 0 ? 'Bệnh tiểu đường' : (menu.suitableFor === 1 ? 'Bệnh gout' : 'Cả hai'),  
        status: menu.status === 0 ? 'Đang chờ' : 'Hoàn thành', // Thay đổi ở đây
        totalCalories: menu.totalCalories,
        totalCarbohydrates: menu.totalCarbohydrates,
        totalProtein: menu.totalProtein,
        totalFat: menu.totalFat,
        totalFiber: menu.totalFiber,
        totalSugar: menu.totalSugar,
        totalPurine: menu.totalPurine,
        totalCholesterol: menu.totalCholesterol,
        createdDate: new Date(menu.createdDate).toLocaleDateString(),
        isDeleted: menu.isDeleted ? 'Deleted' : 'Active',
      }));

      setTableData(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleCreateMenu = () => {
    setIsModalOpen(true); // Mở modal
  };

  const handleMenuCreated = () => {
    fetchData(); // Cập nhật danh sách menu
  };

  const handleMenuDeleted = () => {
    fetchData(); // Cập nhật danh sách menu sau khi xóa
  };

  return (
    <section className="content-menu-table">
      <div className="data-table-info">
        <h4 className="data-table-title">Danh sách Menu</h4>
        <button className="create-menu-button" onClick={handleCreateMenu}>
          Tạo mới menu
        </button>
      </div>
      <div className="data-table-diagram">
        <table>
          <thead>
            <tr>
              {TABLE_HEADS.map((th, index) => (
                <th key={index}>{th}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((dataItem) => (
              <tr key={dataItem.id}>
                <td>{dataItem.menuName}</td>
                <td>{dataItem.dietitianName}</td>
                <td>
                  {/* Tách phần mô tả thành các phần riêng biệt */}
                  {dataItem.description.split('. ').map((part, index) => (
                    <div key={index}>
                      {part.includes("Link:") ? (
                        <a href={part.replace("Link: ", "")} target="_blank" rel="noopener noreferrer">
                          Xem Video
                        </a>
                      ) : (
                        part
                      )}
                    </div>
                  ))}
                </td>
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
                <td className={`status-cell ${dataItem.isDeleted === 'Deleted' ? 'deleted' : 'active'}`}>
                  {dataItem.isDeleted === 'Deleted' ? 'Đã xóa' : 'Hoạt động'}
                </td>

                <td className="dt-cell-action">
                  <MenuTableAction 
                    menuId={dataItem.id} 
                    onMenuDeleted={handleMenuDeleted} 
                    menuName={dataItem.menuName} // Truyền tên menu vào
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <MenuModal 
          onClose={() => setIsModalOpen(false)} 
          onMenuCreated={handleMenuCreated} 
        />
      )}
    </section>
  );
};

export default MenuTable;
