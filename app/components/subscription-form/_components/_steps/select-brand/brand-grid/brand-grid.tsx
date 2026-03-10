import BrandBox from "@/app/components/brand-box";
import { subscriptableBrand } from "@/app/utils/brand/brand";
import { SubscriptableBrandType } from "@/app/utils/brand/type";

interface Props {
  brandKeys: SubscriptableBrandType[];
  selectedBrand: SubscriptableBrandType | null;
  onSelect: (brand: SubscriptableBrandType) => void;
}

export default function BrandGrid({
  brandKeys,
  selectedBrand,
  onSelect,
}: Props) {
  return (
    <div className="grid grid-cols-3">
      {brandKeys.map((brandKey) => (
        <div
          key={brandKey}
          className="flex flex-col gap-2 justify-center items-center h-34"
        >
          <BrandBox
            brandType={brandKey}
            size="lg"
            isActive={selectedBrand === brandKey}
            onClick={() => onSelect(brandKey)}
          />
          <span className="body-lg text-gray-400">
            {subscriptableBrand[brandKey].label}
          </span>
        </div>
      ))}
    </div>
  );
}
