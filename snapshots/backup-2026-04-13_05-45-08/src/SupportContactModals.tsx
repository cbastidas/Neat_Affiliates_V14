import { useState } from "react";
import ContactTelegramModal from "./ContactTelegramModal";
import ContactEmailModal from "./ContactEmailModal";

export type SupportBrand = "bluffbet" | "vidavegas" | "jackburst";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SupportContactModals({ isOpen, onClose }: Props) {
  const [isTelegramOpen, setIsTelegramOpen] = useState(false);
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<SupportBrand | null>(null);

  // When the parent says "open", we open Telegram by default
  // You can change this behavior if needed.
  if (isOpen && !isTelegramOpen && !isEmailOpen) {
    // NOTE: This is a simple approach. If you want, you can move this into a useEffect.
    setIsTelegramOpen(true);
  }

  const closeAll = () => {
    setIsTelegramOpen(false);
    setIsEmailOpen(false);
    setSelectedBrand(null);
    onClose();
  };

  const handleBrandClick = (brand: SupportBrand) => {
    // 1) Close Telegram modal
    setIsTelegramOpen(false);

    // 2) Store which brand user clicked
    setSelectedBrand(brand);

    // 3) Open Email modal (same size/position)
    setIsEmailOpen(true);
  };

  const handleCloseTelegram = () => {
    // Closing Telegram from X/backdrop closes everything (same behavior as now)
    closeAll();
  };

  const handleCloseEmail = () => {
    // Closing Email closes everything
    closeAll();
  };

  return (
    <>
      <ContactTelegramModal
        isOpen={isTelegramOpen}
        onClose={handleCloseTelegram}
        onBrandClick={handleBrandClick}
      />

      <ContactEmailModal
        isOpen={isEmailOpen}
        onClose={handleCloseEmail}
        brand={selectedBrand}
      />
    </>
  );
}
