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
import { fetchAllUsers2 } from "../../../services/userService";
import "./AreaCharts.scss";

const AreaBarChart = () => {
  const { theme } = useContext(ThemeContext);
  const [dailyRevenueData, setDailyRevenueData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [percentageChange, setPercentageChange] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);

  const premiumUserPrice = 199000;

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await fetchAllUsers2("desc");
        const users = userResponse.results;
        const daysInSelectedMonth = getDaysInMonth(selectedYear, selectedMonth);
        const revenueTarget = premiumUserPrice * daysInSelectedMonth;

        const revenueByMonth = Array(12).fill(0);
        const revenueByDay = Array(daysInSelectedMonth).fill(0);

        users.forEach(user => {
          const createdDate = new Date(user.createdDate);
          const userYear = createdDate.getFullYear();
          const month = createdDate.getMonth();
          const day = createdDate.getDate() - 1;

          if (user.userType === 1 && userYear === selectedYear) {
            revenueByMonth[month] += premiumUserPrice;
            if (month === selectedMonth && day < daysInSelectedMonth) {
              revenueByDay[day] += premiumUserPrice;
            }
          }
        });

        const chartData = revenueByMonth.map((revenue, index) => {
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          return {
            month: monthNames[index],
            revenue,
            target: premiumUserPrice * getDaysInMonth(selectedYear, index),
          };
        });

        setMonthlyRevenueData(chartData);

        const dailyChartData = revenueByDay.map((revenue, index) => {
          return {
            day: index + 1,
            revenue,
            target: revenueTarget / daysInSelectedMonth,
          };
        });

        setDailyRevenueData(dailyChartData);

        const currentMonthRevenue = revenueByMonth[selectedMonth];
        setTotalRevenue(currentMonthRevenue);

        const previousMonthRevenue = revenueByMonth[selectedMonth - 1 >= 0 ? selectedMonth - 1 : 11];
        if (previousMonthRevenue > 0) {
          const change = ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;
          setPercentageChange(change.toFixed(2));
        } else {
          setPercentageChange(0);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, [selectedMonth, selectedYear]);

  const formatTooltipValue = (value) => `${(value / 1000).toLocaleString()}k`;
  const formatYAxisLabel = (value) => `${(value / 1000).toLocaleString()}k`;
  const formatLegendValue = (value) => value.charAt(0).toUpperCase() + value.slice(1);

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = 2024; year <= currentYear; year++) {
      years.push(year);
    }
    return years;
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
            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
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
            <Bar dataKey="revenue" name="Doanh thu" fill="#4CAF4F" isAnimationActive={false} barSize={24} radius={[4, 4, 4, 4]} />
            <Bar dataKey="target" name="Mục tiêu" fill="#FF8718" isAnimationActive={false} barSize={24} radius={[4, 4, 4, 4]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="month-year-selector">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="year-dropdown"
        >
          {generateYearOptions().map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

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
    </div>
  );
};

export default AreaBarChart;
