import { useContext, useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ThemeContext } from "../../../context/ThemeContext";
import { FaArrowUpLong } from "react-icons/fa6";
import { LIGHT_THEME } from "../../../constants/themeConstants";
import { fetchAllUsers2 } from "../../../services/userService"; // Import user service
import "./AreaCharts.scss";

const AreaBarChart = () => {
  const { theme } = useContext(ThemeContext);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);

  const revenueTarget = 1000000; // Mục tiêu doanh thu mỗi tháng là 50 triệu
  const premiumUserPrice = 199000; // Giá của người dùng Premium

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await fetchAllUsers2("desc");
        const users = userResponse.results;

        // Tạo đối tượng đếm doanh thu hàng tháng
        const revenueByMonth = Array(12).fill(0);

        // Tính toán doanh thu theo tháng
        users.forEach(user => {
          const createdDate = new Date(user.createdDate);
          const month = createdDate.getMonth(); // Lấy tháng từ 0-11

          if (user.userType === 1) { // Nếu là Premium user
            revenueByMonth[month] += premiumUserPrice;
          }
        });

        // Chuyển đổi dữ liệu thành định dạng cho biểu đồ
        const chartData = revenueByMonth.map((revenue, index) => {
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          return {
            month: monthNames[index],
            revenue,
            target: revenueTarget,
          };
        });

        setMonthlyRevenueData(chartData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const formatTooltipValue = (value) => {
    return `${(value / 1000).toLocaleString()}k`;
  };

  const formatYAxisLabel = (value) => {
    return `${(value / 1000).toLocaleString()}k`;
  };

  const formatLegendValue = (value) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  return (
    <div className="bar-chart">
      <div className="bar-chart-info">
        <h5 className="bar-chart-title">Doanh Thu Tài Khoản Premium</h5>
        <div className="chart-info-data">
          <div className="info-data-value">50.4K</div>
          <div className="info-data-text">
            <FaArrowUpLong />
            <p>5% so với tháng trước.</p>
          </div>
        </div>
      </div>
      <div className="bar-chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={200}
            data={monthlyRevenueData}
            margin={{
              top: 5,
              right: 5,
              left: 0,
              bottom: 5,
            }}
          >
            <XAxis
              padding={{ left: 10 }}
              dataKey="month"
              tickSize={0}
              axisLine={false}
              tick={{
                fill: `${theme === LIGHT_THEME ? "#676767" : "#f3f3f3"}`,
                fontSize: 14,
              }}
            />
            <YAxis
              padding={{ bottom: 10, top: 10 }}
              tickFormatter={formatYAxisLabel}
              tickCount={6}
              axisLine={false}
              tickSize={0}
              tick={{
                fill: `${theme === LIGHT_THEME ? "#676767" : "#f3f3f3"}`,
              }}
            />
            <Tooltip
              formatter={formatTooltipValue}
              cursor={{ fill: "transparent" }}
            />
            <Legend
              iconType="circle"
              iconSize={10}
              verticalAlign="top"
              align="right"
              formatter={formatLegendValue}
            />
            <Bar
              dataKey="revenue"
              name="Doanh thu"
              fill="#4CAF4F"
              activeBar={false}
              isAnimationActive={false}
              barSize={24}
              radius={[4, 4, 4, 4]}
            />
            <Bar
              dataKey="target"
              name="Mục tiêu"
              fill="#FF8718"
              activeBar={false}
              isAnimationActive={false}
              barSize={24}
              radius={[4, 4, 4, 4]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AreaBarChart;
