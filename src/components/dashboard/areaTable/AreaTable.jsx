// src/components/dashboard/areaTable/AreaTable.jsx
import React, { useEffect, useState } from "react";
import AreaTableAction from "./AreaTableAction";
import { fetchAllUsers } from "../../../services/userService"; // Sử dụng dịch vụ
import "./AreaTable.scss";

const TABLE_HEADS = [
  "Tài khoản",
  "Họ tên",
  "Email",
  "Số điện thoại",
  "Hạng",
  "Loại bệnh",
  "Action",
];

const AreaTable = () => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAllUsers(10); // Lấy 10 kết quả
        const formattedData = data.results
          .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate)) // Sắp xếp theo createdDate
          .map((user) => ({
            id: user.id,
            username: user.username,
            full_name: user.fullName,
            email: user.email,
            phone: user.phone,
            userType: user.userType === 1 ? "premium" : "free", // Đảm bảo đúng điều kiện
            diseaseType: user.diseaseType === 1 ? "gout" : "diabetes", // Đảm bảo đúng điều kiện
          }));

        setTableData(formattedData.slice(0, 10)); // Chỉ lấy 10 kết quả
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="content-area-table">
      <div className="data-table-info">
        <h4 className="data-table-title">Tài khoản mới kích hoạt</h4>
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
                <td>{dataItem.phone}</td>
                <td>
                  <div className="dt-status">
                    <span
                      className={`dt-status-dot dot-${dataItem.userType}`}
                    ></span>
                    <span className="dt-status-text">{dataItem.userType}</span>
                  </div>
                </td>
                <td>
                  <div className="dt-diseaseType">
                    <span
                      className={`dt-diseaseType-dot dot-${dataItem.diseaseType}`}
                    ></span>
                    <span className="dt-diseaseType-text">{dataItem.diseaseType}</span>
                  </div>
                </td>
                <td className="dt-cell-action">
                  <AreaTableAction />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AreaTable;
