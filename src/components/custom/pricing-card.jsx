import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserDetailsContext } from '@/context/user-details-context';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { useMutation } from 'convex/react';
import { ArrowRight, Check, Infinity, Rocket, Star, Zap } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { api } from '../../../convex/_generated/api';

export const PricingCard = ({ pricing, popular = false }) => {
  const { userDetails, setUserDetails } = useContext(UserDetailsContext);
  const [selectedOption, setSelectedOption] = useState();
  const UpdateToken = useMutation(api.users.UpdateToken);
  useEffect(() => {}, []);

  const getIcon = (name) => {
    switch (name) {
      case 'Basic':
        return <Zap className="w-5 h-5 text-gray-400" />;
      case 'Starter':
        return <Star className="w-5 h-5 text-gray-400" />;
      case 'Pro':
        return <Rocket className="w-5 h-5 text-gray-400" />;
      default:
        return <Infinity className="w-5 h-5 text-gray-400" />;
    }
  };

  const onPaymentSuccess = async () => {
    const token = Number(userDetails?.token) + Number(selectedOption?.value);
    console.log(token);
    await UpdateToken({
      token: token,
      userId: userDetails?._id,
    });
  };

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-300 hover:scale-105 bg-gray-900 ${
        popular
          ? 'border-gray-700 shadow-lg shadow-gray-900/50'
          : 'border-gray-800'
      }`}
    >
      {popular && (
        <Badge className="absolute right-4 top-4 bg-gray-800 text-gray-300">
          Most Popular
        </Badge>
      )}
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-gray-800/50">
            {getIcon(pricing.name)}
          </div>
          <h2 className="font-bold text-2xl text-gray-200">{pricing.name}</h2>
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline space-x-1">
            <span className="text-4xl font-bold text-gray-200">
              ${pricing.price}
            </span>
          </div>
          <p className="text-gray-400">{pricing.desc}</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300">{pricing.tokens} Tokens</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300">24/7 Support</span>
          </div>
        </div>

        {/* <Button
          className="w-full group"
          variant={popular ? 'default' : 'outline'}
        >
          <span>
            {pricing.name === 'Unlimted (License)'
              ? 'Upgrade to Unlimited'
              : `Upgrade to ${pricing.name}`}
          </span>
          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
        </Button> */}
        <PayPalButtons
          onClick={() => setSelectedOption(pricing)}
          disabled={!userDetails}
          style={{
            layout: 'horizontal', // Align buttons vertically
            color: 'blue', // Button color (options: 'gold', 'blue', 'silver', 'white', 'black')
            shape: 'pill', // Rounded buttons
            label: 'pay', // Simplify button text
          }}
          onApprove={() => onPaymentSuccess()}
          onCancel={() => console.log('Payment canceled')}
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: pricing.price,
                    currency_code: 'USD',
                  },
                },
              ],
            });
          }}
        />
      </CardContent>
    </Card>
  );
};
