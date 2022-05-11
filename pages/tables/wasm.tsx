import { Container, Typography } from '@mui/material';
import type { NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';

const WasmTable: NextPage = () => {
  const wasmWorkerRef = useRef<Worker | null>();
  const [wasmWorkerMessages, setWasmWorkerMessages] = useState<String[]>([]);

  useEffect(() => {
    wasmWorkerRef.current = new Worker(
      new URL('../../workers/wasm.worker.ts', import.meta.url)
    );
  
    wasmWorkerRef.current.addEventListener('message', (evt) => {
      console.log('Message from TS worker:', evt.data);
      const newMessages = [...wasmWorkerMessages, evt.data];
      setWasmWorkerMessages(newMessages);
    });

    wasmWorkerRef.current.postMessage({ type: 'start' });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <Typography component="h2" variant="h2">WebAssembly Table</Typography>
      <Typography component="h3" variant="h3">Wasm worker messages:</Typography>
      <pre>
        {wasmWorkerMessages
          .map((msg) => JSON.stringify(msg, null, 2))
          .join('\n\n')}
      </pre>
    </Container>
  );
}
export default WasmTable
