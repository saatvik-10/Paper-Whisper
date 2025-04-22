import ChatComponent from '@/components/ChatComponent';
import ChatSidebar from '@/components/ChatSidebar';
import PDFViewer from '@/components/PDFViewer';
import { db } from '@/lib/db';
import { chats } from '@/lib/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import React from 'react';

const ChatPage = async ({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) => {
  const { chatId } = await params;
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  //_chats is the list we get from the database
  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
  if (!_chats) {
    redirect('/');
  }

  if (!_chats.find((chat) => chat.id === parseInt(chatId))) {
    redirect('/');
  }

  const currChat = _chats.find((chat) => chat.id === parseInt(chatId));

  return (
    <div className='flex max-h-screen overflow-scroll'>
      <div className='flex w-full max-h-screen overflow-scroll'>
        {/* sidebar */}
        <div className='flex-[1.6] max-w-xs'>
          <ChatSidebar chats={_chats} chatId={parseInt(chatId)} />
        </div>

        {/* pdf viewer */}
        <div className='max-h-screen overflow-scroll flex-[5]'>
          <PDFViewer pdf_url={currChat?.pdfUrl || ''} />
        </div>

        {/* chat component */}
        <div className='flex-[3] border-l-r border-l-slate-200'>
          <ChatComponent chatId={parseInt(chatId)} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
