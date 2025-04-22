import React from 'react';
import { Message } from 'ai/react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

type Props = {
  messages: Message[];
  isLoading: boolean;
};

const MessageList = ({ messages, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
        <Loader2 className='w-6 h-6 animate-spin text-indigo-800' />
      </div>
    );
  }

  if (!messages) return <></>;

  return (
    <div className='flex flex-col gap-2 px-4 my-2'>
      {messages.map((msg) => {
        return (
          <div
            key={msg.id}
            className={cn('flex', {
              'justify-end pl-10': msg.role === 'user',
              'justify-start pr-10': msg.role === 'assistant',
            })}
          >
            <div
              className={cn(
                'rounded-lg text-sm ring-indigo-900/20 shadow py-1 ring-1 px-3',
                {
                  'bg-indigo-200 text-indigo-800': msg.role === 'user',
                }
              )}
            >
              <p>{msg.content}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
