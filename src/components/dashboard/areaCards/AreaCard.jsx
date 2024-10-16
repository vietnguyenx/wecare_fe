import PropTypes from "prop-types";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

const AreaCard = ({ colors, percentFillValue, cardInfo, additionalData }) => {
  const filledValue = (percentFillValue / 100) * 360; // 360 degrees for a full circle
  const remainedValue = 360 - filledValue;

  // Kiểm tra xem đây có phải là card doanh thu hay không (thông qua title)
  const isRevenueCard = cardInfo.title === "Doanh thu";

  // Nếu là card doanh thu, sử dụng dữ liệu riêng cho tooltip
  const data = isRevenueCard
    ? [
        { name: "Mục tiêu", value: remainedValue },
        { name: "Hiện tại", value: filledValue },
      ]
    : additionalData // Use additional data if available
    ? additionalData
    : [
        { name: "Free", value: remainedValue },
        { name: "Premium", value: filledValue },
      ];

  // Function to format tooltip content
  const renderTooltipContent = (value, name) => {
    const totalValue = data.reduce((sum, entry) => sum + entry.value, 0); // Calculate total value
    const percentage = ((value / totalValue) * 100).toFixed(2); // Calculate percentage
    return `${name}: ${percentage}%`; // Display percentage in tooltip
  };

  return (
    <div className="area-card">
      <div className="area-card-info">
        <h5 className="info-title">{cardInfo.title}</h5>
        <div className="info-value">{cardInfo.value}</div>
        <p className="info-text">{cardInfo.text}</p>
      </div>
      <div className="area-card-chart">
        <PieChart width={100} height={100}>
          <Pie
            data={data}
            cx={50}
            cy={45}
            innerRadius={20}
            fill="#e4e8ef"
            paddingAngle={0}
            dataKey="value"
            startAngle={-270}
            endAngle={90} // Changed from 150 to 90 for better visualization
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value, name) => renderTooltipContent(value, name)} 
            cursor={false}
          />
        </PieChart>
      </div>
    </div>
  );
};

AreaCard.propTypes = {
  colors: PropTypes.array.isRequired,
  percentFillValue: PropTypes.number.isRequired,
  cardInfo: PropTypes.object.isRequired,
  additionalData: PropTypes.array, // Add prop for additional data
};

export default AreaCard;
