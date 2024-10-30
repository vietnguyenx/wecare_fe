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
  const [dailyRevenueData, setDailyRevenueData] = useState([]); // Dữ liệu doanh thu theo ngày
  const [totalRevenue, setTotalRevenue] = useState(0); // Tổng doanh thu
  const [percentageChange, setPercentageChange] = useState(0); // Tỷ lệ phần trăm thay đổi
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // Tháng đã chọn
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]); // Dữ liệu doanh thu theo tháng

  const revenueTarget = 6000000; // Mục tiêu doanh thu mỗi tháng là 1 triệu
  const premiumUserPrice = 199000; // Giá của người dùng Premium

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await fetchAllUsers2("desc");
        const users = userResponse.results;

        // Tạo đối tượng đếm doanh thu hàng tháng
        const revenueByMonth = Array(12).fill(0);
        const revenueByDay = Array(31).fill(0); // Tạo đối tượng đếm doanh thu hàng ngày

        // Tính toán doanh thu theo tháng và theo ngày
        users.forEach(user => {
          const createdDate = new Date(user.createdDate);
          const month = createdDate.getMonth(); // Lấy tháng từ 0-11
          const day = createdDate.getDate() - 1; // Lấy ngày (0-30)

          if (user.userType === 1) { // Nếu là Premium user
            revenueByMonth[month] += premiumUserPrice;
            if (month === selectedMonth) { // Nếu tháng khớp với tháng đã chọn
              revenueByDay[day] += premiumUserPrice; // Cộng doanh thu vào ngày tương ứng
            }
          }
        });

        // Chuyển đổi dữ liệu tháng thành định dạng cho biểu đồ
        const chartData = revenueByMonth.map((revenue, index) => {
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          return {
            month: monthNames[index],
            revenue,
            target: revenueTarget,
          };
        });

        setMonthlyRevenueData(chartData);

        // Chuyển đổi dữ liệu ngày thành định dạng cho biểu đồ
        const dailyChartData = revenueByDay.map((revenue, index) => {
          return {
            day: index + 1,
            revenue,
            target: revenueTarget / 31, // Mục tiêu doanh thu mỗi ngày (giả sử chia đều)
          };
        });

        setDailyRevenueData(dailyChartData);

        // Tính doanh thu tổng
        const totalRevenue = revenueByMonth.reduce((acc, curr) => acc + curr, 0);
        setTotalRevenue(totalRevenue);

        // Tính tỷ lệ phần trăm thay đổi (giữ nguyên phần này)
        const currentMonthRevenue = revenueByMonth[new Date().getMonth()];
        const previousMonthRevenue = revenueByMonth[new Date().getMonth() - 1 >= 0 ? new Date().getMonth() - 1 : 11];
        
        if (previousMonthRevenue > 0) {
          const change = ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;
          setPercentageChange(change.toFixed(2)); // Giữ hai chữ số thập phân
        } else {
          setPercentageChange(0);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, [selectedMonth]); // Khi tháng đã chọn thay đổi, gọi lại hàm fetchData

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
          <div className="info-data-value">{(totalRevenue / 1000).toLocaleString()}K</div>
          <div className="info-data-text">
            <FaArrowUpLong />
            <p>{percentageChange > 0 ? `+${percentageChange}% so với tháng trước.` : `${percentageChange}% so với tháng trước.`}</p>
          </div>
        </div>
      </div>

      <div className="bar-chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={200}
            data={dailyRevenueData}
            margin={{
              top: 5,
              right: 5,
              left: 0,
              bottom: 5,
            }}
          >
            <XAxis
              padding={{ left: 10 }}
              dataKey="day"
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

      <div className="month-selector">
        {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month, index) => (
          <button 
            key={index} 
            onClick={() => setSelectedMonth(index)} 
            className={`month-button ${selectedMonth === index ? "active" : ""}`}
          >
            {month}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AreaBarChart;
