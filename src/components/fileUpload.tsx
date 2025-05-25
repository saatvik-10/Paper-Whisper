'use client';

import { useMutation } from '@tanstack/react-query';
import { InboxIcon, Loader2 } from 'lucide-react';
import React from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const FileUpload = () => {
  const route = useRouter();

  const [uploading, setUploading] = React.useState(false);

  const { mutate } = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
    }: {
      file_key: string;
      file_name: string;
    }) => {
      const res = await axios.post('/api/create-chat', {
        file_key,
        file_name,
      });
      return res.data; //chat_id
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }

      try {
        setUploading(true);
        // 1. Get pre-signed URL from API
        const presignRes = await fetch('/api/s3-presign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName: file.name, fileType: file.type }),
        });
        const { uploadUrl, fileKey, error } = await presignRes.json();
        if (!uploadUrl || !fileKey) {
          toast.error('Failed to get S3 upload URL');
          return;
        }
        // 2. Upload file directly to S3
        const uploadRes = await fetch(uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file,
        });
        if (!uploadRes.ok) {
          toast.error('Failed to upload file to S3');
          return;
        }
        // 3. Continue with chat creation
        mutate(
          { file_key: fileKey, file_name: file.name },
          {
            onSuccess: ({ chat_id }) => {
              toast.success('Chat created');
              route.push(`chat/${chat_id}`);
            },
            onError: (err) => {
              toast.error('Error creating chat');
            },
          }
        );
      } catch (err) {
        toast.error('Something went wrong');
      } finally {
        setUploading(false);
      }
    },
  });

  return (
    <>
      <div className='p-2 rounded-xl bg-indigo-200'>
        <div
          {...getRootProps({
            className:
              'border-dashed border-2 rounded-xl cursor-pointer border-indigo-500 bg-indigo-100 py-4 flex justify-center items-center flex-col',
          })}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <>
              <Loader2 className='animate-spin text-indigo-800 h-8 w-8' />
              <p className='mt-2 text-sm text-ingdigo-700'>
                Neural circuits engaged... espere por favor !
              </p>
            </>
          ) : (
            <>
              <InboxIcon className='h-9 w-9 text-indigo-600' />
              <p className='mt-2 text-sm text-indigo-600'>Drop your PDF here</p>
            </>
          )}
        </div>
      </div>
      <span className='text-indigo-200 text-sm'>
        Please wait for some time for the file to upload!
      </span>
    </>
  );
};

export default FileUpload;
