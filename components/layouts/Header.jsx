'use client';

import React, { memo, useContext, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import AuthContext from '@/context/AuthContext';

const Header = memo(() => {
  const { user, setUser } = useContext(AuthContext);
  const pathName = usePathname();

  const { data } = useSession();

  useEffect(() => {
    if (data) {
      setUser(data?.user);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <header className="bg-white py-2 border-b">
      <div className="container max-w-(--breakpoint-xl) mx-auto px-4">
        <div className="flex flex-wrap items-center">
          <div className="shrink-0 mr-5">
            <Image
              priority
              src="/images/logo.png"
              height={40}
              width={120}
              alt="BuyItNow"
              style={{ width: '100%', height: 'auto' }}
            />
          </div>

          <div className="flex items-center space-x-2 ml-auto">
            {pathName !== '/' && user && (
              <div className="flex items-center mb-4 space-x-3 mt-4">
                <Image
                  className="w-10 h-10 rounded-full"
                  src={user?.avatar ? user?.avatar?.url : '/images/default.png'}
                  width={10}
                  height={10}
                  alt="header profile image"
                />
                <div className="space-y-1 font-medium">
                  <p>
                    {user?.name}
                    <time className="block text-sm text-gray-500 dark:text-gray-400">
                      {user?.email}
                    </time>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;
