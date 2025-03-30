import { DrizzleChat } from '@/lib/db/schema';
import Link from 'next/link';
import React from 'react';
import { Button } from './ui/button';
import { MessageCircleIcon, PlusCircleIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  chats: DrizzleChat[];
  chatId: number;
};

const ChatSidebar = ({ chats, chatId }: Props) => {
  return (
    <div className='w-full h-screen p-4 text-indigo-200 bg-gray-900'>
      <Link href='/'>
        <Button className='w-full border-dashed bg-indigo-200 border-indigo-900  text-indigo-900 font-bold border hover:cursor-pointer hover:bg-indigo-300'>
          <PlusCircleIcon className='w-4 h-4' />
          New Chat
        </Button>
      </Link>

      <div className='flex flex-col gap-2 mt-4'>
        {chats.map((chat) => (
          <Link href={`/chat/${chat.id}`} key={chat.id}>
            <div
              className={cn(
                'rounded-lg p-2 text-indigo-300 flex items-center',
                {
                  'bg-indigo-900 text-indigo-200': chat.id === chatId,
                  'hover:bg-indigo-900': chat.id !== chatId,
                }
              )}
            >
              <p className='w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis flex items-center font-semibold'>
                <MessageCircleIcon className='mr-2' />
                {chat.pdfName}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className='absolute bottom-4 left-4'>
        <div className='flex items-center gap-2 text-sm text-indigo-200 flex-wrap font-semibold'>
          <Link className='hover:underline' href='/'>
            Home
          </Link>
          <Link className='hover:underline' href='/'>
            Source
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
