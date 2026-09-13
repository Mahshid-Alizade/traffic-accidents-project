import "../css/PageHeader.css";
import "../css/variables.css";

function PageHeader({ title, subtitle }) {
  return (
    <div className="header">
      <h2 className="title">{title}</h2>
      <p className="subtitle">{subtitle}</p>
    </div>
  );
}

export default PageHeader;
