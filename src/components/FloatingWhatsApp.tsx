import { Icon } from "./Icon";
import { whatsappUrl } from "../data/site";

// Fixed WhatsApp chat button, shown on every page.
export function FloatingWhatsApp() {
  return (
    <a
      className="wa-fab"
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
    >
      <Icon name="whatsapp" />
    </a>
  );
}
