import { Link } from "react-router-dom";
import { Icon } from "./Icon";

interface SectionHeadProps {
  eyebrow: string;
  title: string;
  desc?: string;
  action?: { label: string; to: string };
}

export function SectionHead({ eyebrow, title, desc, action }: SectionHeadProps) {
  return (
    <div className="sec-head">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="sec-title">{title}</h2>
        {desc ? <p className="sec-desc">{desc}</p> : null}
      </div>
      {action ? (
        <Link to={action.to} className="textlink">
          {action.label}
          <Icon name="chevron-right" />
        </Link>
      ) : null}
    </div>
  );
}
