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
  const [isDataReady, setIsDataReady] = useState(false); // New state to track if data is ready

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Wait for both fetches to complete
        const [userResponse, menuResponse] = await Promise.all([
          fetchAllUsers(100), 
          fetchAllMenus(100)
        ]);

        // Extract users and menus data
        const users = userResponse.results;
        const menus = menuResponse.results;

        // Count free and premium users
        const freeCount = users.filter(user => user.userType === 0).length;
        const premiumCount = users.filter(user => user.userType === 1).length;

        // Count disease types
        const diabetesCount = users.filter(user => user.diseaseType === 0).length;
        const goutCount = users.filter(user => user.diseaseType === 1).length;
        const bothCount = users.filter(user => user.diseaseType === 2).length;

        // Count suitableFor categories in menus
        const goutMenuCount = menus.filter(menu => menu.suitableFor === 1).length;
        const diabetesMenuCount = menus.filter(menu => menu.suitableFor === 0).length;
        const bothMenuCount = menus.filter(menu => menu.suitableFor === 2).length;

        // Update state with users and menus data
        setTotalUsers(users.length);
        setFreeUsersCount(freeCount);
        setPremiumUsersCount(premiumCount);
        setDiseaseCounts({ diabetes: diabetesCount, gout: goutCount, both: bothCount });
        setMenuCounts({ gout: goutMenuCount, diabetes: diabetesMenuCount, both: bothMenuCount });

        // Mark data as ready
        setIsDataReady(true);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData(); // Call the function
  }, []);

  const totalCount = freeUsersCount + premiumUsersCount;
  const freePercent = totalCount ? (freeUsersCount / totalCount) * 100 : 0;
  const premiumPercent = totalCount ? (premiumUsersCount / totalCount) * 100 : 0;

  // Prepare data for disease trends pie chart
  const diseaseData = [
    { name: "Gout", value: diseaseCounts.gout, color: "#4CAF4F" },
    { name: "Diabetes", value: diseaseCounts.diabetes, color: "#FF8718" },
    { name: "Both", value: diseaseCounts.both, color: "#e4e8ef" },
  ];

  // Prepare data for menu trends
  const menuData = [
    { name: "Gout", value: menuCounts.gout, color: "#4CAF4F" },
    { name: "Diabetes", value: menuCounts.diabetes, color: "#FF8718" },
    { name: "Both", value: menuCounts.both, color: "#e4e8ef" },
  ];

  // Render only when data is ready
  if (!isDataReady) {
    return <div>Loading...</div>; // Or you can return a loading spinner
  }

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
