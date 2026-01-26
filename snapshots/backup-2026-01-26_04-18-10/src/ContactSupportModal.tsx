import { useEffect, useState } from "react";
import ContactTelegramModal from "./ContactTelegramModal";
import ContactEmailModal from "./ContactEmailModal";

export type SupportBrand = "bluffbet" | "vidavegas" | "jackburst";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ContactSupportModal({ isOpen, onClose }: Props) {
  const [isTelegramOpen, setIsTelegramOpen] = useState(false);
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [brand, setBrand] = useState<SupportBrand | null>(null);

  // When parent opens ContactSupportModal, Telegram is the default view
  useEffect(() => {
    if (isOpen) {
      setIsTelegramOpen(true);
      setIsEmailOpen(false);
      setBrand(null);
    } else {
      setIsTelegramOpen(false);
      setIsEmailOpen(false);
      setBrand(null);
    }
  }, [isOpen]);

  const closeAll = () => {
    setIsTelegramOpen(false);
    setIsEmailOpen(false);
    setBrand(null);
    onClose();
  };

  const handleBrandClick = (selected: SupportBrand) => {
    // 1) Close Telegram modal
    setIsTelegramOpen(false);

    // 2) Store which brand was clicked
    setBrand(selected);

    // 3) Open Email modal (same size/position)
    setIsEmailOpen(true);
  };

  return (
    <>
      <ContactTelegramModal
        isOpen={isTelegramOpen}
        onClose={closeAll}
        onBrandClick={handleBrandClick}
      />

      <ContactEmailModal
        isOpen={isEmailOpen}
        onClose={closeAll}
        brand={brand}
      />
    </>
  );
}
