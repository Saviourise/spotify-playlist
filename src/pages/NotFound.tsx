import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";

export default function NotFound() {
  return (
    <div className="container">
      <div className="notfound">
        <div className="nf-code num">404</div>
        <h2>We could not find that page</h2>
        <p>The link may be broken or the playlist may have moved.</p>
        <Link to="/" className="btn btn-primary btn-lg">
          <Icon name="arrow-left" />
          Back to home
        </Link>
      </div>
    </div>
  );
}
