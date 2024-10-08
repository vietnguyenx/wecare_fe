import React, { useEffect, useState } from "react";
import UserTableAction from "./UserTableAction";
import { fetchAllUsers } from "../../../services/userService"; // Sử dụng dịch vụ
import UserModal from "../userModal/UserModal"; // Đường dẫn tới UserModal
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
  "Thao tác",
];

const UserTable = () => {
  const [tableData, setTableData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

        setTableData(formattedData); 
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Hàm để thêm người dùng mới vào danh sách
  const addUser = (newUser) => {
    const formattedUser = {
      id: newUser.id,
      username: newUser.username,
      full_name: newUser.fullName,
      email: newUser.email,
      dob: newUser.dob,
      address: newUser.address,
      gender: newUser.gender === 0 ? "Male" : newUser.gender === 1 ? "Female" : "Other",
      phone: newUser.phone,
      userType: newUser.userType === 0 ? "Free" : "Premium",
      diseaseType: newUser.diseaseType === 0 ? "Diabetes" : newUser.diseaseType === 1 ? "Gout" : "Both",
      userRole: newUser.userRole === 0 ? "Admin" : newUser.userRole === 1 ? "Staff" : "User",
      createDate: new Date().toLocaleDateString(), // Ngày tạo là ngày hiện tại
      isDeleted: newUser.isDeleted ? "Deleted" : "Active",
    };

    // Cập nhật bảng với người dùng mới
    setTableData((prev) => [formattedUser, ...prev]);
  };

  const handleCreateUser = () => {
    setIsModalOpen(true); // Mở modal để thêm người dùng mới
  };

  return (
    <section className="content-user-table">
      <div className="data-table-info">
        <h4 className="data-table-title">Danh sách người dùng</h4>
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
                  <div className="dt-userType">
                    <span className={`dt-userType-dot dot-${dataItem.userType.toLowerCase()}`}></span>
                    <span className="dt-userType-text">{dataItem.userType}</span>
                  </div>
                </td>
                <td>{dataItem.diseaseType}</td>
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

      {/* Modal tạo người dùng mới */}
      {isModalOpen && <UserModal onClose={() => setIsModalOpen(false)} onUserCreated={addUser} />}
    </section>
  );
};

export default UserTable;
