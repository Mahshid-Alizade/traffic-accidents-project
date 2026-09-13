import "../css/InfoCard.css";

function InfoCard({ icon: Icon, subInfo, boldInfo }) {
  return (
    <div className="info-card">
      <Icon className="infocard-icon" />
      <div className="infocard-info">
        <p className="sub-info">{subInfo}</p>
        <h3 className="bold-info">{boldInfo}</h3>
      </div>
    </div>
  );
}

export default InfoCard;
