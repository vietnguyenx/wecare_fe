import AreaCard from "./AreaCard";
import "./AreaCards.scss";

const AreaCards = () => {
  return (
    <section className="content-area-cards">
      <AreaCard
        colors={["#e4e8ef", "#f29a2e"]}
        percentFillValue={80} // 80% cho Premium
        cardInfo={{
          title: "Lượt truy cập",
          value: "0",
        }}
      />
      <AreaCard
        colors={["#e4e8ef", "#f29a2e"]}
        percentFillValue={50}
        cardInfo={{
          title: "Doanh thu",
          value: "150",
        }}
      />
      <AreaCard
        colors={["#e4e8ef", "#f29a2e"]}
        percentFillValue={60} // 60% cho Premium
        cardInfo={{
          title: "Người dùng Premium",
          value: "80",
        }}
      />
      <AreaCard
        colors={["#e4e8ef", "#f29a2e"]}
        additionalData={[
          { name: "Gout", value: 20 }, // Giá trị cho Gout
          { name: "Diabetes", value: 80 }, // Giá trị cho Diabetes
        ]}
        percentFillValue={100} // 100% cho Gout và Diabetes
        cardInfo={{
          title: "Xu hướng bệnh",
          value: "Tiểu đường",
        }}
      />
      <AreaCard
        colors={["#e4e8ef", "#f29a2e"]}
        additionalData={[
          { name: "Gout", value: 50 }, // Giá trị cho Gout
          { name: "Diabetes", value: 50 }, // Giá trị cho Diabetes
        ]}
        percentFillValue={100} // 100% cho Gout và Diabetes
        cardInfo={{
          title: "Tổng số thực đơn",
          value: "2935",
        }}
      />
    </section>
  );
};

export default AreaCards;
