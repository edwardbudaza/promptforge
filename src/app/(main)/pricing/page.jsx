'use client';

import { PricingModel } from '@/components/custom/pricing-model';
import { UserDetailsContext } from '@/context/user-details-context';
import { Colors } from '@/data/colors';
import { Lookup } from '@/data/lookup';
import { useContext } from 'react';

const PricingPage = () => {
  const { userDetails, setUserDetails } = useContext(UserDetailsContext);
  return (
    <div className="mt-10 flex flex-col items-center w-full p-10 md:px-32 lg:px-48">
      <h2 className="font-bold text-5xl">Pricing</h2>
      <p className="text-gray-400 max-w-xl text-center mt-4">
        {Lookup.PRICING_DESC}
      </p>
      <div
        className="p-5 border rounded-xl w-full flex justify-between mt-7 items-center"
        style={{
          backgroundColor: Colors.BACKGROUND,
        }}
      >
        <h2 className="text-lg">
          <span className="font-bold">{userDetails?.token}</span> Token(s) Left
        </h2>
        <div className="">
          <h2 className="font-medium">Need more token?</h2>
          <p>Upgrade your plan below</p>
        </div>
      </div>
      <PricingModel />
    </div>
  );
};
export default PricingPage;
