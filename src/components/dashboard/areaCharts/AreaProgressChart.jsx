import { useEffect, useState } from "react";
import { fetchAllDietitians } from "../../../services/dietitianService";

const AreaProgressChart = () => {
  const [dietitians, setDietitians] = useState([]);

  useEffect(() => {
    const getDietitians = async () => {
      try {
        const response = await fetchAllDietitians();
        const filteredDietitians = response.results
          .filter(dietitian => dietitian.menus.length > 0) // Lọc những chuyên gia có menu
          .map(dietitian => ({
            name: dietitian.name,
            menuCount: dietitian.menus.length
          }))
          .sort((a, b) => b.menuCount - a.menuCount); // Sắp xếp giảm dần theo số lượng menu

        setDietitians(filteredDietitians);
      } catch (error) {
        console.error("Failed to fetch dietitians", error);
      }
    };

    getDietitians();
  }, []);

  // Tìm số lượng menu lớn nhất
  const maxMenuCount = dietitians.length > 0 ? dietitians[0].menuCount : 1;

  return (
    <div className="progress-bar">
      <div className="progress-bar-info">
        <h4 className="progress-bar-title">Chuyên gia dinh dưỡng nhiều menu nhất</h4>
      </div>
      <div className="progress-bar-list">
        {dietitians.map((dietitian, index) => {
          const percentValues = (dietitian.menuCount / maxMenuCount) * 100; // Tính % dựa trên maxMenuCount
          return (
            <div className="progress-bar-item" key={index}>
              <div className="bar-item-info">
                <p className="bar-item-info-name">{dietitian.name}</p>
                <p className="bar-item-info-value">{dietitian.menuCount} menus</p>
              </div>
              <div className="bar-item-full">
                <div
                  className="bar-item-filled"
                  style={{
                    width: `${percentValues}%`, // Thanh biểu đồ dựa trên % so với maxMenuCount
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AreaProgressChart;
