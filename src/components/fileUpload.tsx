'use client';

import { uploadToS3 } from '@/lib/s3';
import { useMutation } from '@tanstack/react-query';
import { InboxIcon, Loader2 } from 'lucide-react';
import React from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import toast from 'react-hot-toast';

const FileUpload = () => {
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
      return res.data;
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
        const data = await uploadToS3(file);
        if (!data?.file_key || !data?.file_name) {
          toast.error('Failed to upload file');
          return;
        }
        mutate(data, {
          onSuccess: () => {
            toast.success('File uploaded successfully');
          },
          onError: () => {
            toast.error('Errro creating chat');
          },
        });
      } catch (err) {
        toast.error('Something went wrong');
        console.log(err);
      } finally {
        setUploading(false);
      }
    },
  });

  return (
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
  );
};

export default FileUpload;
