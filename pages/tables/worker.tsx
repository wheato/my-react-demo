import { Container, Typography } from '@mui/material';
import type { NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';

const WorkerTable: NextPage = () => {
  const tsWorkerRef = useRef<Worker | null>();
  const [tsWorkerMessages, setTsWorkerMessages] = useState<String[]>([]);

  useEffect(() => {
    tsWorkerRef.current = new Worker(
      new URL('../../workers/ts.worker.ts', import.meta.url)
    );
  
    tsWorkerRef.current.addEventListener('message', (evt) => {
      console.log('Message from TS worker:', evt.data);
      const newMessages = [...tsWorkerMessages, evt.data];
      setTsWorkerMessages(newMessages);
    });

    tsWorkerRef.current.postMessage({ type: 'start' });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <Typography component="h2" variant="h2">Worker Table</Typography>
      <Typography component="h3" variant="h3">TS worker messages:</Typography>
      <pre>
        {tsWorkerMessages
          .map((msg) => JSON.stringify(msg, null, 2))
          .join('\n\n')}
      </pre>
    </Container>
  );
}
export default WorkerTable