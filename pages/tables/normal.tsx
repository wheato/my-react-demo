import type { NextPage } from 'next';
import { styled } from '@mui/material/styles';
import { Container, Paper, Table, TableBody, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { useEffect, useState } from 'react';

interface DataItem {
  token: string;
  token_id: string;
  image: string;
  holder: string;
  hold_from_timestamp: number;
}

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
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const NormalTable: NextPage = () => {
  const [list, updateList] = useState<DataItem[]>([]);
  useEffect(() => {
    // fetch()
  }, [])
  return (
    <Container>
      <Typography variant="h2" component="h2">
        Normal Table
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Token ID</StyledTableCell>
              <StyledTableCell align="right">Image</StyledTableCell>
              <StyledTableCell align="right">Holder</StyledTableCell>
              <StyledTableCell align="right">Hold From Time</StyledTableCell>
              <StyledTableCell align="right">Token</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {list.map((item) => (
            <StyledTableRow key={`${item.token}${item.token_id}`}>
              <StyledTableCell component="th" scope="row">
                {item.token_id}
              </StyledTableCell>
              <StyledTableCell align="right">{item.image}</StyledTableCell>
              <StyledTableCell align="right">{item.holder}</StyledTableCell>
              <StyledTableCell align="right">{item.hold_from_timestamp}</StyledTableCell>
              <StyledTableCell align="right">{item.token}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
export default NormalTable