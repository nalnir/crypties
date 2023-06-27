import * as React from 'react';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <div className='flex items-center'>
      <div className='w-full mr-1'>
        <LinearProgress variant="determinate" {...props} />
      </div>
      <div className='w-min-25'>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </div>
    </div>
  );
}