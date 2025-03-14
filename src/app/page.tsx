import { UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import { LogInIcon } from 'lucide-react';

export default async function Home() {
  const { userId } = await auth();
  const isAuth = !!userId; //convert to boolean

  return (
    <div className='w-screen min-h-screen bg-gradient-to-l from-gray-800 via-gray-900 to-black'>
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
        <div className='flex flex-col items-center text-center'>
          <div className='flex items-center'>
            <h1 className='mr-3 text-5xl font-semibold text-indigo-300'>
              Chat with your PDF
            </h1>
            <UserButton />
          </div>

          <div className='flex mt-2'>
            {isAuth && <Button>Go to chats</Button>}
          </div>

          <p className='text-indigo-200 max-w-xl text-lg mt-1'>
            Turn PDFs into conversations.
            <br />
            Ask questions, get insights, and explore documents like never before
          </p>

          <div className='w-full mt-4'>
            {isAuth ? (
              <h1>Upload File</h1>
            ) : (
              <Link href={'/sign-in'}>
                <Button className='bg-indigo-200 text-indigo-900 hover:cursor-pointer hover:bg-indigo-300'>
                  Unlock AI-Powered Reading
                  <LogInIcon />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
