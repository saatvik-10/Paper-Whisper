'use client';

import { uploadToS3 } from '@/lib/s3';
import { Candy, InboxIcon } from 'lucide-react';
import React from 'react';
import { useDropzone } from 'react-dropzone';

type Props = {};

const FileUpload = (props: Props) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        alert('File size should be less than 10MB');
        return;
      }
      try {
        const data = await uploadToS3(file);
      } catch (err) {
        console.log(err);
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
        <>
          <InboxIcon className='h-9 w-9 text-indigo-600' />
          <p className='mt-2 text-sm text-indigo-600'>Drop your PDF here</p>
        </>
      </div>
    </div>
  );
};

export default FileUpload;
