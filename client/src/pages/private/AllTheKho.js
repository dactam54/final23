import React, { useEffect, useState } from "react";
import { apiGetAllTheKhos } from "../../apis";
import { Box, Modal } from "@mui/material";
import { useDispatch } from "react-redux";
import actionTypes from "../../store/actions/actionTypes";
import { format, subDays } from "date-fns";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1200,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
};
const columns = [
  { field: "id", name: "ID", width: 90 },
  { field: "id", name: "Mã sản phẩm", width: 90 },
  {
    field: "maHoaDon",
    name: "Mã ",
    width: 150,
    editable: true,
  },
  {
    field: "quantityProduct",
    name: "ID hóa đơn",
    width: 150,
    editable: true,
  },
  {
    field: "createdAt",
    name: "Loại",
    width: 150,
    editable: true,
  },
  {
    field: "createdAt",
    name: "Ngày",
    width: 150,
    editable: true,
  },
  {
    field: "action",
    name: "Thao tác",
    width: 110,
    editable: true,
  },
];
const AllTheKho = () => {
  const dispatch = useDispatch();

  const [data, setData] = useState(null);
  const [page, setPage] = useState(0);
  const [rowPerPage, setRowPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [dataModal, setDataModal] = useState([]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleRender = (id) => {
    data.map((item) => {
      item.id === id && item.hoaDons.length > 0 && setDataModal(item.hoaDons);
    });
    console.log(dataModal);
    handleOpen();
  };

  const handleChangePage = (event, newpage) => {
    setPage(newpage);
  };

  const handleRowsPerPage = (event) => {
    setRowPerPage(+event.target.value);
    setPage(0);
  };

  const fetchData = async () => {
    dispatch({ type: actionTypes.LOADING, flag: true });

    const response = await apiGetAllTheKhos({
      startDate: query.startDate || new Date(),
      endDate: query.endDate,
    });

    dispatch({ type: actionTypes.LOADING, flag: false });
    if (response.length > 0) setData(response);
    console.log("data123",response.map((item) => item));
  };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setQuery({
  //     ...query,
  //     [name]: value,
  //   });
  // };

  const [query, setQuery] = useState({
    startDate: format(subDays(new Date(), 30), "yyyy-MM-dd'T'HH:mm"),
    endDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  });


  function formatLocalTime(timestamp) {
    const localTime = new Date(timestamp).toLocaleString("vi-VN", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZoneName: "short",
    });
  
    return localTime;
  }

  useEffect(() => {
    fetchData(query.startDate, query.endDate);
  }, []);

  return (
      <div style={{ textAlign: "center" }}>
      <h3 className="font-bold text-[30px] pb-2 ">Thông tin phiếu nhập</h3>
      {/* <div>
          <label htmlFor="startdate">Ngày bắt đầu:</label>
          <input
            type="datetime-local"
            id="startdate"
            name="startDate"
            value={query.startDate}
            onChange={handleInputChange}
          />

          <label htmlFor="enddate">Ngày kết thúc:</label>
          <input
            type="datetime-local"
            id="enddate"
            name="endDate"
            value={query.endDate}
            onChange={handleInputChange}
          />
        </div> */}

      <Paper sx={{ width: "100%" }}>
        <TableContainer sx={{ maxHeight: 850 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    style={{ backgroundColor: "black", color: "white" }}
                    key={column.field}
                  >
                    {column.name}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data &&
                data?.slice(page * rowPerPage, page * rowPerPage + rowPerPage)
                  .map((row, index) => {
                    return (
                        <TableRow hover key={row.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{row.productId.slice(0, 8)}</TableCell>
                          <TableCell>{row.hoaDonId}</TableCell>
                          <TableCell>{row.hoaDon.hoaDonNhapId || row.hoaDon.hoaDonXuatId}</TableCell>
                          <TableCell>{row.type === 'nhap' ? 'Nhập hàng' :'Xuất hàng'}</TableCell>
                          <TableCell>{formatLocalTime(row.date)}</TableCell>
                          <button
                            // onClick={() => handleRender(row.id)}

                            className="py-2 px-4 mt-4 bg-green-600 rounded-md text-white font-semibold"
                          >
                            Xem chi tiết
                          </button>
                        </TableRow>
                    );
                  })}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 15, 20]}
          rowsPerPage={rowPerPage}
          page={page}
          count={data?.length}
          component="div"
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleRowsPerPage}
        ></TablePagination>
      </Paper>

      {/* {dataModal && (
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
                 Chi tiết phiếu
                </h1>

                {dataModal && (
                  <Paper>
                    <TableContainer sx={{ maxHeight: 800 }}>
                      <Table stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell>STT</TableCell>
                            <TableCell>Ảnh sản phẩm</TableCell>
                            <TableCell>Tên sản phẩm</TableCell>
                            <TableCell>Mã sản phẩm</TableCell>
                            <TableCell>Số lượng </TableCell>

                            <TableCell>Thời gian</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {dataModal?.slice(page * rowPerPage,page * rowPerPage + rowPerPage).map((row,index) => {
                            return (
                              <TableRow key={row?.id}>
                                    <TableCell>{index + 1 }</TableCell>
                                    <TableCell>
                                    <img src={row?.product?.thumb} alt=""className="h-[50px] object-contain" />
                                    </TableCell>
                                    <TableCell>{row?.product?.name}</TableCell>
                                    <TableCell>{row?.productId}</TableCell>
                                    <TableCell>{row?.quantity}</TableCell>

                                    <TableCell>{`${row?.createdAt.slice(
                                      11,
                                      19
                                    )} ${row?.createdAt.slice(
                                      0,
                                      10
                                    )}`}</TableCell>
                                  </TableRow>
                            )
                              })
                          }
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <div>
                      <TablePagination
                        rowsPerPageOptions={[10, 15, 20]}
                        rowsPerPage={rowPerPage}
                        page={page}
                        count={dataModal.length}
                        component="div"
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleRowsPerPage}
                      ></TablePagination>
                    </div>
                  </Paper>
                ) }
              </Box>
            </Modal>)
     } */}
    </div>
  );
};

export default AllTheKho;
