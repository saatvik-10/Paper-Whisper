import React from 'react';
import { Message } from '@ai-sdk/react';
import { cn } from '@/lib/utils';

type Props = {
  messages: Message[];
};

const MessageList = ({ messages }: Props) => {
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
                  'bg-indigo-800 text-indigo-200': msg.role === 'assistant',
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
