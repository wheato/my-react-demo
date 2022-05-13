import type { NextPage } from "next";
import { styled, Theme } from "@mui/material/styles";
import {
  Avatar,
  Button,
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
import useSWR from "swr";
import type { DataItem } from "../../typings";
import { skeletonData } from "../../constant";
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

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const API_URL = "/api/apes/list";

const fetcher = (...args: [any, any]) =>
  fetch(...args).then((res) => res.json());

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

const VirtualTable: NextPage = () => {
  const [list, updateList] = useState<DataItem[]>([]);
  const source = useRef<DataItem[]>([]);
  const [isSorting, setSorting] = useState(false);
  const { data, error } = useSWR(API_URL, fetcher);
  const [costTime, setCostTime] = useState(0);

  const onSortByRarity = () => {
    setSorting(true);
    const start = performance.now();
    const sorted = source.current.sort((a, b) => a.rarity - b.rarity);
    updateList([...sorted]);
    const end = performance.now();
    setSorting(false);
    setCostTime(Math.round(end - start));
  }
  const onSortById = () => {
    setSorting(true);
    const start = performance.now();
    const sorted = source.current.sort((a, b) => a.token_id - b.token_id);
    updateList([...sorted]);
    const end = performance.now();
    setSorting(false);
    setCostTime(Math.round(end - start));
  }
  useEffect(() => {
    if (data) {
      const { list } = data.data;
      const repeatedList: DataItem[] = [];
      for (let i = 0; i < 1; i++) {
        repeatedList.push(...list);
      }
      source.current = [...repeatedList];
      updateList(() => repeatedList);
    }

  }, [data]);

  return (
    <Container>
      <Typography variant="h2" component="h2">
        Virtualized Table
      </Typography>
      <Grid container spacing={2} style={{ marginBottom: 16 }}>
        <Grid item xs={2}>
          <Button variant="contained" onClick={onSortByRarity}>按 Rarity 排序</Button>
        </Grid>
        <Grid item xs={2}>
          <Button variant="contained" onClick={onSortById}>按 ID 排序</Button>
        </Grid>
        <Grid item xs={2}>
          <Typography component="p"></Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography component="p">Cost: {costTime} ms</Typography>
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
        <VirutalizedApesList loading={!data || isSorting} data={list} defaultData={skeletonData} />
      </TableContainer>
    </Container>
  );
};
export default VirtualTable;
