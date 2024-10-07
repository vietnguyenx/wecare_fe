import React, { useEffect, useState } from "react";
import UserTableAction from "./UserTableAction";
import { fetchAllUsers } from "../../../services/userService"; // Sử dụng dịch vụ
import "./UserTable.scss";

const TABLE_HEADS = [
  "Tài khoản",
  "Họ tên",
  "Email",
  "Ngày sinh",
  "Địa chỉ",
  "Giới tính",
  "Số điện thoại",
  "Hạng",
  "Loại bệnh",
  "Chức năng",
  "Ngày tạo",
  "Trạng thái",
  "Action",
];

const UserTable = () => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAllUsers(); // Lấy tất cả kết quả
        const formattedData = data.results
          .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate)) // Sắp xếp theo createdDate
          .map((user) => ({
            id: user.id,
            username: user.username,
            full_name: user.fullName,
            email: user.email,
            dob: user.dob,
            address: user.address,
            gender: user.gender === 0 ? "Male" : user.gender === 1 ? "Female" : "Other", // Điều kiện logic mới
            phone: user.phone,
            userType: user.userType === 0 ? "Free" : "Premium", // Điều kiện logic mới
            diseaseType: user.diseaseType === 0 ? "Diabetes" : user.diseaseType === 1 ? "Gout" : "Both", // Điều kiện logic mới
            userRole: user.userRole === 0 ? "Admin" : user.userRole === 1 ? "Staff" : "User", // Điều kiện logic mới
            createDate: new Date(user.createdDate).toLocaleDateString(), // Định dạng ngày tạo
            isDeleted: user.isDeleted ? "Deleted" : "Active", // Hiển thị trạng thái
          }));

        setTableData(formattedData); // Lưu tất cả dữ liệu vào state
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Hàm để xử lý sự kiện nhấn nút "Tạo mới"
  const handleCreateUser = () => {
    // Chuyển hướng hoặc mở modal để thêm người dùng mới
    console.log("Tạo mới người dùng");
    // Có thể mở modal hoặc redirect đến một trang khác
  };

  return (
    <section className="content-user-table">
      <div className="data-table-info">
        <h4 className="data-table-title">Danh sách người dùng</h4>
        {/* Nút Tạo mới người dùng */}
        <button className="create-user-button" onClick={handleCreateUser}>
          Tạo mới người dùng
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
                <td>{dataItem.username}</td>
                <td>{dataItem.full_name}</td>
                <td>{dataItem.email}</td>
                <td>{dataItem.dob}</td>
                <td>{dataItem.address}</td>
                <td>{dataItem.gender}</td>
                <td>{dataItem.phone}</td>
                <td>
                  <div className="dt-status">
                    <span
                      className={`dt-status-dot dot-${dataItem.userType.toLowerCase()}`}
                    ></span>
                    <span className="dt-status-text">{dataItem.userType}</span>
                  </div>
                </td>
                <td>
                  <div className="dt-diseaseType">
                    <span
                      className={`dt-diseaseType-dot dot-${dataItem.diseaseType.toLowerCase()}`}
                    ></span>
                    <span className="dt-diseaseType-text">{dataItem.diseaseType}</span>
                  </div>
                </td>
                <td>{dataItem.userRole}</td>
                <td>{dataItem.createDate}</td>
                <td>{dataItem.isDeleted}</td>
                <td className="dt-cell-action">
                  <UserTableAction />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default UserTable;
