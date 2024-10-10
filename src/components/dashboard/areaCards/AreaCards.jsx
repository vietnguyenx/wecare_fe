import { useEffect, useState } from "react";
import AreaCard from "./AreaCard";
import { fetchAllUsers } from "../../../services/userService"; // Import service fetch API
import { fetchAllMenus } from "../../../services/menuService"; // Import service fetch API for menus
import "./AreaCards.scss";

const AreaCards = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [freeUsersCount, setFreeUsersCount] = useState(0);
  const [premiumUsersCount, setPremiumUsersCount] = useState(0);
  const [diseaseCounts, setDiseaseCounts] = useState({ diabetes: 0, gout: 0, both: 0 });
  const [menuCounts, setMenuCounts] = useState({ gout: 0, diabetes: 0, both: 0 }); // Include both in menu counts

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetchAllUsers(100);
        const users = response.results;

        // Count free and premium users
        const freeCount = users.filter(user => user.userType === 0).length;
        const premiumCount = users.filter(user => user.userType === 1).length;

        // Count disease types
        const diabetesCount = users.filter(user => user.diseaseType === 0).length;
        const goutCount = users.filter(user => user.diseaseType === 1).length;
        const bothCount = users.filter(user => user.diseaseType === 2).length;

        setTotalUsers(users.length);
        setFreeUsersCount(freeCount);
        setPremiumUsersCount(premiumCount);
        setDiseaseCounts({ diabetes: diabetesCount, gout: goutCount, both: bothCount });
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    const fetchMenus = async () => {
      try {
        const response = await fetchAllMenus(100); // Fetch menu data with limit
        const menus = response.results; // Get menus array

        // Count suitableFor categories
        const goutCount = menus.filter(menu => menu.suitableFor === 1).length;
        const diabetesCount = menus.filter(menu => menu.suitableFor === 0).length;
        const bothCount = menus.filter(menu => menu.suitableFor === 2).length; // Count for both

        setMenuCounts({ gout: goutCount, diabetes: diabetesCount, both: bothCount }); // Update menu counts
      } catch (error) {
        console.error("Failed to fetch menus:", error);
      }
    };

    fetchUsers();
    fetchMenus(); // Call the fetchMenus function
  }, []);

  const totalCount = freeUsersCount + premiumUsersCount;
  const freePercent = totalCount ? (freeUsersCount / totalCount) * 100 : 0;
  const premiumPercent = totalCount ? (premiumUsersCount / totalCount) * 100 : 0;

  // Prepare data for disease trends pie chart
  const diseaseData = [
    { name: "Diabetes", value: diseaseCounts.diabetes, color: "#FF8718" },
    { name: "Gout", value: diseaseCounts.gout, color: "#4CAF4F" },
    { name: "Both", value: diseaseCounts.both, color: "#e4e8ef" },
  ];

  // Prepare data for menu trends
  const menuData = [
    { name: "Diabetes", value: menuCounts.diabetes, color: "#4CAF4F" },
    { name: "Gout", value: menuCounts.gout, color: "#FF8718" },
    { name: "Both", value: menuCounts.both, color: "#e4e8ef" },
  ];

  return (
    <section className="content-area-cards">
      <AreaCard
        colors={["#e4e8ef", "#FF8718"]}
        percentFillValue={0}
        cardInfo={{
          title: "Doanh thu",
          value: "0",
        }}
      />
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
        colors={diseaseData.map(item => item.color)}
        additionalData={diseaseData}
        percentFillValue={((diseaseCounts.diabetes + diseaseCounts.gout + diseaseCounts.both) / totalUsers) * 100}
        cardInfo={{
          title: "Xu hướng bệnh",
          value: 3,
        }}
      />
      <AreaCard
        colors={menuData.map(item => item.color)} // Set colors for menu types
        additionalData={menuData} // Use the prepared menu data
        percentFillValue={((menuCounts.gout + menuCounts.diabetes + menuCounts.both) / (menuCounts.gout + menuCounts.diabetes + menuCounts.both)) * 100} // Adjust this as needed
        cardInfo={{
          title: "Xu hướng menu",
          value: 3,
        }}
      />
      <AreaCard
        colors={["#4CAF4F","#FF8718","#e4e8ef"]}
        additionalData={[
          { name: "Diabetes", value: menuCounts.diabetes },
          { name: "Gout", value: menuCounts.gout },
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
