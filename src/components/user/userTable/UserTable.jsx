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
            id: user.id || "-",
            username: user.username || "-",
            full_name: user.fullName || "-",
            email: user.email || "-",
            dob: user.dob ? new Date(user.dob).toLocaleDateString() : "-",
            address: user.address || "-",
            gender: user.gender === 0 ? "Nam" : user.gender === 1 ? "Nữ" : user.gender === 2 ? "Khác" : "-",
            phone: user.phone || "-",
            userType: user.userType === 0 ? "Free" : user.userType === 1 ? "Premium" : "-",
            diseaseType: user.diseaseType === 0 ? "Tiểu đường" : user.diseaseType === 1 ? "Gout" : user.diseaseType === 2 ? "Cả hai" : "-",
            userRole: user.userRole === 0 ? "Admin" : user.userRole === 1 ? "Staff" : user.userRole === 2 ? "User" : "-",
            createDate: user.createdDate ? new Date(user.createdDate).toLocaleDateString() : "-",
            isDeleted: user.isDeleted ? "Deleted" : "Active",
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
                <td className={`status-cell ${dataItem.isDeleted === 'Deleted' ? 'deleted' : 'active'}`}>
                  {dataItem.isDeleted === 'Deleted' ? 'Đã xóa' : 'Hoạt động'}
                </td>
                <td className="dt-cell-action">
                  <UserTableAction 
                    userId={dataItem.id} 
                    username={dataItem.username} // Truyền username vào đây
                    onUserDeleted={(id) => {
                      // Cập nhật trạng thái người dùng thành "Deleted"
                      setTableData((prev) => 
                        prev.map((user) =>
                          user.id === id ? { ...user, isDeleted: "Deleted" } : user
                        )
                      ); 
                    }} 
                  />
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
