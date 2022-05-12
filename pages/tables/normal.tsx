import type { NextPage } from "next";
import { styled } from "@mui/material/styles";
import {
  Avatar,
  Button,
  Chip,
  Container,
  Grid,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { useEffect, useState, useRef } from "react";
import useSWR from "swr";
import type { DataItem } from "../../typings";
import { skeletonData } from "../../constant";

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
        <StyledTableCell align="left">Image</StyledTableCell>
        <StyledTableCell align="left">Token ID</StyledTableCell>
        <StyledTableCell align="left">rarity</StyledTableCell>
        <StyledTableCell align="left">Traits</StyledTableCell>
        <StyledTableCell align="left">Token</StyledTableCell>
      </TableRow>
    </TableHead>
  );
};

const ApeTableBody: React.FC<any> = ({ loading, data, defaultData }) => {
  return (
    <TableBody>
      {(loading ? defaultData : data).map((item: DataItem) => (
        <StyledTableRow key={`${item.token}${item.token_id}`}>
          <StyledTableCell align="left">
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
          </StyledTableCell>
          <StyledTableCell component="th" scope="row">
            {loading ? <Skeleton animation="wave" /> : item.token_id}
          </StyledTableCell>
          <StyledTableCell align="left">
            {loading ? <Skeleton animation="wave" /> : item.rarity}
          </StyledTableCell>
          <StyledTableCell align="left">
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
          </StyledTableCell>
          <StyledTableCell align="left">
            {loading ? <Skeleton animation="wave" /> : item.token}
          </StyledTableCell>
        </StyledTableRow>
      ))}
    </TableBody>
  );
};
const NormalTable: NextPage = () => {
  const [list, updateList] = useState<DataItem[]>([]);
  const source = useRef<DataItem[]>([]);
  const [isSorting, setSorting] = useState(false);
  const { data, error } = useSWR(API_URL, fetcher);

  const onSortByRarity = () => {
    setSorting(true);
    const sorted = source.current.sort((a, b) => a.rarity - b.rarity);
    updateList([...sorted]);
    setSorting(false);
  }
  const onSortById = () => {
    setSorting(true);
    const sorted = source.current.sort((a, b) => a.token_id - b.token_id);
    updateList([...sorted]);
    setSorting(false);
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
        Normal Table
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
          sx={{ minWidth: 700, maxHeight: 800 }}
          aria-label="customized table"
        >
          <ApeTableHeader />
          <ApeTableBody loading={!data || isSorting} data={list} defaultData={skeletonData} />
        </Table>
      </TableContainer>
    </Container>
  );
};
export default NormalTable;
