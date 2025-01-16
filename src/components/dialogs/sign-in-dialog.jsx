import { useGoogleLogin } from '@react-oauth/google';
import { useContext } from 'react';
import axios from 'axios';
import uuid4 from 'uuid4';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Lookup } from '@/data/lookup';
import { UserDetailsContext } from '@/context/user-details-context';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export const SignInDialog = ({ openDialog, closeDialog }) => {
  const { userDetails, setUserDetails } = useContext(UserDetailsContext);
  const CreateUser = useMutation(api.users.CreateUser);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      const userInfo = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        { headers: { Authorization: 'Bearer ' + tokenResponse.access_token } }
      );

      console.log(userInfo);
      const user = userInfo.data;
      await CreateUser({
        name: user?.name,
        email: user?.email,
        imageUrl: user?.picture,
        uid: uuid4(),
      });

      if (typeof window !== undefined) {
        localStorage.setItem('user', JSON.stringify(user));
      }
      setUserDetails(userInfo?.data);

      // Save this inside our Database
      closeDialog(false);
    },
    onError: (errorResponse) => console.log(errorResponse),
  });

  return (
    <Dialog open={openDialog} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription>
            <div className="flex flex-col items-center justify-center gap-3">
              <h2 className="font-bold text-2xl text-white text-center ">
                {Lookup.SIGNIN_HEADING}
              </h2>
              <p className="mt-2 text-center text-lg">
                {Lookup.SIGNIN_SUBHEADING}
              </p>
              <Button
                onClick={googleLogin}
                className="bg-blue-500 text-white hover:bg-blue-400 mt-3"
              >
                Sign In With Google
              </Button>
              <p className="text-center">{Lookup.SIGNIn_AGREEMENT_TEXT}</p>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
