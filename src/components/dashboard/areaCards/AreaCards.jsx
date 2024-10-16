import { useEffect, useState } from "react";
import AreaCard from "./AreaCard";
import { fetchAllUsers2 } from "../../../services/userService"; // Sử dụng fetchAllUsers2
import { fetchAllMenus } from "../../../services/menuService"; // Import service fetch API for menus
import "./AreaCards.scss";

const AreaCards = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [freeUsersCount, setFreeUsersCount] = useState(0);
  const [premiumUsersCount, setPremiumUsersCount] = useState(0);
  const [diseaseCounts, setDiseaseCounts] = useState({ diabetes: 0, gout: 0, both: 0 });
  const [menuCounts, setMenuCounts] = useState({ gout: 0, diabetes: 0, both: 0 });
  const [totalRevenue, setTotalRevenue] = useState(0); // State mới cho tổng doanh thu
  const [isDataReady, setIsDataReady] = useState(false);
  
  // Đặt mục tiêu doanh thu cố định (ví dụ: 50 triệu đồng)
  const revenueTarget = 12000000;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Gọi fetchAllUsers2
        const [userResponse, menuResponse] = await Promise.all([
          fetchAllUsers2("desc"), // Fetch all users
          fetchAllMenus(100)
        ]);

        const users = userResponse.results;
        const menus = menuResponse.results;

        // Tính số lượng người dùng free và premium
        const freeCount = users.filter(user => user.userType === 0).length;
        const premiumCount = users.filter(user => user.userType === 1).length;

        // Tính doanh thu từ người dùng premium
        const revenue = premiumCount * 199000;

        // Tính số lượng bệnh
        const diabetesCount = users.filter(user => user.diseaseType === 0).length;
        const goutCount = users.filter(user => user.diseaseType === 1).length;
        const bothCount = users.filter(user => user.diseaseType === 2).length;

        // Tính số lượng menu phù hợp với từng loại bệnh
        const goutMenuCount = menus.filter(menu => menu.suitableFor === 1).length;
        const diabetesMenuCount = menus.filter(menu => menu.suitableFor === 0).length;
        const bothMenuCount = menus.filter(menu => menu.suitableFor === 2).length;

        // Cập nhật state
        setTotalUsers(users.length);
        setFreeUsersCount(freeCount);
        setPremiumUsersCount(premiumCount);
        setTotalRevenue(revenue); // Cập nhật doanh thu
        setDiseaseCounts({ diabetes: diabetesCount, gout: goutCount, both: bothCount });
        setMenuCounts({ gout: goutMenuCount, diabetes: diabetesMenuCount, both: bothMenuCount });

        setIsDataReady(true); // Đánh dấu dữ liệu đã sẵn sàng
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const totalCount = freeUsersCount + premiumUsersCount;
  const freePercent = totalCount ? (freeUsersCount / totalCount) * 100 : 0;
  const premiumPercent = totalCount ? (premiumUsersCount / totalCount) * 100 : 0;

  // Tính phần trăm doanh thu dựa trên mục tiêu
  const revenuePercent = revenueTarget ? (totalRevenue / revenueTarget) * 100 : 0;

  if (!isDataReady) {
    return <div>Loading...</div>;
  }

  return (
    <section className="content-area-cards">
      {/* Thẻ đầu tiên hiển thị tổng doanh thu và biểu đồ phần trăm dựa trên mục tiêu */}
      <AreaCard
        colors={["#e4e8ef", "#FF8718"]}
        percentFillValue={revenuePercent} // Biểu đồ phần trăm doanh thu
        cardInfo={{
          title: "Doanh thu",
          value: `${totalRevenue.toLocaleString()} đ`, // Hiển thị doanh thu có định dạng
        }}
      />
      
      {/* Các thẻ khác giữ nguyên */}
      <AreaCard
        colors={["#e4e8ef", "#FF8718"]}
        additionalData={[
          { name: "Free", value: freePercent },
          { name: "Premium", value: premiumPercent },
        ]}
        percentFillValue={premiumPercent}
        cardInfo={{
          title: "Tổng người dùng",
          value: totalUsers,
        }}
      />
      <AreaCard
        colors={["#4CAF4F", "#FF8718", "#e4e8ef"]}
        additionalData={[
          { name: "Gout", value: diseaseCounts.gout },
          { name: "Diabetes", value: diseaseCounts.diabetes },
          { name: "Both", value: diseaseCounts.both },
        ]}
        percentFillValue={((diseaseCounts.diabetes + diseaseCounts.gout + diseaseCounts.both) / totalUsers) * 100}
        cardInfo={{
          title: "Xu hướng bệnh",
          value: 3,
        }}
      />
      <AreaCard
        colors={["#4CAF4F", "#FF8718", "#e4e8ef"]}
        additionalData={[
          { name: "Gout", value: menuCounts.gout },
          { name: "Diabetes", value: menuCounts.diabetes },
          { name: "Both", value: menuCounts.both },
        ]}
        percentFillValue={100} // Sử dụng phần trăm cho xu hướng menu
        cardInfo={{
          title: "Xu hướng menu",
          value: 3,
        }}
      />
      <AreaCard
        colors={["#4CAF4F","#FF8718","#e4e8ef"]}
        additionalData={[
          { name: "Gout", value: menuCounts.gout },
          { name: "Diabetes", value: menuCounts.diabetes },
          { name: "Both", value: menuCounts.both },
        ]}
        percentFillValue={100}
        cardInfo={{
          title: "Tổng thực đơn",
          value: menuCounts.gout + menuCounts.diabetes + menuCounts.both, // Total menu count
        }}
      />
    </section>
  );
};

export default AreaCards;
