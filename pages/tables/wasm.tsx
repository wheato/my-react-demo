import type { NextPage } from "next";
import { styled, Theme } from "@mui/material/styles";
import {
  Avatar,
  Button,
  Card,
  Chip,
  Container,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { useEffect, useState, useRef, useCallback } from "react";

import type { DataItem } from "../../typings";
import { skeletonData } from "../../constant";
import { ActionTypes } from "../../workers/shared";
import NoSsr from '@mui/base/NoSsr';
import { useVirtual } from 'react-virtual';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const API_URL = "/api/apes/list";

const ApeTableHeader = () => {
  return (
    <TableHead>
      <TableRow>
        <StyledTableCell sx={{width: 100}} align="left">Image</StyledTableCell>
        <StyledTableCell sx={{width: 100}} align="left">Token ID</StyledTableCell>
        <StyledTableCell sx={{width: 100}} align="left">rarity</StyledTableCell>
        <StyledTableCell sx={{width: 670}} align="left">Traits</StyledTableCell>
        <StyledTableCell align="left">Token</StyledTableCell>
      </TableRow>
    </TableHead>
  );
};

const Item = styled(TableCell)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center'
}));

const VirutalizedApesList: React.FC<any> = ({ loading, data, defaultData }) => {
  const parentRef = useRef()

  const rowVirtualizer = useVirtual({
    size: data.length,
    parentRef,
    estimateSize: useCallback(() => 89, []),
    overscan: 10,
  })

  const renderApeRow =(virtualRow: any) => {
    console.log(virtualRow.index);
    const item:DataItem = data[virtualRow.index] ?? defaultData[0];
    return (
      <Stack
        direction="row" 
        key={`${item.token}${item.token_id}-${virtualRow.index}`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: `${virtualRow.size}px`,
          transform: `translateY(${virtualRow.start}px)`,
        }}
      >
        <Item sx={{width: 100}}>
          {loading ? (
            <Skeleton
              animation="wave"
              variant="circular"
              width={56}
              height={56}
            />
          ) : (
            <Avatar
              src={item.image}
              alt="Vercel Logo"
              sx={{ width: 56, height: 56 }}
              imgProps={{ loading: "lazy" }}
            />
          )}
        </Item>
        <Item sx={{width: 100}}>
          {loading ? <Skeleton animation="wave" /> : item.token_id}
        </Item>
        <Item sx={{width: 100}}>
          {loading ? <Skeleton animation="wave" /> : item.rarity}
        </Item>
        <Item sx={{width: 670}}>
          {loading ? (
            <Skeleton animation="wave" />
          ) : (
            item.traits.map((trait) => {
              return (
                <Chip
                  key={trait.traitType}
                  label={trait.value}
                  style={{ marginRight: 4 }}
                />
              );
            })
          )}
        </Item>
        <Item style={{flex: 1}}>
          {loading ? <Skeleton animation="wave" /> : (item.token || 'no')}
        </Item>
      </Stack>
    )
  }

  return (
    <div style={{ 
        width: '100%',
        height: '80vh',
        overflow: 'auto'
      }} 
      ref={parentRef as any}>
      <div style={{
        height: `${rowVirtualizer.totalSize}px`,
        width: '100%',
        position: 'relative',
      }}>
        {rowVirtualizer.virtualItems.map(renderApeRow)}
      </div>
    </div>
  )
}

const WasmTable: NextPage = () => {
  const [list, updateList] = useState<DataItem[]>([]);
  const source = useRef<DataItem[]>([]);

  const [isSorting, setSorting] = useState(false);
  const [isFetching, setFetching] = useState(false);
  
  const tsWorkerRef = useRef<Worker | null>();

  const onSortByRarity = () => {
    if (tsWorkerRef?.current) {
      setSorting(true);
      tsWorkerRef.current.postMessage({ type: ActionTypes.SORT_BY_RARITY, payload: null });
      setSorting(false);
    }
  }
  const onSortById = () => {
    if (tsWorkerRef?.current) {
      setSorting(true);
      tsWorkerRef.current.postMessage({ type: ActionTypes.SORT_BY_ID, payload: null });
      setSorting(false);
    };
  }
  useEffect(() => {
    tsWorkerRef.current = new Worker(
      new URL('../../workers/ts.worker.ts', import.meta.url)
    );
  
    tsWorkerRef.current.addEventListener('message', (evt) => {
      const list = evt.data.payload;
      const repeatedList: DataItem[] = [];
      for (let i = 0; i < 1000; i++) {
        repeatedList.push(...list);
      }
      source.current = [...repeatedList];
      updateList(() => repeatedList);
      setFetching(false);
    });

    setFetching(true);
    tsWorkerRef.current.postMessage({ type: ActionTypes.FETCH, payload: API_URL });

  }, []);

  return (
      <Container style={{
        height: '100vh'
      }}  id="main-page-inner">
        <Typography variant="h2" component="h2">
          WebAssembly Table
        </Typography>
        <Grid container spacing={2} style={{ marginBottom: 16 }}>
          <Grid item xs={4}>
            <Button variant="contained" onClick={onSortByRarity}>按 Rarity 排序</Button>
          </Grid>
          <Grid item xs={4}>
            <Button variant="contained" onClick={onSortById}>按 ID 排序</Button>
          </Grid>
          <Grid item xs={4}>
            <Typography component="p">Total: {list.length}</Typography>
          </Grid>
        </Grid>
        <TableContainer component={Paper}>
          <Table
            sx={{ minWidth: 700 }}
            aria-label="customized table"
          >
            <ApeTableHeader />
          </Table>
          <VirutalizedApesList loading={isSorting || isFetching} data={list} defaultData={skeletonData} />
        </TableContainer>
      </Container>
  );
};
export default WasmTable;


// const WasmTable: NextPage = () => {
//   const wasmWorkerRef = useRef<Worker | null>();
//   const [wasmWorkerMessages, setWasmWorkerMessages] = useState<String[]>([]);

//   useEffect(() => {
//     wasmWorkerRef.current = new Worker(
//       new URL('../../workers/wasm.worker.ts', import.meta.url)
//     );
  
//     wasmWorkerRef.current.addEventListener('message', (evt) => {
//       console.log('Message from TS worker:', evt.data);
//       const newMessages = [...wasmWorkerMessages, evt.data];
//       setWasmWorkerMessages(newMessages);
//     });

//     wasmWorkerRef.current.postMessage({ type: 'start' });
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return (
//     <Container>
//       <Typography component="h2" variant="h2">WebAssembly Table</Typography>
//       <Typography component="h3" variant="h3">Wasm worker messages:</Typography>
//       <pre>
//         {wasmWorkerMessages
//           .map((msg) => JSON.stringify(msg, null, 2))
//           .join('\n\n')}
//       </pre>
//     </Container>
//   );
// }
// export default WasmTable
