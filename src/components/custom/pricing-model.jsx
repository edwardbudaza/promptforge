import { Lookup } from '@/data/lookup';
import { PricingCard } from './pricing-card';

export const PricingModel = () => {
  return (
    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Lookup.PRICING_OPTIONS.map((pricing, index) => (
        <PricingCard
          key={pricing.name}
          pricing={pricing}
          popular={index === 2}
        />
      ))}
    </div>
  );
};

export default PricingModel;
